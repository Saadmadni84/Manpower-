import React from 'react';
import './ApplicationCard.css';

const ApplicationCard = ({ application, onView, onUpdateStatus, onScheduleInterview }) => {
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
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="application-card">
      <div className="application-header">
        <div className="applicant-info">
          <h3>{application.personalInfo.firstName} {application.personalInfo.lastName}</h3>
          <span className="app-id">{application.applicationId}</span>
        </div>
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusColor(application.status) }}
        >
          {application.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="application-body">
        <div className="info-row">
          <span className="label">Job:</span>
          <span className="value">{application.jobId?.title?.en || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="label">Email:</span>
          <span className="value">{application.personalInfo.email}</span>
        </div>
        <div className="info-row">
          <span className="label">Phone:</span>
          <span className="value">{application.personalInfo.phone}</span>
        </div>
        <div className="info-row">
          <span className="label">Experience:</span>
          <span className="value">{application.professional.totalExperience} years</span>
        </div>
        <div className="info-row">
          <span className="label">Expected Salary:</span>
          <span className="value">{application.professional.expectedSalary?.toLocaleString() || 'N/A'} SAR</span>
        </div>
        <div className="info-row">
          <span className="label">Submitted:</span>
          <span className="value">{formatDate(application.submittedAt)}</span>
        </div>
      </div>

      <div className="application-footer">
        <button className="card-btn view-btn" onClick={() => onView(application)}>View Details</button>
        {onUpdateStatus && (
          <button className="card-btn status-btn" onClick={() => onUpdateStatus(application)}>Update Status</button>
        )}
        {onScheduleInterview && (
          <button className="card-btn interview-btn" onClick={() => onScheduleInterview(application)}>Schedule Interview</button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;

