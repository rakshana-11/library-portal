import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import loanService from '../../services/loanService';
import bookService from '../../services/bookService';
import Loading from '../../components/Loading';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLibrarian, isAdmin } = useAuth();

  const [loan, setLoan] = useState(null);
  const [history, setHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchLoan = async () => {
    try {
      setLoading(true);
      const res = await loanService.getLoanById(id);
      if (res && res.loan) {
        setLoan(res.loan);
        setHistory(res.history || []);

        // Fetch AI recommendations for this loan's book
        if (res.loan.bookId?._id) {
          try {
            const recRes = await bookService.getRecommendations(res.loan.bookId._id);
            if (recRes && recRes.recommendations) {
              setRecommendations(recRes.recommendations);
            }
          } catch (e) {
            console.warn('Could not load loan recommendations:', e);
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Error loading loan details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoan();
  }, [id]);

  const handleReturn = async () => {
    if (!window.confirm('Mark this book as returned?')) return;

    try {
      setActionLoading(true);
      await loanService.returnBook(id);
      setSuccessMsg('Book marked as returned and available stock restored!');
      fetchLoan();
    } catch (err) {
      alert(err.message || 'Failed to return book');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this loan record?')) return;

    try {
      setActionLoading(true);
      await loanService.deleteLoan(id);
      navigate('/loans');
    } catch (err) {
      alert(err.message || 'Failed to delete loan');
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading loan details and lending history..." />;
  }

  if (error || !loan) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning mb-4">{error || 'Loan record not found'}</div>
        <Link to="/loans" className="btn btn-primary">
          <i className="bi bi-arrow-left me-1"></i> Back to Loans
        </Link>
      </div>
    );
  }

  const isIssued = loan.status === 'Issued';
  const isOverdue = isIssued && new Date(loan.dueDate) < new Date();

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/loans" className="text-decoration-none text-muted small fw-semibold">
          <i className="bi bi-arrow-left me-1"></i> Back to Loan Management
        </Link>
      </div>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show mb-4 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="row g-4 mb-4">
        {/* Loan Summary & Dates */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
              <div>
                <span className="badge bg-secondary-subtle text-secondary mb-1">
                  Loan Record ID: #{loan._id.slice(-6)}
                </span>
                <h3 className="fw-bold text-dark mb-0">Circulation Details</h3>
              </div>

              <div>
                {isIssued ? (
                  <span className="badge bg-warning text-dark px-3 py-2 fs-6">
                    <i className="bi bi-hourglass-split me-1"></i> Issued (Active)
                  </span>
                ) : (
                  <span className="badge bg-success px-3 py-2 fs-6">
                    <i className="bi bi-check-circle me-1"></i> Returned
                  </span>
                )}
              </div>
            </div>

            {/* Dates Grid */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-4">
                <div className="p-3 bg-light rounded-3">
                  <div className="small text-muted mb-1">Issue Date</div>
                  <div className="fw-bold text-dark">
                    <i className="bi bi-calendar-check me-1 text-primary"></i>
                    {new Date(loan.issueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-4">
                <div className={`p-3 rounded-3 ${isOverdue ? 'bg-danger-subtle' : 'bg-light'}`}>
                  <div className="small text-muted mb-1">Due Date</div>
                  <div className={`fw-bold ${isOverdue ? 'text-danger' : 'text-dark'}`}>
                    <i className="bi bi-calendar-event me-1 text-warning"></i>
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-4">
                <div className="p-3 bg-light rounded-3">
                  <div className="small text-muted mb-1">Return Date</div>
                  <div className="fw-bold text-dark">
                    <i className="bi bi-calendar-x me-1 text-success"></i>
                    {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'Pending'}
                  </div>
                </div>
              </div>
            </div>

            {/* Book & Member Overview in 2 columns */}
            <div className="row g-4">
              {/* Book Info */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 h-100">
                  <div className="small text-uppercase fw-bold text-primary mb-2">
                    <i className="bi bi-book me-1"></i> Book Information
                  </div>
                  <h5 className="fw-bold text-dark mb-1">{loan.bookId?.title}</h5>
                  <div className="text-muted small mb-2">By {loan.bookId?.author}</div>
                  <div className="small mb-1">
                    <span className="text-muted">Category:</span> {loan.bookId?.category}
                  </div>
                  <div className="small mb-2">
                    <span className="text-muted">ISBN:</span> <code>{loan.bookId?.isbn}</code>
                  </div>
                  <Link to={`/books/${loan.bookId?._id}`} className="btn btn-sm btn-link p-0 text-decoration-none">
                    View Book Details &rarr;
                  </Link>
                </div>
              </div>

              {/* Member Info */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 h-100">
                  <div className="small text-uppercase fw-bold text-success mb-2">
                    <i className="bi bi-person-badge me-1"></i> Borrower Information
                  </div>
                  <h5 className="fw-bold text-dark mb-1">{loan.memberId?.name}</h5>
                  <div className="badge bg-secondary-subtle text-secondary mb-2">
                    {loan.memberId?.membershipId}
                  </div>
                  <div className="small mb-1">
                    <span className="text-muted">Department:</span> {loan.memberId?.department}
                  </div>
                  <div className="small mb-2">
                    <span className="text-muted">Email:</span> {loan.memberId?.email}
                  </div>
                  {loan.memberId?._id && (
                    <Link to={`/members/${loan.memberId?._id}`} className="btn btn-sm btn-link p-0 text-decoration-none">
                      View Member Profile &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {(isLibrarian || isAdmin) && (
              <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
                {isIssued && (
                  <button
                    className="btn btn-success fw-semibold"
                    onClick={handleReturn}
                    disabled={actionLoading}
                  >
                    <i className="bi bi-check2-circle me-1"></i> Mark Book as Returned
                  </button>
                )}
                {isAdmin && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleDelete}
                    disabled={actionLoading}
                  >
                    <i className="bi bi-trash me-1"></i> Delete Loan Record
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lending History Log Timeline */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-clock-history text-primary me-2"></i> Lending History Log
            </h5>
            <p className="text-muted small mb-3">
              Audit log of issuance and return events for this record.
            </p>

            {history.length === 0 ? (
              <div className="text-muted small text-center py-3">No history logs recorded.</div>
            ) : (
              <div className="list-group list-group-flush">
                {history.map((log) => (
                  <div key={log._id} className="list-group-item px-0 py-2 border-0">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className={`badge ${log.action === 'Issued' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {log.action}
                      </span>
                      <small className="text-muted">
                        {new Date(log.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <div className="small text-secondary">
                      Action "{log.action}" recorded in library system.
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🤖 AI RECOMMENDED NEXT READS FOR THIS BORROWED BOOK */}
      {recommendations.length > 0 && (
        <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 mt-2 ai-card-glow">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <div className="d-flex align-items-center gap-3 mb-1">
                <span className="ai-badge-icon">
                  <i className="bi bi-stars"></i>
                </span>
                <div>
                  <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    Recommended Next Reads
                    <span className="badge bg-purple-subtle text-primary border fs-6 fw-semibold px-2 py-1">
                      <i className="bi bi-robot me-1"></i> AI Powered
                    </span>
                  </h4>
                  <p className="text-muted small mb-0 mt-1">
                    Based on this borrowed title <strong>"{loan.bookId?.title}"</strong>, here are top matching catalog recommendations:
                  </p>
                </div>
              </div>
            </div>
            <span className="badge bg-light text-secondary border px-3 py-2 d-none d-md-inline-block">
              <i className="bi bi-stars text-primary me-1"></i> Smart Suggestion
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
                          Details <i className="bi bi-arrow-right ms-1"></i>
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

export default LoanDetails;
