import React, { useState, useEffect } from 'react';
import useJobs from '../hooks/useJobs';
import JobsList from '../components/Jobs/JobsList';
import AddJobModal from '../components/Jobs/AddJobModal';
import EditJobModal from '../components/Jobs/EditJobModal';
import './JobsManagement.css';

const JobsManagement = () => {
  const {
    jobs,
    loading,
    error,
    pagination,
    statistics,
    fetchJobs,
    fetchJobStatistics,
    createJob,
    updateJob,
    cloneJob,
    deleteJob,
    updateJobStatus,
    updateFilters
  } = useJobs();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchJobStatistics();
  }, []);

  const handleViewApplications = (jobId) => {
    // Navigate to applications page with job filter
    window.location.href = `/admin/applications?jobId=${jobId}`;
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowEditModal(true);
  };

  const handleCloneJob = async (jobId) => {
    if (window.confirm('Clone this job posting?')) {
      try {
        await cloneJob(jobId);
        alert('Job cloned successfully!');
      } catch (error) {
        alert('Failed to clone job');
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
        alert('Job deleted successfully!');
      } catch (error) {
        alert(error.message || 'Failed to delete job');
      }
    }
  };

  const handlePreviewJob = (job) => {
    // Open job in new tab for preview
    window.open(`/careers/${job.slug || job._id}`, '_blank');
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

  const handleBulkAction = (action) => {
    if (selectedJobs.length === 0) {
      alert('Please select jobs first');
      return;
    }

    if (action === 'activate') {
      // Bulk activate jobs
      console.log('Activating jobs:', selectedJobs);
    } else if (action === 'deactivate') {
      // Bulk deactivate jobs
      console.log('Deactivating jobs:', selectedJobs);
    }
  };

  const handleSelectJob = (jobId) => {
    setSelectedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="jobs-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Career & Jobs Management</h1>
          <p>Manage job postings and track applications</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Add New Job
        </button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{statistics.overview.activeJobs}</h3>
              <p>Active Jobs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{statistics.overview.totalApplications}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <h3>{statistics.overview.urgentJobs}</h3>
              <p>Urgent Hiring</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{statistics.overview.filledJobs}</h3>
              <p>Filled Positions</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="action-toolbar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search jobs by title, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">🔍 Search</button>
        </form>

        <div className="bulk-actions">
          <button onClick={() => handleBulkAction('activate')} disabled={selectedJobs.length === 0}>
            Activate Selected
          </button>
          <button onClick={() => handleBulkAction('deactivate')} disabled={selectedJobs.length === 0}>
            Deactivate Selected
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => handleTabChange('all')}>
          All Jobs
        </button>
        <button className={activeTab === 'active' ? 'active' : ''} onClick={() => handleTabChange('active')}>
          Active
        </button>
        <button className={activeTab === 'draft' ? 'active' : ''} onClick={() => handleTabChange('draft')}>
          Draft
        </button>
        <button className={activeTab === 'filled' ? 'active' : ''} onClick={() => handleTabChange('filled')}>
          Filled
        </button>
        <button className={activeTab === 'expired' ? 'active' : ''} onClick={() => handleTabChange('expired')}>
          Expired
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Jobs List */}
      <JobsList
        jobs={jobs}
        loading={loading}
        onView={handleViewApplications}
        onEdit={handleEditJob}
        onClone={handleCloneJob}
        onDelete={handleDeleteJob}
        onPreview={handlePreviewJob}
        selectedJobs={selectedJobs}
        onSelectJob={handleSelectJob}
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
      <AddJobModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={createJob}
        isLoading={loading}
      />

      <EditJobModal
        isOpen={showEditModal}
        job={selectedJob}
        onClose={() => {
          setShowEditModal(false);
          setSelectedJob(null);
        }}
        onSubmit={updateJob}
        isLoading={loading}
      />
    </div>
  );
};

export default JobsManagement;

