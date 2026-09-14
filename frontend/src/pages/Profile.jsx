import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Loading from '../components/Loading';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getMe();
        if (res.success) {
          setProfileData(res.user);
        }
      } catch (err) {
        setError(err.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Loading message="Loading profile details..." />;
  }

  const user = profileData || authUser;
  const member = user?.memberProfile;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-block mb-3">
                <i className="bi bi-person-bounding-box fs-1"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">{user?.name}</h3>
              <span className="badge bg-primary text-uppercase px-3 py-1">
                {user?.role}
              </span>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="list-group list-group-flush mb-4">
              <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                <span className="text-muted fw-semibold">
                  <i className="bi bi-envelope me-2"></i> Email Address
                </span>
                <span className="fw-bold text-dark">{user?.email}</span>
              </div>

              <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                <span className="text-muted fw-semibold">
                  <i className="bi bi-shield-check me-2"></i> Role
                </span>
                <span className="fw-bold text-capitalize text-dark">{user?.role}</span>
              </div>

              {member && (
                <>
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <span className="text-muted fw-semibold">
                      <i className="bi bi-card-text me-2"></i> Membership ID
                    </span>
                    <span className="badge bg-secondary-subtle text-secondary fs-6">
                      {member.membershipId}
                    </span>
                  </div>

                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <span className="text-muted fw-semibold">
                      <i className="bi bi-building me-2"></i> Department
                    </span>
                    <span className="fw-bold text-dark">{member.department}</span>
                  </div>

                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <span className="text-muted fw-semibold">
                      <i className="bi bi-mortarboard me-2"></i> Academic Year
                    </span>
                    <span className="fw-bold text-dark">{member.year}</span>
                  </div>

                  {member.phone && (
                    <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <span className="text-muted fw-semibold">
                        <i className="bi bi-telephone me-2"></i> Phone
                      </span>
                      <span className="fw-bold text-dark">{member.phone}</span>
                    </div>
                  )}
                </>
              )}

              <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                <span className="text-muted fw-semibold">
                  <i className="bi bi-calendar-event me-2"></i> Member Since
                </span>
                <span className="text-dark">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="text-center text-muted small">
              <i className="bi bi-info-circle me-1"></i> Account managed by College Library System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
