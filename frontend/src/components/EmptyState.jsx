import React from 'react';

const EmptyState = ({
  icon = 'bi-folder2-open',
  title = 'No Records Found',
  description = 'There are no items to display matching your criteria.',
  actionText,
  onAction
}) => {
  return (
    <div className="text-center py-5 my-4 bg-white rounded-3 border border-light p-4 shadow-sm">
      <div className="mb-3 text-muted">
        <i className={`bi ${icon}`} style={{ fontSize: '3.5rem' }}></i>
      </div>
      <h5 className="fw-bold text-dark mb-2">{title}</h5>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '400px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
