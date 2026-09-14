const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Member = require('../models/Member');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'library_portal_jwt_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, department, phone, year } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Disallow admin role registration
    let assignedRole = role ? role.toLowerCase() : 'member';
    if (assignedRole === 'admin') {
      return res.status(403).json({ success: false, message: 'Admin accounts cannot be registered publicly' });
    }

    if (!['member', 'librarian'].includes(assignedRole)) {
      assignedRole = 'member';
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole
    });

    // If role is member, automatically create corresponding Member document
    let memberProfile = null;
    if (assignedRole === 'member') {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const membershipId = `LIB-MEM-${randomSuffix}`;

      memberProfile = await Member.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: phone || '',
        department: department || 'General Studies',
        year: year || '1st Year',
        membershipId
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        memberProfileId: memberProfile ? memberProfile._id : null,
        createdAt: user.createdAt
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Find linked member record if any
    let memberProfile = null;
    if (user.role === 'member') {
      memberProfile = await Member.findOne({
        $or: [{ userId: user._id }, { email: user.email }]
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        memberProfileId: memberProfile ? memberProfile._id : null,
        membershipId: memberProfile ? memberProfile.membershipId : null,
        department: memberProfile ? memberProfile.department : null,
        createdAt: user.createdAt
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let memberProfile = null;
    if (user.role === 'member') {
      memberProfile = await Member.findOne({
        $or: [{ userId: user._id }, { email: user.email }]
      });
    }

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        memberProfile: memberProfile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

module.exports = { register, login, getMe };
