import React, { useState } from 'react';
import JobCard from './JobCard';
import './JobsList.css';

const JobsList = ({ jobs, loading, onView, onEdit, onClone, onDelete, onPreview, selectedJobs, onSelectJob }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  if (loading) {
    return (
      <div className="jobs-loading">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="jobs-empty">
        <div className="empty-icon">📋</div>
        <h3>No Jobs Found</h3>
        <p>There are no jobs matching your criteria. Try adjusting your filters or create a new job.</p>
      </div>
    );
  }

  return (
    <div className="jobs-list-container">
      <div className="jobs-list-header">
        <div className="results-count">
          Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </div>
        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <span className="icon">▦</span>
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <span className="icon">☰</span>
          </button>
        </div>
      </div>

      <div className={`jobs-list ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
        {jobs.map(job => (
          <div key={job._id} className="job-list-item">
            {onSelectJob && (
              <div className="job-checkbox">
                <input
                  type="checkbox"
                  checked={selectedJobs?.includes(job._id)}
                  onChange={() => onSelectJob(job._id)}
                />
              </div>
            )}
            <JobCard
              job={job}
              onView={onView}
              onEdit={onEdit}
              onClone={onClone}
              onDelete={onDelete}
              onPreview={onPreview}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsList;

