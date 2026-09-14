import React from 'react';
import { Link } from 'react-router-dom';

const getCategoryColor = (category) => {
  switch (category) {
    case 'Technology':
      return 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
    case 'Science':
      return 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    case 'Fiction':
      return 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
    case 'History':
      return 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
    case 'Biography':
      return 'linear-gradient(135deg, #db2777 0%, #be185d 100%)';
    case 'Education':
      return 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)';
    default:
      return 'linear-gradient(135deg, #475569 0%, #334155 100%)';
  }
};

const BookCard = ({ book }) => {
  const isAvailable = book.availableQuantity > 0;

  return (
    <div className="card h-100 custom-card">
      <div
        className="book-cover-placeholder text-white"
        style={{ background: getCategoryColor(book.category) }}
      >
        <i className="bi bi-book"></i>
      </div>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge badge-category">{book.category}</span>
          <span className={`badge ${isAvailable ? 'badge-available' : 'badge-out-of-stock'}`}>
            {isAvailable ? `${book.availableQuantity} Available` : 'Out of Stock'}
          </span>
        </div>

        <h5 className="card-title fw-bold text-dark mb-1 text-truncate" title={book.title}>
          {book.title}
        </h5>
        <p className="text-muted small mb-2">
          <i className="bi bi-person me-1"></i>
          {book.author}
        </p>

        {book.description && (
          <p className="card-text small text-secondary mb-3 text-truncate" style={{ maxHeight: '2.5rem' }}>
            {book.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
          <small className="text-muted">
            <i className="bi bi-calendar3 me-1"></i> {book.publishedYear || 'N/A'}
          </small>
          <Link to={`/books/${book._id}`} className="btn btn-sm btn-outline-primary">
            View Details <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
