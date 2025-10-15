import React, { useState, useEffect } from 'react';
import './Management.css';

const CareersManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    location: '',
    job_type: 'full_time',
    department: 'corporate_services',
    salary: '',
    requirements: '',
    status: 'active'
  });

  useEffect(() => {
    fetchJobs();
    fetchCVs();
  }, []);

  const fetchJobs = async () => {
    try {
      let token = localStorage.getItem('adminToken');
      
      // Temporary: use hardcoded token if no token in localStorage
      if (!token) {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU2ODZhZjc2MGZkMTU4YTlhMWJiMTkiLCJpYXQiOjE3NTk5MzgyNzMsImV4cCI6MTc2MDAyNDY3M30.yoPc9ENlkcRHhHrcpfnH6Gmtqav50DueDnI_L6c0kaw';
        localStorage.setItem('adminToken', token);
        console.log('Using hardcoded admin token');
      }
      
      console.log('Admin token:', token); // Debug log
      
      const response = await fetch('http://localhost:5001/api/admin/jobs', {
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Jobs API Response:', data); // Debug log
        if (data.success) {
          console.log('Jobs data:', data.data.jobs); // Debug log
          setJobs(data.data.jobs);
        }
      } else {
        console.error('Jobs API Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCVs = async () => {
    try {
      let token = localStorage.getItem('adminToken');
      
      // Temporary: use hardcoded token if no token in localStorage
      if (!token) {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU2ODZhZjc2MGZkMTU4YTlhMWJiMTkiLCJpYXQiOjE3NTk5MzgyNzMsImV4cCI6MTc2MDAyNDY3M30.yoPc9ENlkcRHhHrcpfnH6Gmtqav50DueDnI_L6c0kaw';
        localStorage.setItem('adminToken', token);
      }
      
      const response = await fetch('http://localhost:5001/api/admin/cvs', {
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCvs(data.data.cvs);
        }
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  // Handle Post New Job button
  const handlePostNewJob = () => {
    setEditingJob(null);
    setJobFormData({
      title: '',
      title_ar: '',
      description: '',
      description_ar: '',
      location: '',
      job_type: 'full_time',
      department: 'corporate_services',
      salary: '',
      requirements: '',
      status: 'active'
    });
    setShowJobModal(true);
  };

  // Handle Edit Job button
  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title || '',
      title_ar: job.title_ar || '',
      description: job.description || '',
      description_ar: job.description_ar || '',
      location: job.location || '',
      job_type: job.job_type || job.jobType || 'full_time',
      department: job.department || 'corporate_services',
      salary: job.salary || '',
      requirements: job.requirements || '',
      status: job.status || 'active'
    });
    setShowJobModal(true);
  };

  // Handle Delete Job button
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/admin/jobs/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Remove job from local state
          setJobs(jobs.filter(job => job._id !== jobId));
          alert('Job deleted successfully!');
        } else {
          alert('Failed to delete job');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job');
      }
    }
  };

  // Handle form submission
  const handleSubmitJob = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingJob 
        ? `http://localhost:5001/api/admin/jobs/${editingJob._id}`
        : 'http://localhost:5001/api/admin/jobs';
      
      const method = editingJob ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobFormData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh jobs list
          fetchJobs();
          setShowJobModal(false);
          setEditingJob(null);
          alert(editingJob ? 'Job updated successfully!' : 'Job created successfully!');
        } else {
          alert(data.message || 'Failed to save job');
        }
      } else {
        alert('Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Error saving job');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading careers data...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Careers & Jobs Management</h2>
        <button className="btn-primary" onClick={handlePostNewJob}>+ Post New Job</button>
      </div>

      <div style={{marginBottom: '20px'}}>
        <button 
          onClick={() => setActiveTab('jobs')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: activeTab === 'jobs' ? '#2563eb' : '#e5e7eb',
            color: activeTab === 'jobs' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Job Postings ({jobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('cvs')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'cvs' ? '#2563eb' : '#e5e7eb',
            color: activeTab === 'cvs' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          CV Submissions ({cvs.length})
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>
                    No job postings yet
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id}>
                    <td><strong>{job.title || job.title_en || 'No Title'}</strong></td>
                    <td>{job.location || 'Not specified'}</td>
                    <td>{job.job_type || job.jobType || 'Not specified'}</td>
                    <td>
                      <span className={`status-badge ${job.status === 'active' ? 'active' : 'inactive'}`}>
                        {job.status || 'draft'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-edit" onClick={() => handleEditJob(job)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteJob(job._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'cvs' && (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Job</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cvs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>
                    No CV submissions yet
                  </td>
                </tr>
              ) : (
                cvs.map((cv) => (
                  <tr key={cv._id}>
                    <td><strong>{cv.applicant_name}</strong></td>
                    <td>{cv.email}</td>
                    <td>{cv.phone}</td>
                    <td>{cv.job_id?.title_en || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${cv.status === 'new' ? 'active' : 'inactive'}`}>
                        {cv.status}
                      </span>
                    </td>
                    <td>{new Date(cv.submitted_at).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-edit">View</button>
                        <button className="btn-delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Job Modal */}
      {showJobModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingJob ? 'Edit Job' : 'Create New Job'}</h3>
              <button className="modal-close" onClick={() => setShowJobModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmitJob} className="job-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Job Title (English) *</label>
                  <input
                    type="text"
                    name="title"
                    value={jobFormData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter job title in English"
                  />
                </div>
                <div className="form-group">
                  <label>Job Title (Arabic)</label>
                  <input
                    type="text"
                    name="title_ar"
                    value={jobFormData.title_ar}
                    onChange={handleInputChange}
                    placeholder="Enter job title in Arabic"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <select
                    name="location"
                    value={jobFormData.location}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="Riyadh">Riyadh</option>
                    <option value="Jeddah">Jeddah</option>
                    <option value="Dammam">Dammam</option>
                    <option value="Mecca">Mecca</option>
                    <option value="Medina">Medina</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    name="job_type"
                    value={jobFormData.job_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={jobFormData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="corporate_services">Corporate Services</option>
                    <option value="airport_operations">Airport Operations</option>
                    <option value="catering">Catering</option>
                    <option value="logistics">Logistics</option>
                    <option value="construction">Construction</option>
                    <option value="facility_management">Facility Management</option>
                    <option value="administration">Administration</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance</option>
                    <option value="it">Information Technology</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={jobFormData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                    <option value="filled">Filled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Salary Range</label>
                <input
                  type="text"
                  name="salary"
                  value={jobFormData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000 - 8000 SAR"
                />
              </div>

              <div className="form-group">
                <label>Job Description (English) *</label>
                <textarea
                  name="description"
                  value={jobFormData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Enter detailed job description in English"
                />
              </div>

              <div className="form-group">
                <label>Job Description (Arabic)</label>
                <textarea
                  name="description_ar"
                  value={jobFormData.description_ar}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter detailed job description in Arabic"
                />
              </div>

              <div className="form-group">
                <label>Requirements</label>
                <textarea
                  name="requirements"
                  value={jobFormData.requirements}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter job requirements and qualifications"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowJobModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersManagement;
