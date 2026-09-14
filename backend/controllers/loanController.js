const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Member = require('../models/Member');
const BookLending = require('../models/BookLending');
const Notification = require('../models/Notification');

// @desc    Get all loans (with role filtering, status filtering & search)
// @route   GET /api/loans
// @access  Private
const getLoans = async (req, res) => {
  try {
    const { status, memberId, bookId } = req.query;
    let query = {};

    // If user is a member, restrict to their own member record
    if (req.user.role === 'member') {
      const member = await Member.findOne({
        $or: [{ userId: req.user._id }, { email: req.user.email }]
      });

      if (!member) {
        return res.json({ success: true, count: 0, loans: [] });
      }
      query.memberId = member._id;
    } else {
      if (memberId) {
        query.memberId = memberId;
      }
    }

    if (bookId) {
      query.bookId = bookId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const loans = await Loan.find(query)
      .populate('bookId', 'title author isbn category availableQuantity quantity')
      .populate('memberId', 'name email membershipId department phone')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('getLoans error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error fetching loans' });
  }
};

// @desc    Get single loan by ID
// @route   GET /api/loans/:id
// @access  Private
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('bookId', 'title author isbn category publisher publishedYear quantity availableQuantity description')
      .populate('memberId', 'name email phone department year membershipId');

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan record not found' });
    }

    // Role check: If member, ensure this loan belongs to them
    if (req.user.role === 'member') {
      const member = await Member.findOne({
        $or: [{ userId: req.user._id }, { email: req.user.email }]
      });
      if (!member || loan.memberId._id.toString() !== member._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this loan' });
      }
    }

    // Also get lending history for this loan
    const lendingHistory = await BookLending.find({ loanId: loan._id }).sort({ createdAt: 1 });

    return res.json({
      success: true,
      loan,
      history: lendingHistory
    });
  } catch (error) {
    console.error('getLoanById error:', error);
    return res.status(500).json({ success: false, message: 'Invalid Loan ID or server error' });
  }
};

// @desc    Issue a book to a member (Decrease book availableQuantity)
// @route   POST /api/loans
// @access  Private (Librarian, Admin)
const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, dueDate } = req.body;

    if (!bookId || !memberId || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide book, member, and due date' });
    }

    // 1. Check book exists and availability
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: `Book "${book.title}" is currently out of stock (Available: 0)`
      });
    }

    // 2. Check member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // 3. Optional duplicate active loan check (prevent same member taking two of the same book at once)
    const existingActiveLoan = await Loan.findOne({
      bookId: book._id,
      memberId: member._id,
      status: 'Issued'
    });
    if (existingActiveLoan) {
      return res.status(400).json({
        success: false,
        message: `Member "${member.name}" already has an active copy of "${book.title}" issued.`
      });
    }

    // 4. Create Loan
    const loan = await Loan.create({
      bookId: book._id,
      memberId: member._id,
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      status: 'Issued'
    });

    // 5. Decrease book availableQuantity by 1
    book.availableQuantity = book.availableQuantity - 1;
    await book.save();

    // 6. Create BookLending history log
    await BookLending.create({
      bookId: book._id,
      memberId: member._id,
      loanId: loan._id,
      action: 'Issued'
    });

    // 7. Create notification
    await Notification.create({
      userId: member.userId || null,
      message: `Book "${book.title}" issued to ${member.name}. Due on ${new Date(dueDate).toLocaleDateString()}`,
      type: 'info'
    });

    const populatedLoan = await Loan.findById(loan._id)
      .populate('bookId', 'title author isbn category')
      .populate('memberId', 'name email membershipId department');

    return res.status(201).json({
      success: true,
      message: 'Book issued successfully',
      loan: populatedLoan
    });
  } catch (error) {
    console.error('issueBook error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error issuing book' });
  }
};

// @desc    Mark book as returned (Increase book availableQuantity)
// @route   PUT /api/loans/:id/return (also supported via PUT /api/loans/:id)
// @access  Private (Librarian, Admin)
const returnBook = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan record not found' });
    }

    if (loan.status === 'Returned') {
      return res.status(400).json({ success: false, message: 'This book is already marked as returned' });
    }

    // 1. Update loan status and returnDate
    loan.status = 'Returned';
    loan.returnDate = new Date();
    await loan.save();

    // 2. Increase book availableQuantity by 1
    const book = await Book.findById(loan.bookId);
    if (book) {
      if (book.availableQuantity < book.quantity) {
        book.availableQuantity = book.availableQuantity + 1;
        await book.save();
      }
    }

    // 3. Create BookLending history record
    await BookLending.create({
      bookId: loan.bookId,
      memberId: loan.memberId,
      loanId: loan._id,
      action: 'Returned'
    });

    // 4. Create Notification
    const member = await Member.findById(loan.memberId);
    await Notification.create({
      userId: member && member.userId ? member.userId : null,
      message: `Book "${book ? book.title : 'Book'}" returned successfully by ${member ? member.name : 'Member'}`,
      type: 'success'
    });

    const updatedLoan = await Loan.findById(loan._id)
      .populate('bookId', 'title author isbn category')
      .populate('memberId', 'name email membershipId department');

    return res.json({
      success: true,
      message: 'Book returned successfully',
      loan: updatedLoan
    });
  } catch (error) {
    console.error('returnBook error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error returning book' });
  }
};

// @desc    Update loan (e.g. change due date or status)
// @route   PUT /api/loans/:id
// @access  Private (Librarian, Admin)
const updateLoan = async (req, res) => {
  try {
    const { dueDate, status } = req.body;

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // If status requested to be changed to 'Returned' and currently 'Issued'
    if (status === 'Returned' && loan.status === 'Issued') {
      return returnBook(req, res);
    }

    if (dueDate) {
      loan.dueDate = new Date(dueDate);
    }

    await loan.save();

    const updatedLoan = await Loan.findById(loan._id)
      .populate('bookId', 'title author isbn category')
      .populate('memberId', 'name email membershipId department');

    return res.json({
      success: true,
      message: 'Loan updated successfully',
      loan: updatedLoan
    });
  } catch (error) {
    console.error('updateLoan error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating loan' });
  }
};

// @desc    Delete a loan record
// @route   DELETE /api/loans/:id
// @access  Private (Admin)
const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // If deleted while still issued, restore book stock
    if (loan.status === 'Issued') {
      const book = await Book.findById(loan.bookId);
      if (book && book.availableQuantity < book.quantity) {
        book.availableQuantity += 1;
        await book.save();
      }
    }

    // Clean up lending history for this loan
    await BookLending.deleteMany({ loanId: loan._id });
    await Loan.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Loan record deleted successfully'
    });
  } catch (error) {
    console.error('deleteLoan error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error deleting loan' });
  }
};

module.exports = {
  getLoans,
  getLoanById,
  issueBook,
  returnBook,
  updateLoan,
  deleteLoan
};
