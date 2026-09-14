import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member',
    department: 'Computer Science',
    year: '1st Year',
    phone: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-9 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-block mb-3">
                <i className="bi bi-person-plus fs-2"></i>
              </div>
              <h3 className="fw-bold text-dark">Create an Account</h3>
              <p className="text-muted small">Join the Library Portal as a Member or Librarian</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4 py-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div className="small">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Select Role</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="radio"
                      className="btn-check"
                      name="role"
                      id="role-member"
                      value="member"
                      checked={formData.role === 'member'}
                      onChange={handleChange}
                    />
                    <label className="btn btn-outline-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" htmlFor="role-member">
                      <i className="bi bi-person"></i> Student Member
                    </label>
                  </div>
                  <div className="col-6">
                    <input
                      type="radio"
                      className="btn-check"
                      name="role"
                      id="role-librarian"
                      value="librarian"
                      checked={formData.role === 'librarian'}
                      onChange={handleChange}
                    />
                    <label className="btn btn-outline-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" htmlFor="role-librarian">
                      <i className="bi bi-person-badge"></i> Librarian
                    </label>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Member specific fields */}
              {formData.role === 'member' && (
                <div className="row g-2 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">Department</label>
                    <select
                      name="department"
                      className="form-select"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics Engineering">Electronics Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="General Studies">General Studies</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">Academic Year</label>
                    <select
                      name="year"
                      className="form-select"
                      value={formData.year}
                      onChange={handleChange}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Passwords */}
              <div className="row g-2 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Password *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                    Creating Account...
                  </span>
                ) : (
                  <span><i className="bi bi-person-check me-2"></i> Register</span>
                )}
              </button>
            </form>

            <div className="text-center">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="small fw-semibold text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
