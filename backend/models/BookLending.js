const mongoose = require('mongoose');

const bookLendingSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      required: true
    },
    action: {
      type: String,
      enum: ['Issued', 'Returned'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BookLending', bookLendingSchema);
