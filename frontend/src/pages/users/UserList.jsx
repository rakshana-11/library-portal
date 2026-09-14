import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const UserList = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await userService.getUsers(roleFilter);
      if (res && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUser(userId, { role: newRole });
      setActionSuccess('User role updated successfully');
      fetchUsers();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Error updating user role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentAdmin?._id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user account "${userName}"?`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      setActionSuccess(`User "${userName}" deleted successfully`);
      fetchUsers();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Error deleting user');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-shield-lock text-danger me-2"></i> User & Access Management
          </h2>
          <p className="text-muted small mb-0">
            Admin console for managing user roles, librarians, and student accounts
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert alert-success alert-dismissible fade show mb-4 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {actionSuccess}
          <button type="button" className="btn-close" onClick={() => setActionSuccess('')}></button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-3 shadow-sm border mb-4 d-flex gap-2">
        <button
          className={`btn btn-sm ${roleFilter === 'All' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setRoleFilter('All')}
        >
          All Users ({users.length})
        </button>
        <button
          className={`btn btn-sm ${roleFilter === 'admin' ? 'btn-danger' : 'btn-outline-secondary'}`}
          onClick={() => setRoleFilter('admin')}
        >
          Admins
        </button>
        <button
          className={`btn btn-sm ${roleFilter === 'librarian' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setRoleFilter('librarian')}
        >
          Librarians
        </button>
        <button
          className={`btn btn-sm ${roleFilter === 'member' ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setRoleFilter('member')}
        >
          Members
        </button>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {loading ? (
        <Loading message="Loading system users..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon="bi-person-x"
          title="No Users Found"
          description="No user accounts match the selected role filter."
        />
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle custom-table mb-0">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Joined Date</th>
                  <th>Change Role</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u._id === currentAdmin?._id;
                  return (
                    <tr key={u._id}>
                      <td>
                        <div className="fw-bold text-dark">
                          {u.name} {isSelf && <span className="badge bg-secondary ms-1">You</span>}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === 'admin'
                              ? 'bg-danger'
                              : u.role === 'librarian'
                              ? 'bg-primary'
                              : 'bg-success'
                          } text-uppercase`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          style={{ maxWidth: '140px' }}
                        >
                          <option value="member">Member</option>
                          <option value="librarian">Librarian</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={isSelf}
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          title="Delete user account"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
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

export default UserList;
