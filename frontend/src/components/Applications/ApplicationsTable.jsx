import React, { useState } from 'react';
import './ApplicationsTable.css';

const ApplicationsTable = ({ applications, loading, onView, onUpdateStatus, onDelete, selectedApplications, onSelectApplication }) => {
  const [sortField, setSortField] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: '#3498db',
      screening: '#f39c12',
      interview_scheduled: '#9b59b6',
      interviewed: '#1abc9c',
      technical_test: '#e67e22',
      reference_check: '#34495e',
      offer_made: '#16a085',
      hired: '#27ae60',
      rejected: '#e74c3c',
      withdrawn: '#95a5a6'
    };
    return colors[status] || '#7f8c8d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="applications-loading">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="applications-empty">
        <div className="empty-icon">📝</div>
        <h3>No Applications Found</h3>
        <p>There are no applications matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="applications-table-container">
      <div className="table-wrapper">
        <table className="applications-table">
          <thead>
            <tr>
              {onSelectApplication && (
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        applications.forEach(app => onSelectApplication(app._id, true));
                      } else {
                        applications.forEach(app => onSelectApplication(app._id, false));
                      }
                    }}
                  />
                </th>
              )}
              <th onClick={() => handleSort('applicationId')}>
                Application ID {sortField === 'applicationId' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('personalInfo.firstName')}>
                Candidate Name {sortField === 'personalInfo.firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Job Position</th>
              <th>Email</th>
              <th>Experience</th>
              <th onClick={() => handleSort('status')}>
                Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('submittedAt')}>
                Submitted {sortField === 'submittedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                {onSelectApplication && (
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedApplications?.includes(app._id) || false}
                      onChange={(e) => onSelectApplication(app._id, e.target.checked)}
                    />
                  </td>
                )}
                <td className="app-id">{app.applicationId}</td>
                <td className="candidate-name">
                  {app.personalInfo.firstName} {app.personalInfo.lastName}
                </td>
                <td className="job-title">{app.jobId?.title?.en || 'N/A'}</td>
                <td className="email">{app.personalInfo.email}</td>
                <td className="experience">{app.professional.totalExperience} years</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(app.status) }}
                  >
                    {app.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="submitted-date">{formatDate(app.submittedAt)}</td>
                <td className="actions">
                  <button className="action-btn view-btn" onClick={() => onView(app)}>View</button>
                  {onUpdateStatus && (
                    <button className="action-btn status-btn" onClick={() => onUpdateStatus(app)}>Status</button>
                  )}
                  {onDelete && (
                    <button className="action-btn delete-btn" onClick={() => onDelete(app._id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsTable;

