import React from 'react';

const CATEGORIES = [
  'All',
  'Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Education',
  'Other'
];

const SearchBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  placeholder = 'Search books by title, author, or ISBN...',
  onClear
}) => {
  return (
    <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
      {/* Search Input Bar */}
      <div className="row g-2 align-items-center mb-3">
        <div className="col-12 col-md-8 col-lg-9">
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0 ps-0"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-light border"
                type="button"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <i className="bi bi-x-lg text-muted"></i>
              </button>
            )}
          </div>
        </div>
        <div className="col-12 col-md-4 col-lg-3 d-flex gap-2">
          {onClear && (
            <button
              className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center"
              onClick={onClear}
            >
              <i className="bi bi-arrow-counterclockwise me-2"></i> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Filter */}
      {selectedCategory !== undefined && onCategoryChange && (
        <div>
          <div className="small fw-semibold text-secondary mb-2">
            <i className="bi bi-funnel me-1"></i> Filter by Category:
          </div>
          <div className="d-flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
