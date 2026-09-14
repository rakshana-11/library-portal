const Member = require('../models/Member');
const Loan = require('../models/Loan');
const User = require('../models/User');

// @desc    Get all members with search & department filter
// @route   GET /api/members
// @access  Private (Librarian, Admin)
const getMembers = async (req, res) => {
  try {
    const { search, department } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { membershipId: searchRegex },
        { department: searchRegex }
      ];
    }

    if (department && department !== 'All' && department.trim() !== '') {
      query.department = department;
    }

    const members = await Member.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: members.length,
      members
    });
  } catch (error) {
    console.error('getMembers error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error fetching members' });
  }
};

// @desc    Get single member details with loans
// @route   GET /api/members/:id
// @access  Private
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Fetch member loans
    const loans = await Loan.find({ memberId: member._id })
      .populate('bookId', 'title author isbn category')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      member,
      loans
    });
  } catch (error) {
    console.error('getMemberById error:', error);
    return res.status(500).json({ success: false, message: 'Invalid Member ID or server error' });
  }
};

// @desc    Create a new member
// @route   POST /api/members
// @access  Private (Librarian, Admin)
const createMember = async (req, res) => {
  try {
    const { name, email, phone, department, year, membershipId } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and department' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already registered as member
    const emailExists = await Member.findOne({ email: normalizedEmail });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Member with this email already exists' });
    }

    // Auto-generate membershipId if not provided
    let finalMembershipId = membershipId ? membershipId.trim() : null;
    if (!finalMembershipId) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      finalMembershipId = `MEM-${randomSuffix}`;
    }

    // Check membershipId uniqueness
    const idExists = await Member.findOne({ membershipId: finalMembershipId });
    if (idExists) {
      return res.status(400).json({ success: false, message: 'Membership ID already exists. Please use a unique ID.' });
    }

    // Find or create matching login User account
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: 'member123', // Default initial login password
        role: 'member'
      });
    }

    const member = await Member.create({
      userId: user._id,
      name,
      email: normalizedEmail,
      phone: phone || '',
      department,
      year: year || '1st Year',
      membershipId: finalMembershipId
    });

    return res.status(201).json({
      success: true,
      message: 'Member created successfully',
      member
    });
  } catch (error) {
    console.error('createMember error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating member' });
  }
};

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private (Librarian, Admin)
const updateMember = async (req, res) => {
  try {
    let member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const { name, email, phone, department, year, membershipId } = req.body;

    if (email && email.toLowerCase().trim() !== member.email) {
      const emailExists = await Member.findOne({ email: email.toLowerCase().trim(), _id: { $ne: member._id } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use by another member' });
      }
      member.email = email.toLowerCase().trim();
    }

    if (membershipId && membershipId.trim() !== member.membershipId) {
      const idExists = await Member.findOne({ membershipId: membershipId.trim(), _id: { $ne: member._id } });
      if (idExists) {
        return res.status(400).json({ success: false, message: 'Membership ID already in use' });
      }
      member.membershipId = membershipId.trim();
    }

    if (name) member.name = name;
    if (phone !== undefined) member.phone = phone;
    if (department) member.department = department;
    if (year) member.year = year;

    const updatedMember = await member.save();

    return res.json({
      success: true,
      message: 'Member updated successfully',
      member: updatedMember
    });
  } catch (error) {
    console.error('updateMember error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating member' });
  }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private (Librarian, Admin)
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Check active loans
    const activeLoan = await Loan.findOne({ memberId: member._id, status: 'Issued' });
    if (activeLoan) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete member who currently has issued books. Return all books first.'
      });
    }

    await Member.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('deleteMember error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error deleting member' });
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
};
