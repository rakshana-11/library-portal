import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSampleBooks = async () => {
      try {
        const data = await bookService.getBooks();
        if (data && data.books) {
          // Take top 4 books as featured
          setFeaturedBooks(data.books.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching featured books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSampleBooks();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="container mt-4">
        <div className="hero-section text-center text-md-start p-5 rounded-4 shadow">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-white text-primary mb-3 px-3 py-2 fw-semibold">
                🎓 College Library Management
              </span>
              <h1 className="display-4 fw-extrabold mb-3">
                Welcome to Library Portal
              </h1>
              <p className="lead mb-4 opacity-90">
                Discover, manage and track books easily. A centralized directory with debounced search, real-time stock availability, and streamlined circulation workflows.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                <Link to="/books" className="btn btn-light btn-lg px-4 py-2 text-primary fw-bold shadow-sm">
                  <i className="bi bi-search me-2"></i> Browse Books
                </Link>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-outline-light btn-lg px-4 py-2 fw-bold shadow-sm">
                    <i className="bi bi-speedometer2 me-2"></i> Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-2 fw-bold">
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login to Portal
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-flex justify-content-center">
              <div className="p-4 bg-white bg-opacity-10 rounded-circle text-white shadow-lg">
                <i className="bi bi-book-half" style={{ fontSize: '7rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="container my-5 py-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Core Portal Modules</h2>
          <p className="text-muted">Everything you need for clean and reliable college library administration</p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 text-center custom-card">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-block mx-auto mb-3">
                <i className="bi bi-bookshelf fs-1"></i>
              </div>
              <h4 className="fw-bold mb-2">Book Management</h4>
              <p className="text-muted small mb-0">
                Catalog academic and fiction titles, filter across categories, and search with instant debounced queries.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 text-center custom-card">
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle d-inline-block mx-auto mb-3">
                <i className="bi bi-person-badge fs-1"></i>
              </div>
              <h4 className="fw-bold mb-2">Member Management</h4>
              <p className="text-muted small mb-0">
                Register student members, manage department rosters, and track individual reading & borrowing records.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 text-center custom-card">
              <div className="p-3 bg-info bg-opacity-10 text-info rounded-circle d-inline-block mx-auto mb-3">
                <i className="bi bi-arrow-repeat fs-1"></i>
              </div>
              <h4 className="fw-bold mb-2">Loan Circulation</h4>
              <p className="text-muted small mb-0">
                Issue and return books with automated stock adjustments, due date tracking, and lending history logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Featured Books</h3>
            <p className="text-muted mb-0">Recently added titles in our campus repository</p>
          </div>
          <Link to="/books" className="btn btn-outline-primary">
            View All Catalog <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {loading ? (
          <Loading message="Loading catalog..." />
        ) : (
          <div className="row g-4">
            {featuredBooks.map((book) => (
              <div className="col-12 col-sm-6 col-lg-3" key={book._id}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Simple Footer */}
      <footer className="custom-footer mt-5">
        <div className="container text-center">
          <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
            <i className="bi bi-journal-bookmark-fill text-primary fs-4"></i>
            <span className="fw-bold text-white fs-5">Library Portal</span>
          </div>
          <p className="small mb-3 text-muted">
            A Clean & Functional MERN Stack Mini Project for College Libraries
          </p>
          <div className="d-flex justify-content-center gap-4 small mb-3">
            <Link to="/books" className="text-muted text-decoration-none">Catalog</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                <Link to="/profile" className="text-muted text-decoration-none">My Profile</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-muted text-decoration-none">Portal Login</Link>
                <Link to="/register" className="text-muted text-decoration-none">Join Library</Link>
              </>
            )}
          </div>
          <hr className="border-secondary opacity-25" />
          <p className="text-secondary small mb-0">
            &copy; {new Date().getFullYear()} Library Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
