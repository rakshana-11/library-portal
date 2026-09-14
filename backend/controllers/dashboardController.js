const Book = require('../models/Book');
const Member = require('../models/Member');
const Loan = require('../models/Loan');
const User = require('../models/User');

// @desc    Get dashboard statistics based on user role
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const role = req.user.role;

    // Total books in system
    const totalBooks = await Book.countDocuments();
    
    // Sum of available copies
    const books = await Book.find({}, 'quantity availableQuantity');
    const availableBooksCount = books.reduce((acc, curr) => acc + (curr.availableQuantity || 0), 0);
    const totalBookCopies = books.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

    if (role === 'admin') {
      const totalMembers = await Member.countDocuments();
      const totalLoans = await Loan.countDocuments();
      const activeLoans = await Loan.countDocuments({ status: 'Issued' });
      const returnedLoans = await Loan.countDocuments({ status: 'Returned' });
      const totalUsers = await User.countDocuments();

      const recentLoans = await Loan.find()
        .populate('bookId', 'title author')
        .populate('memberId', 'name membershipId')
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        success: true,
        role: 'admin',
        stats: {
          totalBooks,
          totalBookCopies,
          availableBooks: availableBooksCount,
          totalMembers,
          totalLoans,
          activeLoans,
          returnedLoans,
          totalUsers
        },
        recentLoans
      });
    }

    if (role === 'librarian') {
      const totalMembers = await Member.countDocuments();
      const totalLoans = await Loan.countDocuments();
      const activeLoans = await Loan.countDocuments({ status: 'Issued' });
      const returnedLoans = await Loan.countDocuments({ status: 'Returned' });

      const recentLoans = await Loan.find()
        .populate('bookId', 'title author')
        .populate('memberId', 'name membershipId')
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        success: true,
        role: 'librarian',
        stats: {
          totalBooks,
          totalBookCopies,
          availableBooks: availableBooksCount,
          totalMembers,
          totalLoans,
          activeLoans,
          returnedLoans
        },
        recentLoans
      });
    }

    // Role is Member
    const member = await Member.findOne({
      $or: [{ userId: req.user._id }, { email: req.user.email }]
    });

    let myActiveLoans = 0;
    let myReturnedLoans = 0;
    let myRecentLoans = [];

    if (member) {
      myActiveLoans = await Loan.countDocuments({ memberId: member._id, status: 'Issued' });
      myReturnedLoans = await Loan.countDocuments({ memberId: member._id, status: 'Returned' });
      myRecentLoans = await Loan.find({ memberId: member._id })
        .populate('bookId', 'title author isbn category')
        .sort({ createdAt: -1 })
        .limit(5);
    }

    return res.json({
      success: true,
      role: 'member',
      stats: {
        availableBooks: availableBooksCount,
        totalBooks,
        myActiveLoans,
        myReturnedLoans
      },
      recentLoans: myRecentLoans
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

module.exports = { getDashboardStats };
