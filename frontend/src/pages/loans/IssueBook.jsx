import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';
import loanService from '../../services/loanService';
import Loading from '../../components/Loading';

const IssueBook = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedBookId = searchParams.get('bookId') || '';
  const preselectedMemberId = searchParams.get('memberId') || '';

  // Form state
  const [selectedBook, setSelectedBook] = useState(preselectedBookId);
  const [selectedMember, setSelectedMember] = useState(preselectedMemberId);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);

  // Default due date: +14 days
  const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const [dueDate, setDueDate] = useState(defaultDueDate);

  // Data lists
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes, membersRes] = await Promise.all([
          bookService.getBooks(),
          memberService.getMembers()
        ]);

        if (booksRes && booksRes.books) {
          setBooks(booksRes.books);
        }
        if (membersRes && membersRes.members) {
          setMembers(membersRes.members);
        }
      } catch (err) {
        setError('Error loading books or members lists: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedBook || !selectedMember || !dueDate) {
      setError('Please select both a Book, a Member, and set a Due Date');
      return;
    }

    const chosenBook = books.find((b) => b._id === selectedBook);
    if (!chosenBook) {
      setError('Selected book was not found');
      return;
    }

    if (chosenBook.availableQuantity <= 0) {
      setError(`"${chosenBook.title}" is currently out of stock (Available: 0).`);
      return;
    }

    try {
      setSubmitting(true);
      await loanService.issueBook({
        bookId: selectedBook,
        memberId: selectedMember,
        dueDate: new Date(dueDate).toISOString()
      });
      navigate('/loans');
    } catch (err) {
      setError(err.message || 'Failed to issue book');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading catalog and members for issuance..." />;
  }

  const currentBookObj = books.find((b) => b._id === selectedBook);

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/loans" className="text-decoration-none text-muted small fw-semibold">
          <i className="bi bi-arrow-left me-1"></i> Back to Loans
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                <i className="bi bi-journal-arrow-up fs-3"></i>
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-0">Issue Book</h3>
                <p className="text-muted small mb-0">Lend a book copy to a registered member</p>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div className="small">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Select Book */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Select Book *
                </label>
                <select
                  className="form-select"
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Book --</option>
                  {books.map((b) => (
                    <option
                      key={b._id}
                      value={b._id}
                      disabled={b.availableQuantity <= 0}
                    >
                      {b.title} (By {b.author}) — {b.availableQuantity} available
                      {b.availableQuantity <= 0 ? ' [OUT OF STOCK]' : ''}
                    </option>
                  ))}
                </select>

                {currentBookObj && (
                  <div className="mt-2 small text-muted">
                    <span className="badge badge-category me-2">{currentBookObj.category}</span>
                    <span>ISBN: <code>{currentBookObj.isbn}</code></span>
                    <span className="ms-2">Available: <strong>{currentBookObj.availableQuantity}</strong> of {currentBookObj.quantity}</span>
                  </div>
                )}
              </div>

              {/* Select Member */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Select Member *
                </label>
                <select
                  className="form-select"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Registered Member --</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} ({m.membershipId}) — {m.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    min={issueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 mb-4 small text-secondary">
                <i className="bi bi-info-circle me-2 text-primary"></i>
                Issuing this book will automatically decrease the available stock count by 1 and record a lending history log.
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                  disabled={submitting}
                >
                  {submitting ? 'Processing Issue...' : 'Confirm & Issue Book'}
                </button>
                <Link to="/loans" className="btn btn-light border px-4">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBook;
