import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center my-5">
      <div className="mb-4">
        <span className="display-1 fw-bold text-primary">404</span>
      </div>
      <h2 className="fw-bold text-dark mb-2">Page Not Found</h2>
      <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '450px' }}>
        The library page you are looking for might have been moved, removed, or is temporarily unavailable.
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/" className="btn btn-primary px-4 fw-semibold">
          <i className="bi bi-house me-2"></i> Return Home
        </Link>
        <Link to="/books" className="btn btn-outline-secondary px-4">
          <i className="bi bi-book me-2"></i> Browse Books
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
