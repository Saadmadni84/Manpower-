import React, { useState } from 'react';
import './ApplicationDetails.css';

const ApplicationDetails = ({ application, onClose }) => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'professional', label: 'Professional' },
    { id: 'education', label: 'Education' },
    { id: 'documents', label: 'Documents' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'interviews', label: 'Interviews' }
  ];

  return (
    <div className="application-details-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2>{application.personalInfo.firstName} {application.personalInfo.lastName}</h2>
            <span className="app-id">{application.applicationId}</span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {activeTab === 'personal' && (
            <div className="tab-content">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name:</label>
                  <span>{application.personalInfo.firstName} {application.personalInfo.lastName}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{application.personalInfo.email}</span>
                </div>
                <div className="info-item">
                  <label>Phone:</label>
                  <span>{application.personalInfo.phone}</span>
                </div>
                <div className="info-item">
                  <label>Nationality:</label>
                  <span>{application.personalInfo.nationality}</span>
                </div>
                <div className="info-item">
                  <label>Gender:</label>
                  <span>{application.personalInfo.gender || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Date of Birth:</label>
                  <span>{application.personalInfo.dateOfBirth ? new Date(application.personalInfo.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <h4>Address</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>City:</label>
                  <span>{application.address?.current?.city || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Country:</label>
                  <span>{application.address?.current?.country || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="tab-content">
              <h3>Professional Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Total Experience:</label>
                  <span>{application.professional.totalExperience} years</span>
                </div>
                <div className="info-item">
                  <label>Current Job Title:</label>
                  <span>{application.professional.currentJobTitle || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Current Employer:</label>
                  <span>{application.professional.currentEmployer || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Expected Salary:</label>
                  <span>{application.professional.expectedSalary?.toLocaleString()} SAR</span>
                </div>
                <div className="info-item">
                  <label>Notice Period:</label>
                  <span>{application.professional.noticePeriod?.replace('_', ' ') || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Willing to Relocate:</label>
                  <span>{application.professional.willingToRelocate ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {application.experience && application.experience.length > 0 && (
                <>
                  <h4>Work Experience</h4>
                  {application.experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <h5>{exp.jobTitle} at {exp.company}</h5>
                      <p className="experience-dates">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                      </p>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul>
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="tab-content">
              <h3>Education History</h3>
              {application.education && application.education.length > 0 ? (
                application.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h4>{edu.level?.replace('_', ' ').toUpperCase()}</h4>
                    <p><strong>{edu.institution}</strong></p>
                    <p>Field: {edu.field || 'N/A'}</p>
                    <p>Graduation Year: {edu.graduationYear}</p>
                    {edu.grade && <p>Grade: {edu.grade}</p>}
                  </div>
                ))
              ) : (
                <p>No education records available</p>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="tab-content">
              <h3>Application Documents</h3>
              {application.files?.cv && (
                <div className="document-item">
                  <h4>📄 CV / Resume</h4>
                  <p>{application.files.cv.originalName}</p>
                  <button className="download-btn">Download CV</button>
                </div>
              )}
              {application.files?.coverLetter && (
                <div className="document-item">
                  <h4>📝 Cover Letter</h4>
                  <p>{application.files.coverLetter.originalName}</p>
                  <button className="download-btn">Download</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="tab-content">
              <h3>Evaluation & Notes</h3>
              {application.evaluation?.overallRating && (
                <div className="rating-section">
                  <div className="rating-item">
                    <label>Overall Rating:</label>
                    <span className="rating">{application.evaluation.overallRating}/5</span>
                  </div>
                  <div className="rating-item">
                    <label>Technical Rating:</label>
                    <span className="rating">{application.evaluation.technicalRating}/5</span>
                  </div>
                  <div className="rating-item">
                    <label>Communication:</label>
                    <span className="rating">{application.evaluation.communicationRating}/5</span>
                  </div>
                </div>
              )}
              {application.evaluation?.notes && (
                <div className="notes-section">
                  <h4>Notes</h4>
                  <p>{application.evaluation.notes}</p>
                </div>
              )}
              {!application.evaluation && <p>No evaluation available yet</p>}
            </div>
          )}

          {activeTab === 'interviews' && (
            <div className="tab-content">
              <h3>Interview History</h3>
              {application.interviews && application.interviews.length > 0 ? (
                application.interviews.map((interview, index) => (
                  <div key={index} className="interview-item">
                    <h4>{interview.type?.replace('_', ' ').toUpperCase()}</h4>
                    <p>Status: {interview.status}</p>
                    <p>Date: {new Date(interview.scheduledDate).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No interviews scheduled yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;

