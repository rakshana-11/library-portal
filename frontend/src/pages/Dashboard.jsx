import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { user, isAdmin, isLibrarian, isMember } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getDashboardStats();
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loading message="Loading dashboard statistics..." />;
  }

  const stats = data?.stats || {};
  const recentLoans = data?.recentLoans || [];

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary mb-2 text-uppercase fw-bold px-3 py-1">
            {user?.role} Portal
          </span>
          <h2 className="fw-bold text-dark mb-1">Welcome back, {user?.name}!</h2>
          <p className="text-muted small mb-0">Here is a quick overview of library activities and statistics.</p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          {(isLibrarian || isAdmin) && (
            <Link to="/loans/issue" className="btn btn-primary fw-semibold shadow-sm">
              <i className="bi bi-plus-circle me-1"></i> Issue Book
            </Link>
          )}
          <Link to="/books" className="btn btn-outline-primary fw-semibold">
            <i className="bi bi-book me-1"></i> Browse Catalog
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      {/* ADMIN STATS CARDS */}
      {isAdmin && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">Total Books</p>
                    <h3 className="fw-bold mb-0">{stats.totalBooks ?? 0}</h3>
                  </div>
                  <i className="bi bi-journal-bookmark fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">Total Members</p>
                    <h3 className="fw-bold mb-0">{stats.totalMembers ?? 0}</h3>
                  </div>
                  <i className="bi bi-people fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #d97706, #b45309)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">Total Loans</p>
                    <h3 className="fw-bold mb-0">{stats.totalLoans ?? 0}</h3>
                  </div>
                  <i className="bi bi-arrow-left-right fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">Available Stock</p>
                    <h3 className="fw-bold mb-0">{stats.availableBooks ?? 0}</h3>
                  </div>
                  <i className="bi bi-check2-circle fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIBRARIAN STATS CARDS */}
      {isLibrarian && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">Total Books</p>
                    <h3 className="fw-bold mb-0">{stats.totalBooks ?? 0}</h3>
                  </div>
                  <i className="bi bi-journal-bookmark fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">Registered Members</p>
                    <h3 className="fw-bold mb-0">{stats.totalMembers ?? 0}</h3>
                  </div>
                  <i className="bi bi-people fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">Active Loans</p>
                    <h3 className="fw-bold mb-0">{stats.activeLoans ?? 0}</h3>
                  </div>
                  <i className="bi bi-clock-history fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">Returned Loans</p>
                    <h3 className="fw-bold mb-0">{stats.returnedLoans ?? 0}</h3>
                  </div>
                  <i className="bi bi-box-arrow-in-down-left fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER STATS CARDS */}
      {isMember && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">Available Books</p>
                    <h3 className="fw-bold mb-0">{stats.availableBooks ?? 0}</h3>
                  </div>
                  <i className="bi bi-book fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">My Active Loans</p>
                    <h3 className="fw-bold mb-0">{stats.myActiveLoans ?? 0}</h3>
                  </div>
                  <i className="bi bi-bookmark-dash fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card stat-card shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small text-white-50 text-uppercase fw-bold mb-1">My Returned Books</p>
                    <h3 className="fw-bold mb-0">{stats.myReturnedLoans ?? 0}</h3>
                  </div>
                  <i className="bi bi-bookmark-check fs-1 text-white-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Loans / Activity Section */}
      <div className="card shadow-sm border-0 rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0">
            <i className="bi bi-clock-history text-primary me-2"></i>
            {isMember ? 'My Recent Borrowing Activity' : 'Recent Loan Transactions'}
          </h5>
          <Link to="/loans" className="btn btn-sm btn-outline-primary">
            View All Loans <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {recentLoans.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-inbox fs-2 d-block mb-2"></i>
            No recent loan transactions found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle custom-table mb-0">
              <thead>
                <tr>
                  <th>Book Title</th>
                  {!isMember && <th>Borrower</th>}
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentLoans.map((loan) => (
                  <tr key={loan._id}>
                    <td>
                      <span className="fw-semibold text-dark">{loan.bookId?.title || 'Book Title'}</span>
                      <div className="small text-muted">{loan.bookId?.author || ''}</div>
                    </td>
                    {!isMember && (
                      <td>
                        <span className="fw-medium">{loan.memberId?.name || 'Member'}</span>
                        <div className="small text-muted">{loan.memberId?.membershipId || ''}</div>
                      </td>
                    )}
                    <td>{new Date(loan.issueDate).toLocaleDateString()}</td>
                    <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${loan.status === 'Issued' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <Link to={`/loans/${loan._id}`} className="btn btn-sm btn-light border">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
