import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import loanService from '../../services/loanService';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const LoanList = () => {
  const { user, isLibrarian, isAdmin, isMember } = useAuth();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await loanService.getLoans(statusFilter);
      if (res && res.loans) {
        setLoans(res.loans);
      }
    } catch (err) {
      setError(err.message || 'Error fetching loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  const handleReturnBook = async (loanId, bookTitle) => {
    if (!window.confirm(`Confirm return for "${bookTitle}"?`)) {
      return;
    }

    try {
      setActionLoadingId(loanId);
      await loanService.returnBook(loanId);
      setActionSuccess(`Book "${bookTitle}" was successfully marked as returned!`);
      // Refresh list
      fetchLoans();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to process return');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter loans client-side by book title or member name
  const filteredLoans = loans.filter((loan) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const bookTitle = loan.bookId?.title?.toLowerCase() || '';
    const memberName = loan.memberId?.name?.toLowerCase() || '';
    const memberId = loan.memberId?.membershipId?.toLowerCase() || '';
    return bookTitle.includes(term) || memberName.includes(term) || memberId.includes(term);
  });

  return (
    <div className="container py-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-arrow-left-right text-primary me-2"></i>
            {isMember ? 'My Loan History' : 'Loan & Circulation Management'}
          </h2>
          <p className="text-muted small mb-0">
            {isMember
              ? 'View your active book issues and returned books'
              : 'Track active borrowing, process book returns, and check due dates'}
          </p>
        </div>

        {(isLibrarian || isAdmin) && (
          <div className="mt-3 mt-md-0">
            <Link to="/loans/issue" className="btn btn-primary btn-sm fw-semibold shadow-sm">
              <i className="bi bi-plus-circle me-1"></i> Issue New Book
            </Link>
          </div>
        )}
      </div>

      {actionSuccess && (
        <div className="alert alert-success alert-dismissible fade show mb-4 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {actionSuccess}
          <button type="button" className="btn-close" onClick={() => setActionSuccess('')}></button>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0 ps-0"
                placeholder={
                  isMember
                    ? 'Search your loans by book title...'
                    : 'Search by book title, student name, or ID...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="btn btn-light border" onClick={() => setSearchTerm('')}>
                  <i className="bi bi-x-lg text-muted"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-5">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'All' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setStatusFilter('All')}
              >
                All Status
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'Issued' ? 'btn-warning' : 'btn-outline-secondary'}`}
                onClick={() => setStatusFilter('Issued')}
              >
                <i className="bi bi-clock me-1"></i> Active (Issued)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'Returned' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setStatusFilter('Returned')}
              >
                <i className="bi bi-check2 me-1"></i> Returned
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Loans Table */}
      {loading ? (
        <Loading message="Fetching circulation records..." />
      ) : filteredLoans.length === 0 ? (
        <EmptyState
          icon="bi-journal-check"
          title="No Loan Records Found"
          description={
            searchTerm || statusFilter !== 'All'
              ? 'No circulation records match your current filter settings.'
              : 'There are no book loans recorded yet.'
          }
        />
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle custom-table mb-0">
              <thead>
                <tr>
                  <th>Book Title</th>
                  {!isMember && <th>Borrower / Member</th>}
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => {
                  const isIssued = loan.status === 'Issued';
                  const isOverdue = isIssued && new Date(loan.dueDate) < new Date();

                  return (
                    <tr key={loan._id}>
                      <td>
                        <div className="fw-bold text-dark">{loan.bookId?.title || 'Book Title'}</div>
                        <div className="small text-muted">{loan.bookId?.author || ''}</div>
                      </td>

                      {!isMember && (
                        <td>
                          <div className="fw-semibold text-dark">{loan.memberId?.name || 'Member'}</div>
                          <div className="small text-muted">{loan.memberId?.membershipId || ''}</div>
                        </td>
                      )}

                      <td>{new Date(loan.issueDate).toLocaleDateString()}</td>

                      <td>
                        <span className={isOverdue ? 'text-danger fw-bold' : ''}>
                          {new Date(loan.dueDate).toLocaleDateString()}
                          {isOverdue && <span className="badge bg-danger-subtle text-danger ms-1">Overdue</span>}
                        </span>
                      </td>

                      <td>
                        {loan.returnDate ? (
                          <span className="text-success small fw-medium">
                            {new Date(loan.returnDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>

                      <td>
                        {isIssued ? (
                          <span className="badge bg-warning text-dark px-3 py-1">
                            <i className="bi bi-hourglass-split me-1"></i> Issued
                          </span>
                        ) : (
                          <span className="badge bg-success px-3 py-1">
                            <i className="bi bi-check-circle me-1"></i> Returned
                          </span>
                        )}
                      </td>

                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Link to={`/loans/${loan._id}`} className="btn btn-sm btn-outline-primary">
                            Details
                          </Link>

                          {(isLibrarian || isAdmin) && isIssued && (
                            <button
                              className="btn btn-sm btn-success fw-semibold"
                              onClick={() => handleReturnBook(loan._id, loan.bookId?.title || 'Book')}
                              disabled={actionLoadingId === loan._id}
                              title="Mark as returned and increase available stock"
                            >
                              {actionLoadingId === loan._id ? (
                                <span className="spinner-border spinner-border-sm"></span>
                              ) : (
                                <>
                                  <i className="bi bi-box-arrow-in-down-left me-1"></i> Return
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanList;
