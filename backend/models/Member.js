const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    name: {
      type: String,
      required: [true, 'Please provide member name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide member email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
      trim: true
    },
    year: {
      type: String,
      default: '1st Year',
      trim: true
    },
    membershipId: {
      type: String,
      required: [true, 'Please provide membership ID'],
      unique: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Member', memberSchema);
