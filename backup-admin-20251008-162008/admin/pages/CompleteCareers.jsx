import React, { useState } from 'react';

const CompleteCareers = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Construction Supervisor', location: 'Riyadh', type: 'Full-time', applications: 45, active: true },
    { id: 2, title: 'Airport Ground Staff', location: 'Jeddah', type: 'Full-time', applications: 32, active: true },
    { id: 3, title: 'Office Administrator', location: 'Dammam', type: 'Full-time', applications: 28, active: true },
    { id: 4, title: 'Catering Assistant', location: 'Madina', type: 'Part-time', applications: 19, active: true },
    { id: 5, title: 'Warehouse Worker', location: 'Riyadh', type: 'Full-time', applications: 67, active: true },
    { id: 6, title: 'Security Guard', location: 'Jeddah', type: 'Full-time', applications: 23, active: true }
  ]);

  const [applications, setApplications] = useState([
    { id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@email.com', position: 'Construction Supervisor', date: '2025-01-15', status: 'Pending' },
    { id: 2, name: 'Sara Al-Mansouri', email: 'sara@email.com', position: 'Office Administrator', date: '2025-01-14', status: 'Reviewed' },
    { id: 3, name: 'Mohammed Al-Zahra', email: 'mohammed@email.com', position: 'Airport Ground Staff', date: '2025-01-13', status: 'Pending' },
    { id: 4, name: 'Fatima Al-Harbi', email: 'fatima@email.com', position: 'Catering Assistant', date: '2025-01-12', status: 'Shortlisted' },
    { id: 5, name: 'Khalid Al-Shehri', email: 'khalid@email.com', position: 'Warehouse Worker', date: '2025-01-11', status: 'Pending' }
  ]);

  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    active: true
  });

  const handleAddJob = () => {
    setEditingJob(null);
    setJobFormData({ title: '', location: '', type: 'Full-time', active: true });
    setShowJobModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobFormData(job);
    setShowJobModal(true);
  };

  const handleDeleteJob = (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const handleSubmitJob = (e) => {
    e.preventDefault();
    if (editingJob) {
      setJobs(jobs.map(j => j.id === editingJob.id ? { ...jobFormData, id: j.id, applications: j.applications } : j));
    } else {
      setJobs([...jobs, { ...jobFormData, id: Date.now(), applications: 0 }]);
    }
    setShowJobModal(false);
  };

  const updateApplicationStatus = (id, status) => {
    setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>Careers & Jobs</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage job postings and applications</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'jobs' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'white',
              color: activeTab === 'jobs' ? 'white' : '#64748b',
              border: activeTab === 'jobs' ? 'none' : '2px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            💼 Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'applications' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'white',
              color: activeTab === 'applications' ? 'white' : '#64748b',
              border: activeTab === 'applications' ? 'none' : '2px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📋 Applications ({applications.length})
          </button>
        </div>
      </div>

      {activeTab === 'jobs' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={handleAddJob}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}
            >
              ➕ Add New Job
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {jobs.map(job => (
              <div
                key={job.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '2px solid #e2e8f0'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {job.title}
                  </h3>
                  {job.active ? (
                    <span style={{
                      padding: '4px 12px',
                      background: '#d1fae5',
                      color: '#059669',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Active
                    </span>
                  ) : (
                    <span style={{
                      padding: '4px 12px',
                      background: '#f1f5f9',
                      color: '#64748b',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Inactive
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>
                    📍 {job.location} • {job.type}
                  </p>
                  <p style={{ fontSize: '14px', color: '#2563eb', fontWeight: '600', margin: 0 }}>
                    {job.applications} applications received
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <button
                    onClick={() => handleEditJob(job)}
                    style={{
                      padding: '8px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#f59e0b'
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    style={{
                      padding: '8px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#ef4444'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '2px solid #e2e8f0'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Position</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b' }}>{app.name}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{app.email}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{app.position}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{app.date}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: app.status === 'Pending' ? '#fef3c7' : 
                                   app.status === 'Reviewed' ? '#dbeafe' : '#d1fae5',
                        color: app.status === 'Pending' ? '#d97706' : 
                               app.status === 'Reviewed' ? '#2563eb' : '#059669'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'Reviewed')}
                          style={{
                            padding: '4px 8px',
                            background: '#e0e7ff',
                            color: '#4f46e5',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Review
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                          style={{
                            padding: '4px 8px',
                            background: '#d1fae5',
                            color: '#059669',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Shortlist
                        </button>
                        <button
                          style={{
                            padding: '4px 8px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Download CV
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showJobModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={() => setShowJobModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                {editingJob ? 'Edit Job Posting' : 'Add New Job'}
              </h3>
              <button
                onClick={() => setShowJobModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  borderRadius: '8px',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitJob} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobFormData.title}
                  onChange={e => setJobFormData({...jobFormData, title: e.target.value})}
                  required
                  placeholder="e.g., Construction Supervisor"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Location
                </label>
                <select
                  value={jobFormData.location}
                  onChange={e => setJobFormData({...jobFormData, location: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                >
                  <option value="">Select Location</option>
                  <option value="Riyadh">Riyadh</option>
                  <option value="Jeddah">Jeddah</option>
                  <option value="Dammam">Dammam</option>
                  <option value="Madina">Madina</option>
                  <option value="Makkah">Makkah</option>
                  <option value="Taif">Taif</option>
                  <option value="Tabuk">Tabuk</option>
                  <option value="Abha">Abha</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Job Type
                </label>
                <select
                  value={jobFormData.type}
                  onChange={e => setJobFormData({...jobFormData, type: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#475569' }}>
                  <input
                    type="checkbox"
                    checked={jobFormData.active}
                    onChange={e => setJobFormData({...jobFormData, active: e.target.checked})}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span>Active Job Posting</span>
                </label>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                paddingTop: '24px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'white',
                    color: '#64748b',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  {editingJob ? 'Update Job' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteCareers;
