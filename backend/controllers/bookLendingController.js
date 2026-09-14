const BookLending = require('../models/BookLending');

// @desc    Get all book lending history records
// @route   GET /api/booklending
// @access  Private (Librarian, Admin)
const getBookLendings = async (req, res) => {
  try {
    const { action } = req.query;
    let query = {};
    if (action) {
      query.action = action;
    }

    const lendings = await BookLending.find(query)
      .populate('bookId', 'title author isbn')
      .populate('memberId', 'name email membershipId')
      .populate('loanId', 'issueDate dueDate returnDate status')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: lendings.length,
      lendings
    });
  } catch (error) {
    console.error('getBookLendings error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Create book lending record
// @route   POST /api/booklending
// @access  Private (Librarian, Admin)
const createBookLending = async (req, res) => {
  try {
    const { bookId, memberId, loanId, action } = req.body;

    if (!bookId || !memberId || !loanId || !action) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const lending = await BookLending.create({
      bookId,
      memberId,
      loanId,
      action
    });

    return res.status(201).json({
      success: true,
      message: 'Book lending record created',
      lending
    });
  } catch (error) {
    console.error('createBookLending error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update book lending record
// @route   PUT /api/booklending/:id
// @access  Private (Admin)
const updateBookLending = async (req, res) => {
  try {
    const { action } = req.body;
    const lending = await BookLending.findById(req.params.id);

    if (!lending) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    if (action) lending.action = action;
    await lending.save();

    return res.json({
      success: true,
      message: 'Lending record updated',
      lending
    });
  } catch (error) {
    console.error('updateBookLending error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete book lending record
// @route   DELETE /api/booklending/:id
// @access  Private (Admin)
const deleteBookLending = async (req, res) => {
  try {
    const lending = await BookLending.findById(req.params.id);
    if (!lending) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    await BookLending.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Lending history record deleted'
    });
  } catch (error) {
    console.error('deleteBookLending error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

module.exports = {
  getBookLendings,
  createBookLending,
  updateBookLending,
  deleteBookLending
};
