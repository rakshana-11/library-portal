const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Protected for logged in users
router.use(protect);

// View single member details (Members can view their own profile, Librarians/Admins can view any)
router.get('/:id', getMemberById);

// Manage members (Librarian & Admin)
router.get('/', authorize('librarian', 'admin'), getMembers);
router.post('/', authorize('librarian', 'admin'), createMember);
router.put('/:id', authorize('librarian', 'admin'), updateMember);
router.delete('/:id', authorize('librarian', 'admin'), deleteMember);

module.exports = router;
