import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import bookService from '../../services/bookService';
import Loading from '../../components/Loading';

const CATEGORIES = [
  'Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Education',
  'Other'
];

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Technology',
    publisher: '',
    publishedYear: '',
    quantity: 1,
    description: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await bookService.getBookById(id);
        if (res && res.book) {
          setFormData({
            title: res.book.title || '',
            author: res.book.author || '',
            isbn: res.book.isbn || '',
            category: res.book.category || 'Other',
            publisher: res.book.publisher || '',
            publishedYear: res.book.publishedYear || '',
            quantity: res.book.quantity || 1,
            description: res.book.description || ''
          });
        }
      } catch (err) {
        setError(err.message || 'Error fetching book data');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.author.trim() || !formData.isbn.trim()) {
      setError('Please fill in Title, Author, and ISBN');
      return;
    }

    try {
      setSubmitting(true);
      await bookService.updateBook(id, formData);
      navigate(`/books/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update book');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading book for editing..." />;
  }

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to={`/books/${id}`} className="text-decoration-none text-muted small fw-semibold">
          <i className="bi bi-arrow-left me-1"></i> Back to Book Details
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                <i className="bi bi-pencil-square fs-3"></i>
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-0">Edit Book</h3>
                <p className="text-muted small mb-0">Update book details in the library database</p>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div className="small">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Book Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Author *</label>
                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">ISBN Code *</label>
                  <input
                    type="text"
                    name="isbn"
                    className="form-control"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Total Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    className="form-control"
                    value={formData.publisher}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Published Year</label>
                  <input
                    type="number"
                    name="publishedYear"
                    className="form-control"
                    value={formData.publishedYear}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Book'}
                </button>
                <Link to={`/books/${id}`} className="btn btn-light border px-4">
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

export default EditBook;
