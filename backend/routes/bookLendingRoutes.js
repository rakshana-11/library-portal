const express = require('express');
const router = express.Router();
const {
  getBookLendings,
  createBookLending,
  updateBookLending,
  deleteBookLending
} = require('../controllers/bookLendingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('librarian', 'admin'));

router.get('/', getBookLendings);
router.post('/', createBookLending);
router.put('/:id', updateBookLending);
router.delete('/:id', deleteBookLending);

module.exports = router;
