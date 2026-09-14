import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isLibrarian, isMember, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-danger';
      case 'librarian':
        return 'bg-primary';
      case 'member':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="p-2 bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center">
            <i className="bi bi-journal-bookmark-fill fs-5"></i>
          </span>
          <span>Library Portal</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="bi bi-house me-1"></i> Home
              </NavLink>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink className="nav-link" to="/books">
                <i className="bi bi-book me-1"></i> Books
              </NavLink>
            </li>

            {/* Member specific */}
            {isAuthenticated && isMember && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/loans">
                  <i className="bi bi-journal-check me-1"></i> My Loans
                </NavLink>
              </li>
            )}

            {/* Librarian & Admin */}
            {isAuthenticated && (isLibrarian || isAdmin) && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/members">
                    <i className="bi bi-people me-1"></i> Members
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/loans">
                    <i className="bi bi-arrow-left-right me-1"></i> Loans
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-primary fw-semibold" to="/loans/issue">
                    <i className="bi bi-plus-circle me-1"></i> Issue Book
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin only */}
            {isAuthenticated && isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">
                  <i className="bi bi-shield-lock me-1"></i> Users
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Auth Links */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/notifications"
                  className="btn btn-light position-relative p-2 rounded-circle border"
                  title="Notifications"
                >
                  <i className="bi bi-bell text-secondary"></i>
                </NavLink>

                <NavLink to="/profile" className="btn btn-light d-flex align-items-center gap-2 border px-3 py-1 text-decoration-none">
                  <div className="text-start">
                    <div className="small fw-bold text-dark">{user?.name}</div>
                    <span className={`badge ${getRoleBadgeClass(user?.role)} text-uppercase`} style={{ fontSize: '0.65rem' }}>
                      {user?.role}
                    </span>
                  </div>
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm px-3 py-2"
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3 py-2">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3 py-2">
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
