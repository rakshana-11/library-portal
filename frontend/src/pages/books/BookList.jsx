import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useDebounce from '../../hooks/useDebounce';
import bookService from '../../services/bookService';
import BookCard from '../../components/BookCard';
import SearchBar from '../../components/SearchBar';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const BookList = () => {
  const { isLibrarian, isAdmin } = useAuth();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Books data and UI states
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --------------------------------------------------------------------------
  // UNIQUE FEATURE: Debounced Search Hook
  // --------------------------------------------------------------------------
  // useDebounce waits 400ms after the user stops typing before updating debouncedSearch.
  // This prevents unnecessary API requests on every individual keystroke.
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Fetch books whenever debounced search query or category filter changes
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await bookService.getBooks(debouncedSearch, selectedCategory);
        if (data && data.books) {
          setBooks(data.books);
        }
      } catch (err) {
        setError(err.message || 'Error fetching books from catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearch, selectedCategory]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <div className="container py-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-journal-album text-primary me-2"></i> Book Directory
          </h2>
          <p className="text-muted small mb-0">
            Browse our collection, search by title/author/ISBN, or filter by category.
          </p>
        </div>

        <div className="mt-3 mt-md-0 d-flex align-items-center gap-2">
          {/* Grid / Table Toggle */}
          <div className="btn-group shadow-sm" role="group">
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <i className="bi bi-grid-fill"></i>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <i className="bi bi-list-ul"></i>
            </button>
          </div>

          {(isLibrarian || isAdmin) && (
            <Link to="/books/add" className="btn btn-primary btn-sm fw-semibold shadow-sm">
              <i className="bi bi-plus-lg me-1"></i> Add New Book
            </Link>
          )}
        </div>
      </div>

      {/* Debounced Search and Category Filter Component */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onClear={handleResetFilters}
        placeholder="Search books by title, author, or ISBN..."
      />

      {/* Results Meta Info */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="small text-muted fw-semibold">
          Showing <span className="text-dark">{books.length}</span> book(s)
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {debouncedSearch && ` matching "${debouncedSearch}"`}
        </span>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Content Rendering */}
      {loading ? (
        <Loading message="Searching library catalog..." />
      ) : books.length === 0 ? (
        <EmptyState
          icon="bi-search"
          title="No Books Found"
          description={
            searchTerm || selectedCategory !== 'All'
              ? 'No books match your current search keywords or category filters.'
              : 'The library catalog is currently empty.'
          }
          actionText={searchTerm || selectedCategory !== 'All' ? 'Clear Filters' : undefined}
          onAction={handleResetFilters}
        />
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="row g-4">
          {books.map((book) => (
            <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={book._id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      ) : (
        /* Responsive Table View */
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle custom-table mb-0">
              <thead>
                <tr>
                  <th>Title & Author</th>
                  <th>Category</th>
                  <th>ISBN</th>
                  <th>Published</th>
                  <th>Availability</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  const isAvail = book.availableQuantity > 0;
                  return (
                    <tr key={book._id}>
                      <td>
                        <div className="fw-bold text-dark">{book.title}</div>
                        <div className="small text-muted">{book.author}</div>
                      </td>
                      <td>
                        <span className="badge badge-category">{book.category}</span>
                      </td>
                      <td>
                        <code className="text-secondary">{book.isbn}</code>
                      </td>
                      <td>{book.publishedYear || 'N/A'}</td>
                      <td>
                        <span className={`badge ${isAvail ? 'badge-available' : 'badge-out-of-stock'}`}>
                          {isAvail ? `${book.availableQuantity} of ${book.quantity} In Stock` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="text-end">
                        <Link to={`/books/${book._id}`} className="btn btn-sm btn-outline-primary">
                          Details
                        </Link>
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

export default BookList;
