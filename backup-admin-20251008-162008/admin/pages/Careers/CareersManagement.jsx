import React, { useState } from 'react';
import '../../styles/management.css';
import './CareersManagement.css';

const CareersManagement = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Construction Worker', location: 'Riyadh', applications: 45, status: 'Active' },
    { id: 2, title: 'Airport Ground Staff', location: 'Jeddah', applications: 32, status: 'Active' },
    { id: 3, title: 'Facility Manager', location: 'Dammam', applications: 12, status: 'Active' }
  ]);

  const [applications, setApplications] = useState([
    { id: 1, name: 'Ahmed Ali', job: 'Construction Worker', email: 'ahmed@example.com', phone: '+966501234567', date: '2025-01-15', cv: 'ahmed_cv.pdf' },
    { id: 2, name: 'Mohammed Hassan', job: 'Airport Ground Staff', email: 'mohammed@example.com', phone: '+966502345678', date: '2025-01-14', cv: 'mohammed_cv.pdf' },
    { id: 3, name: 'Khalid Ibrahim', job: 'Facility Manager', email: 'khalid@example.com', phone: '+966503456789', date: '2025-01-13', cv: 'khalid_cv.pdf' }
  ]);

  const downloadCV = (application) => {
    alert(`Downloading CV for ${application.name}`);
  };

  return (
    <div className="careers-management">
      <div className="page-header">
        <div>
          <h2>Careers Management</h2>
          <p>Manage job postings and applications</p>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"/>
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
          </svg>
          Job Postings ({jobs.length})
        </button>
        <button 
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"/>
          </svg>
          Applications ({applications.length})
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td><strong>{job.title}</strong></td>
                  <td>{job.location}</td>
                  <td>
                    <span className="badge-info">{job.applications} applications</span>
                  </td>
                  <td>
                    <span className="badge-success">{job.status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon btn-edit">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button className="btn-icon btn-delete">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Job Title</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date Applied</th>
                <th>CV</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td><strong>{app.name}</strong></td>
                  <td>{app.job}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>{app.date}</td>
                  <td>
                    <button 
                      className="btn-download"
                      onClick={() => downloadCV(app)}
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/>
                      </svg>
                      Download CV
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CareersManagement;
