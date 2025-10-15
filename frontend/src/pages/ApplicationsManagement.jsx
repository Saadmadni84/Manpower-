import React, { useState, useEffect } from 'react';
import useApplications from '../hooks/useApplications';
import ApplicationsTable from '../components/Applications/ApplicationsTable';
import ApplicationDetails from '../components/Applications/ApplicationDetails';
import InterviewScheduler from '../components/Applications/InterviewScheduler';
import StatusPipeline from '../components/UI/StatusPipeline';
import CVViewer from '../components/UI/CVViewer';
import './ApplicationsManagement.css';

const ApplicationsManagement = () => {
  const {
    applications,
    loading,
    error,
    pagination,
    statistics,
    fetchApplications,
    fetchApplicationStatistics,
    updateApplicationStatus,
    scheduleInterview,
    deleteApplication,
    exportApplications,
    updateFilters
  } = useApplications();

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
    fetchApplicationStatistics();
  }, []);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (application) => {
    setSelectedApplication(application);
    setShowStatusModal(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedApplication) {
      try {
        await updateApplicationStatus(selectedApplication._id, newStatus);
        alert('Status updated successfully!');
        setShowStatusModal(false);
        setSelectedApplication(null);
      } catch (error) {
        alert('Failed to update status');
      }
    }
  };

  const handleScheduleInterview = (application) => {
    setSelectedApplication(application);
    setShowInterviewModal(true);
  };

  const handleInterviewSchedule = async (interviewData) => {
    try {
      await scheduleInterview(selectedApplication._id, interviewData);
      alert('Interview scheduled successfully!');
      setShowInterviewModal(false);
      setSelectedApplication(null);
    } catch (error) {
      alert('Failed to schedule interview');
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(applicationId);
        alert('Application deleted successfully!');
      } catch (error) {
        alert('Failed to delete application');
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportApplications();
      alert('Applications exported successfully!');
    } catch (error) {
      alert('Failed to export applications');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const statusFilter = tab === 'all' ? {} : { status: tab };
    updateFilters(statusFilter);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const handleSelectApplication = (applicationId, checked) => {
    setSelectedApplications(prev =>
      checked
        ? [...prev, applicationId]
        : prev.filter(id => id !== applicationId)
    );
  };

  return (
    <div className="applications-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Applications Management</h1>
          <p>Review and manage job applications</p>
        </div>
        <button className="btn-export" onClick={handleExport}>
          📥 Export Applications
        </button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{statistics.overview.totalApplications}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🆕</div>
            <div className="stat-info">
              <h3>
                {statistics.applicationsByStatus?.find(s => s._id === 'submitted')?.count || 0}
              </h3>
              <p>New Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>
                {statistics.applicationsByStatus?.find(s => s._id === 'interview_scheduled')?.count || 0}
              </h3>
              <p>Interviews Scheduled</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>
                {statistics.applicationsByStatus?.find(s => s._id === 'hired')?.count || 0}
              </h3>
              <p>Hired</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="action-toolbar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name, email, application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">🔍 Search</button>
        </form>

        <div className="filter-controls">
          <select onChange={(e) => updateFilters({ jobId: e.target.value })}>
            <option value="">All Jobs</option>
            {/* Job options would be populated here */}
          </select>
          <select onChange={(e) => updateFilters({ source: e.target.value })}>
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="linkedin">LinkedIn</option>
            <option value="job_board">Job Board</option>
            <option value="referral">Referral</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => handleTabChange('all')}>
          All Applications
        </button>
        <button className={activeTab === 'submitted' ? 'active' : ''} onClick={() => handleTabChange('submitted')}>
          New
        </button>
        <button className={activeTab === 'screening' ? 'active' : ''} onClick={() => handleTabChange('screening')}>
          In Review
        </button>
        <button className={activeTab === 'interview_scheduled' ? 'active' : ''} onClick={() => handleTabChange('interview_scheduled')}>
          Interviews
        </button>
        <button className={activeTab === 'offer_made' ? 'active' : ''} onClick={() => handleTabChange('offer_made')}>
          Offers Made
        </button>
        <button className={activeTab === 'hired' ? 'active' : ''} onClick={() => handleTabChange('hired')}>
          Hired
        </button>
        <button className={activeTab === 'rejected' ? 'active' : ''} onClick={() => handleTabChange('rejected')}>
          Rejected
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Applications Table */}
      <ApplicationsTable
        applications={applications}
        loading={loading}
        onView={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteApplication}
        selectedApplications={selectedApplications}
        onSelectApplication={handleSelectApplication}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => updateFilters({ page: pagination.currentPage - 1 })}
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => updateFilters({ page: pagination.currentPage + 1 })}
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showDetailsModal && selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedApplication(null);
          }}
        />
      )}

      {showInterviewModal && selectedApplication && (
        <InterviewScheduler
          application={selectedApplication}
          onSchedule={handleInterviewSchedule}
          onClose={() => {
            setShowInterviewModal(false);
            setSelectedApplication(null);
          }}
        />
      )}

      {showStatusModal && selectedApplication && (
        <div className="status-modal">
          <div className="modal-overlay" onClick={() => setShowStatusModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Update Application Status</h2>
              <button className="close-btn" onClick={() => setShowStatusModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <StatusPipeline
                currentStatus={selectedApplication.status}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      )}

      {showCVModal && selectedApplication && (
        <CVViewer
          cvFile={selectedApplication.files?.cv}
          onClose={() => {
            setShowCVModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
};

export default ApplicationsManagement;

