import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bookService from '../../services/bookService';
import Loading from '../../components/Loading';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLibrarian, isAdmin } = useAuth();

  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchBookAndRecommendations = async () => {
      try {
        setLoading(true);
        const [bookData, recData] = await Promise.all([
          bookService.getBookById(id),
          bookService.getRecommendations(id).catch(() => ({ recommendations: [] }))
        ]);

        if (bookData && bookData.book) {
          setBook(bookData.book);
        }
        if (recData && recData.recommendations) {
          setRecommendations(recData.recommendations);
        }
      } catch (err) {
        setError(err.message || 'Book not found');
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndRecommendations();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      await bookService.deleteBook(id);
      navigate('/books');
    } catch (err) {
      alert(err.message || 'Error deleting book');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading book details..." />;
  }

  if (error || !book) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning mb-4">{error || 'Book not found'}</div>
        <Link to="/books" className="btn btn-primary">
          <i className="bi bi-arrow-left me-1"></i> Back to Books
        </Link>
      </div>
    );
  }

  const isAvailable = book.availableQuantity > 0;

  return (
    <div className="container py-4">
      {/* Navigation Breadcrumb */}
      <div className="mb-4">
        <Link to="/books" className="text-decoration-none text-muted small fw-semibold">
          <i className="bi bi-arrow-left me-1"></i> Back to Book Directory
        </Link>
      </div>

      <div className="row g-4 mb-5">
        {/* Left Side: Book Icon / Cover Art Banner */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden text-center p-4" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
            <div className="py-5 text-white">
              <i className="bi bi-book-half" style={{ fontSize: '5rem' }}></i>
            </div>
            <div className="card-body bg-white rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Availability</span>
                <span className={`badge ${isAvailable ? 'badge-available' : 'badge-out-of-stock'}`}>
                  {isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">Copies in Library</span>
                <span className="fw-bold text-dark">{book.availableQuantity} / {book.quantity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Book Information */}
        <div className="col-12 col-md-8">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
              <div>
                <span className="badge badge-category mb-2">{book.category}</span>
                <h2 className="fw-bold text-dark mb-1">{book.title}</h2>
                <h5 className="text-muted fw-normal">By {book.author}</h5>
              </div>

              {/* Librarian / Admin Management Controls */}
              {(isLibrarian || isAdmin) && (
                <div className="d-flex gap-2">
                  <Link to={`/books/edit/${book._id}`} className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-pencil me-1"></i> Edit
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              )}
            </div>

            <hr className="my-4" />

            <h5 className="fw-bold text-dark mb-2">Description</h5>
            <p className="text-secondary leading-relaxed mb-4">
              {book.description || 'No detailed description available for this catalog entry.'}
            </p>

            <h5 className="fw-bold text-dark mb-3">Book Specifications</h5>
            <div className="row g-3 mb-4">
              <div className="col-6 col-sm-4">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">ISBN</div>
                  <div className="fw-semibold text-dark">{book.isbn}</div>
                </div>
              </div>
              <div className="col-6 col-sm-4">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">Category</div>
                  <div className="fw-semibold text-dark">{book.category}</div>
                </div>
              </div>
              <div className="col-6 col-sm-4">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">Publisher</div>
                  <div className="fw-semibold text-dark">{book.publisher || 'Academic'}</div>
                </div>
              </div>
              <div className="col-6 col-sm-4">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">Published Year</div>
                  <div className="fw-semibold text-dark">{book.publishedYear || 'N/A'}</div>
                </div>
              </div>
              <div className="col-6 col-sm-4">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">Total Copies</div>
                  <div className="fw-semibold text-dark">{book.quantity}</div>
                </div>
              </div>
              <div className="col-6 col-sm-4">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">Available Copies</div>
                  <div className="fw-semibold text-dark">{book.availableQuantity}</div>
                </div>
              </div>
            </div>

            {/* Quick Circulation Action */}
            {(isLibrarian || isAdmin) && isAvailable && (
              <div className="bg-primary-subtle p-3 rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                <div>
                  <div className="fw-bold text-primary">Need to lend this book?</div>
                  <div className="small text-secondary">Proceed directly to loan issuance for an active member.</div>
                </div>
                <Link to={`/loans/issue?bookId=${book._id}`} className="btn btn-primary fw-semibold">
                  <i className="bi bi-box-arrow-up-right me-1"></i> Issue This Book
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🤖 AI SMART BOOK RECOMMENDATIONS SECTION */}
      {recommendations.length > 0 && (
        <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 ai-card-glow">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <div className="d-flex align-items-center gap-3 mb-1">
                <span className="ai-badge-icon">
                  <i className="bi bi-stars"></i>
                </span>
                <div>
                  <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    AI Smart Book Recommendations
                    <span className="badge bg-purple-subtle text-primary border fs-6 fw-semibold px-2 py-1">
                      <i className="bi bi-robot me-1"></i> AI Powered
                    </span>
                  </h4>
                  <p className="text-muted small mb-0 mt-1">
                    Readers who borrowed or explored <strong>"{book.title}"</strong> also found these related books helpful:
                  </p>
                </div>
              </div>
            </div>
            <span className="badge bg-light text-secondary border px-3 py-2 d-none d-md-inline-block">
              <i className="bi bi-cpu-fill text-primary me-1"></i> Content & Topic Matching
            </span>
          </div>

          <div className="row g-4">
            {recommendations.map((rec) => {
              const recBook = rec.book;
              const isRecAvailable = recBook.availableQuantity > 0;
              return (
                <div className="col-12 col-sm-6 col-lg-3" key={recBook._id}>
                  <div className="card h-100 custom-card border">
                    <div className="card-body d-flex flex-column p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge badge-category">{recBook.category}</span>
                        <span className="badge bg-success-subtle text-success fw-bold">
                          <i className="bi bi-lightning-charge-fill me-1"></i> {rec.matchPercentage}% Match
                        </span>
                      </div>

                      <h6 className="fw-bold text-dark mb-1 text-truncate" title={recBook.title}>
                        {recBook.title}
                      </h6>
                      <p className="text-muted small mb-2 text-truncate">
                        <i className="bi bi-person me-1"></i> {recBook.author}
                      </p>

                      <div className="bg-light p-2 rounded-2 mb-3 small text-secondary" style={{ fontSize: '0.78rem' }}>
                        <i className="bi bi-stars text-primary me-1"></i> {rec.reason}
                      </div>

                      <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                        <span className={`badge ${isRecAvailable ? 'badge-available' : 'badge-out-of-stock'}`} style={{ fontSize: '0.7rem' }}>
                          {isRecAvailable ? `${recBook.availableQuantity} Avail` : 'Out of Stock'}
                        </span>
                        <Link to={`/books/${recBook._id}`} className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.8rem' }}>
                          View <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
