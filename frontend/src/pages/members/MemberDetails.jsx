import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import memberService from '../../services/memberService';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLibrarian, isAdmin } = useAuth();

  const [member, setMember] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await memberService.getMemberById(id);
        if (data && data.member) {
          setMember(data.member);
          setLoans(data.loans || []);
        }
      } catch (err) {
        setError(err.message || 'Error fetching member details');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete member record "${member.name}"?`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      await memberService.deleteMember(id);
      navigate('/members');
    } catch (err) {
      alert(err.message || 'Error deleting member');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading member profile..." />;
  }

  if (error || !member) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning mb-4">{error || 'Member not found'}</div>
        <Link to="/members" className="btn btn-primary">
          <i className="bi bi-arrow-left me-1"></i> Back to Members
        </Link>
      </div>
    );
  }

  const activeLoans = loans.filter((l) => l.status === 'Issued');

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/members" className="text-decoration-none text-muted small fw-semibold">
          <i className="bi bi-arrow-left me-1"></i> Back to Member Roster
        </Link>
      </div>

      <div className="row g-4 mb-4">
        {/* Member Profile Summary Card */}
        <div className="col-12 col-md-5 col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 p-4 text-center">
            <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle d-inline-block mx-auto mb-3">
              <i className="bi bi-person-circle fs-1"></i>
            </div>
            <h4 className="fw-bold text-dark mb-1">{member.name}</h4>
            <div className="badge bg-secondary-subtle text-secondary font-monospace mb-3">
              {member.membershipId}
            </div>

            <hr className="my-3" />

            <div className="text-start small">
              <div className="mb-2">
                <span className="text-muted d-block">Email</span>
                <span className="fw-semibold text-dark">{member.email}</span>
              </div>
              <div className="mb-2">
                <span className="text-muted d-block">Department</span>
                <span className="fw-semibold text-dark">{member.department}</span>
              </div>
              <div className="mb-2">
                <span className="text-muted d-block">Academic Year</span>
                <span className="fw-semibold text-dark">{member.year}</span>
              </div>
              {member.phone && (
                <div className="mb-2">
                  <span className="text-muted d-block">Phone</span>
                  <span className="fw-semibold text-dark">{member.phone}</span>
                </div>
              )}
              <div className="mb-2">
                <span className="text-muted d-block">Member Since</span>
                <span className="fw-semibold text-dark">
                  {new Date(member.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {(isLibrarian || isAdmin) && (
              <div className="d-flex gap-2 mt-4">
                <Link to={`/members/edit/${member._id}`} className="btn btn-outline-secondary btn-sm w-100">
                  <i className="bi bi-pencil me-1"></i> Edit
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm w-100"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  <i className="bi bi-trash me-1"></i> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Member Borrowing History & Active Loans */}
        <div className="col-12 col-md-7 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">
                <i className="bi bi-journal-bookmark text-primary me-2"></i>
                Borrowing & Loan Records ({loans.length})
              </h5>
              {(isLibrarian || isAdmin) && (
                <Link to={`/loans/issue?memberId=${member._id}`} className="btn btn-sm btn-primary">
                  <i className="bi bi-plus-circle me-1"></i> Issue Book to Member
                </Link>
              )}
            </div>

            {loans.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                This member has no recorded loans yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan._id}>
                        <td>
                          <span className="fw-bold text-dark">{loan.bookId?.title || 'Book Title'}</span>
                          <div className="small text-muted">{loan.bookId?.category || ''}</div>
                        </td>
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
      </div>
    </div>
  );
};

export default MemberDetails;
