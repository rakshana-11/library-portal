const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getRecommendations
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes for viewing books & smart recommendations
router.get('/', getBooks);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id', getBookById);

// Protected routes for managing books (Librarian & Admin)
router.post('/', protect, authorize('librarian', 'admin'), createBook);
router.put('/:id', protect, authorize('librarian', 'admin'), updateBook);
router.delete('/:id', protect, authorize('librarian', 'admin'), deleteBook);

module.exports = router;
