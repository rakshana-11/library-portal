import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Always redirect to dashboard upon new login
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Helper for quick demo filling
  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-block mb-3">
                <i className="bi bi-person-lock fs-2"></i>
              </div>
              <h3 className="fw-bold text-dark">Portal Login</h3>
              <p className="text-muted small">Sign in to access your library dashboard</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4 py-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div className="small">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-key"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing in...
                  </span>
                ) : (
                  <span><i className="bi bi-box-arrow-in-right me-2"></i> Sign In</span>
                )}
              </button>
            </form>

            <div className="text-center mb-4">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="small fw-semibold text-decoration-none">
                Register here
              </Link>
            </div>

            {/* Quick Demo Credentials for Reviewers / Evaluators */}
            <div className="border-top pt-3">
              <p className="small text-muted fw-semibold mb-2 text-center">
                <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick Demo Login
              </p>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger text-start d-flex justify-content-between align-items-center"
                  onClick={() => fillCredentials('admin@library.com', 'admin123')}
                >
                  <span><i className="bi bi-shield-check me-2"></i> Admin</span>
                  <span className="badge bg-danger-subtle text-danger">admin@library.com</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary text-start d-flex justify-content-between align-items-center"
                  onClick={() => fillCredentials('librarian1@library.com', 'lib123')}
                >
                  <span><i className="bi bi-person-badge me-2"></i> Librarian</span>
                  <span className="badge bg-primary-subtle text-primary">librarian1@library.com</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success text-start d-flex justify-content-between align-items-center"
                  onClick={() => fillCredentials('john@student.com', 'member123')}
                >
                  <span><i className="bi bi-person me-2"></i> Student Member</span>
                  <span className="badge bg-success-subtle text-success">john@student.com</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
