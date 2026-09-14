const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide book title'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Please provide author name'],
      trim: true
    },
    isbn: {
      type: String,
      required: [true, 'Please provide ISBN'],
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Fiction', 'Science', 'Technology', 'History', 'Biography', 'Education', 'Other'],
      default: 'Other'
    },
    publisher: {
      type: String,
      default: 'Academic Press',
      trim: true
    },
    publishedYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide total quantity'],
      min: [1, 'Quantity must be at least 1']
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: [0, 'Available quantity cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Book', bookSchema);
