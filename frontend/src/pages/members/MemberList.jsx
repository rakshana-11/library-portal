import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import memberService from '../../services/memberService';
import useDebounce from '../../hooks/useDebounce';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const MemberList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('All');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce member search by 400ms
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await memberService.getMembers(debouncedSearch, department);
        if (res && res.members) {
          setMembers(res.members);
        }
      } catch (err) {
        setError(err.message || 'Error fetching member directory');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [debouncedSearch, department]);

  return (
    <div className="container py-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-people text-primary me-2"></i> Member Management
          </h2>
          <p className="text-muted small mb-0">
            View registered students and faculty library members
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <Link to="/members/add" className="btn btn-primary btn-sm fw-semibold shadow-sm">
            <i className="bi bi-person-plus me-1"></i> Add New Member
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
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
                placeholder="Search by Name, Email, or Membership ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-light border"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-lg text-muted"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-5 d-flex gap-2">
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics Engineering">Electronics Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Data Science & AI">Data Science & AI</option>
            </select>

            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setSearchTerm('');
                setDepartment('All');
              }}
              title="Reset"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Members Table */}
      {loading ? (
        <Loading message="Loading member records..." />
      ) : members.length === 0 ? (
        <EmptyState
          icon="bi-people"
          title="No Members Found"
          description="No library members matched your search criteria."
        />
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle custom-table mb-0">
              <thead>
                <tr>
                  <th>Membership ID</th>
                  <th>Member Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary font-monospace">
                        {member.membershipId}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{member.name}</div>
                      {member.phone && <div className="small text-muted">{member.phone}</div>}
                    </td>
                    <td>{member.email}</td>
                    <td>{member.department}</td>
                    <td>{member.year}</td>
                    <td className="text-end">
                      <Link to={`/members/${member._id}`} className="btn btn-sm btn-outline-primary">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;
