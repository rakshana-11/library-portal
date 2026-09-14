import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (err) {
      setError(err.message || 'Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  if (loading) {
    return <Loading message="Loading notifications..." />;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-bell text-primary me-2"></i> System Notifications
          </h3>
          <p className="text-muted small mb-0">Updates on book availability, issues, and returns</p>
        </div>
        {notifications.length > 0 && (
          <button className="btn btn-outline-primary btn-sm" onClick={handleMarkAllRead}>
            <i className="bi bi-check2-all me-1"></i> Mark All as Read
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {notifications.length === 0 ? (
        <EmptyState
          icon="bi-bell-slash"
          title="No Notifications"
          description="You are all caught up! There are no new activity alerts."
        />
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="list-group list-group-flush">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`list-group-item p-3 d-flex justify-content-between align-items-center ${
                  !item.isRead ? 'bg-light bg-opacity-75 fw-medium' : ''
                }`}
              >
                <div className="d-flex align-items-start gap-3">
                  <div className="mt-1">
                    {item.type === 'success' ? (
                      <i className="bi bi-check-circle-fill text-success fs-5"></i>
                    ) : item.type === 'warning' ? (
                      <i className="bi bi-exclamation-circle-fill text-warning fs-5"></i>
                    ) : item.type === 'danger' ? (
                      <i className="bi bi-x-circle-fill text-danger fs-5"></i>
                    ) : (
                      <i className="bi bi-info-circle-fill text-primary fs-5"></i>
                    )}
                  </div>
                  <div>
                    <div className="text-dark">{item.message}</div>
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      {new Date(item.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleMarkAsRead(item._id)}
                    title="Mark as read"
                  >
                    <i className="bi bi-check2"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
