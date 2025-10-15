import React from 'react';
import './JobCard.css';

const JobCard = ({ job, onView, onEdit, onClone, onDelete, onPreview }) => {
  // Calculate days until deadline
  const getDaysUntilDeadline = () => {
    const today = new Date();
    const deadline = new Date(job.applicationDeadline);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline();

  // Status badge colors
  const getStatusColor = (status) => {
    const colors = {
      draft: 'gray',
      active: 'green',
      paused: 'orange',
      filled: 'blue',
      cancelled: 'red',
      expired: 'darkgray'
    };
    return colors[status] || 'gray';
  };

  // Department icons
  const getDepartmentIcon = (department) => {
    const icons = {
      airport_operations: '✈️',
      corporate_services: '🏢',
      catering: '🍽️',
      logistics: '📦',
      construction: '🏗️',
      facility_management: '🔧',
      administration: '📋',
      hr: '👥',
      finance: '💰',
      it: '💻'
    };
    return icons[department] || '📌';
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-title-section">
          {job.featuredJob && <span className="featured-star">⭐</span>}
          {job.urgentHiring && <span className="urgent-badge">URGENT</span>}
          <h3 className="job-title">{job.title.en}</h3>
          <span className="job-code">{job.jobCode}</span>
        </div>
        <span className={`status-badge status-${job.status}`} style={{ backgroundColor: getStatusColor(job.status) }}>
          {job.status.toUpperCase()}
        </span>
      </div>

      <div className="job-card-body">
        <div className="job-info-row">
          <span className="department-badge">
            {getDepartmentIcon(job.department)} {job.department.replace('_', ' ').toUpperCase()}
          </span>
          <span className="job-type-badge">{job.jobType.replace('_', ' ')}</span>
        </div>

        <div className="job-locations">
          📍 {job.locations.map(loc => (
            <span key={loc.city} className="location-tag">
              {loc.city}
              {loc.isRemote && ' (Remote)'}
            </span>
          ))}
        </div>

        {job.salary && job.salary.min && (
          <div className="job-salary">
            💵 {job.salary.min.toLocaleString()} - {job.salary.max?.toLocaleString() || 'Negotiable'} {job.salary.currency}/{job.salary.type}
          </div>
        )}

        <div className="job-details-row">
          <div className="detail-item">
            <span className="detail-label">Experience:</span>
            <span className="detail-value">{job.experienceLevel}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Positions:</span>
            <span className="detail-value">{job.numberOfPositions}</span>
          </div>
        </div>

        <div className="job-deadline">
          <span className="deadline-label">Deadline:</span>
          <span className={`deadline-value ${daysLeft < 7 ? 'deadline-urgent' : ''}`}>
            {new Date(job.applicationDeadline).toLocaleDateString()}
            <span className="days-left">({daysLeft > 0 ? `${daysLeft} days left` : 'Expired'})</span>
          </span>
        </div>

        <div className="job-stats">
          <div className="stat-item">
            <span className="stat-icon">👁️</span>
            <span className="stat-value">{job.viewCount || 0} views</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📝</span>
            <span className="stat-value">{job.applicationCount || 0} applications</span>
          </div>
        </div>
      </div>

      <div className="job-card-footer">
        <button className="job-action-btn view-btn" onClick={() => onView(job._id)}>
          View Applications
        </button>
        <button className="job-action-btn edit-btn" onClick={() => onEdit(job)}>
          Edit
        </button>
        <button className="job-action-btn clone-btn" onClick={() => onClone(job._id)}>
          Clone
        </button>
        <button className="job-action-btn preview-btn" onClick={() => onPreview(job)}>
          Preview
        </button>
        <button className="job-action-btn delete-btn" onClick={() => onDelete(job._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;

