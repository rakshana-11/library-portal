const express = require('express');
const router = express.Router();
const {
  getLoans,
  getLoanById,
  issueBook,
  returnBook,
  updateLoan,
  deleteLoan
} = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getLoans);
router.get('/:id', getLoanById);

// Issue & Return
router.post('/', authorize('librarian', 'admin'), issueBook);
router.put('/:id/return', authorize('librarian', 'admin'), returnBook);
router.put('/:id', authorize('librarian', 'admin'), updateLoan);
router.delete('/:id', authorize('librarian', 'admin'), deleteLoan);

module.exports = router;
