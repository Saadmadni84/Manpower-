import React, { useState } from 'react';
import './JobForm.css';

const JobForm = ({ initialData = {}, onSubmit, onCancel, isLoading }) => {
  const [currentTab, setCurrentTab] = useState('basics');
  const [formData, setFormData] = useState({
    title: { en: '', ar: '', ...initialData.title },
    department: initialData.department || '',
    category: initialData.category || '',
    jobType: initialData.jobType || 'full_time',
    workSchedule: initialData.workSchedule || 'day_shift',
    locations: initialData.locations || [{ city: '', region: '', isRemote: false, isPrimary: true }],
    summary: { en: '', ar: '', ...initialData.summary },
    description: { en: '', ar: '', ...initialData.description },
    responsibilities: { en: [], ar: [], ...initialData.responsibilities },
    requirements: { en: [], ar: [], ...initialData.requirements },
    skills: { required: [], preferred: [], ...initialData.skills },
    experienceLevel: initialData.experienceLevel || 'entry',
    minExperience: initialData.minExperience || 0,
    maxExperience: initialData.maxExperience || '',
    educationLevel: initialData.educationLevel || 'high_school',
    salary: {
      min: '',
      max: '',
      currency: 'SAR',
      type: 'monthly',
      negotiable: false,
      ...initialData.salary
    },
    benefits: initialData.benefits || [],
    applicationDeadline: initialData.applicationDeadline || '',
    numberOfPositions: initialData.numberOfPositions || 1,
    urgentHiring: initialData.urgentHiring || false,
    applicationMethod: initialData.applicationMethod || 'online_form',
    status: initialData.status || 'draft',
    visibility: initialData.visibility || 'public',
    featuredJob: initialData.featuredJob || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const addArrayItem = (field, item = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), item]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'basics', label: 'Job Basics' },
    { id: 'description', label: 'Description' },
    { id: 'experience', label: 'Experience & Education' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'settings', label: 'Application Settings' }
  ];

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <div className="form-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => setCurrentTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="form-content">
        {currentTab === 'basics' && (
          <div className="tab-panel">
            <h3>Job Basics</h3>
            
            <div className="form-group">
              <label>Job Title (English) *</label>
              <input
                type="text"
                value={formData.title.en}
                onChange={(e) => updateNestedField('title', 'en', e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Job Title (Arabic)</label>
              <input
                type="text"
                value={formData.title.ar}
                onChange={(e) => updateNestedField('title', 'ar', e.target.value)}
                maxLength={100}
                dir="rtl"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="airport_operations">Airport Operations</option>
                  <option value="corporate_services">Corporate Services</option>
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
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="management">Management</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="skilled_worker">Skilled Worker</option>
                  <option value="general_worker">General Worker</option>
                  <option value="specialist">Specialist</option>
                  <option value="intern">Intern</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Job Type *</label>
                <select
                  value={formData.jobType}
                  onChange={(e) => updateField('jobType', e.target.value)}
                  required
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label>Work Schedule</label>
                <select
                  value={formData.workSchedule}
                  onChange={(e) => updateField('workSchedule', e.target.value)}
                >
                  <option value="day_shift">Day Shift</option>
                  <option value="night_shift">Night Shift</option>
                  <option value="rotating_shift">Rotating Shift</option>
                  <option value="flexible">Flexible</option>
                  <option value="weekend_only">Weekend Only</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location(s) *</label>
              {formData.locations.map((loc, index) => (
                <div key={index} className="location-item">
                  <input
                    type="text"
                    placeholder="City"
                    value={loc.city}
                    onChange={(e) => {
                      const newLocs = [...formData.locations];
                      newLocs[index].city = e.target.value;
                      updateField('locations', newLocs);
                    }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Region (optional)"
                    value={loc.region}
                    onChange={(e) => {
                      const newLocs = [...formData.locations];
                      newLocs[index].region = e.target.value;
                      updateField('locations', newLocs);
                    }}
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={loc.isRemote}
                      onChange={(e) => {
                        const newLocs = [...formData.locations];
                        newLocs[index].isRemote = e.target.checked;
                        updateField('locations', newLocs);
                      }}
                    />
                    Remote
                  </label>
                  {index > 0 && (
                    <button type="button" onClick={() => removeArrayItem('locations', index)}>Remove</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('locations', { city: '', region: '', isRemote: false })}>
                Add Location
              </button>
            </div>
          </div>
        )}

        {currentTab === 'description' && (
          <div className="tab-panel">
            <h3>Job Description</h3>
            
            <div className="form-group">
              <label>Summary (English) * (Max 300 chars)</label>
              <textarea
                value={formData.summary.en}
                onChange={(e) => updateNestedField('summary', 'en', e.target.value)}
                required
                maxLength={300}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Full Description (English) *</label>
              <textarea
                value={formData.description.en}
                onChange={(e) => updateNestedField('description', 'en', e.target.value)}
                required
                rows={6}
              />
            </div>

            <div className="form-group">
              <label>Key Responsibilities (English) *</label>
              {formData.responsibilities.en.map((resp, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => {
                      const newResp = [...formData.responsibilities.en];
                      newResp[index] = e.target.value;
                      updateNestedField('responsibilities', 'en', newResp);
                    }}
                    required
                  />
                  <button type="button" onClick={() => {
                    const newResp = formData.responsibilities.en.filter((_, i) => i !== index);
                    updateNestedField('responsibilities', 'en', newResp);
                  }}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => {
                updateNestedField('responsibilities', 'en', [...formData.responsibilities.en, '']);
              }}>Add Responsibility</button>
            </div>

            <div className="form-group">
              <label>Requirements (English) *</label>
              {formData.requirements.en.map((req, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => {
                      const newReq = [...formData.requirements.en];
                      newReq[index] = e.target.value;
                      updateNestedField('requirements', 'en', newReq);
                    }}
                    required
                  />
                  <button type="button" onClick={() => {
                    const newReq = formData.requirements.en.filter((_, i) => i !== index);
                    updateNestedField('requirements', 'en', newReq);
                  }}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => {
                updateNestedField('requirements', 'en', [...formData.requirements.en, '']);
              }}>Add Requirement</button>
            </div>
          </div>
        )}

        {currentTab === 'experience' && (
          <div className="tab-panel">
            <h3>Experience & Education</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Experience Level *</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => updateField('experienceLevel', e.target.value)}
                  required
                >
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Min Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minExperience}
                  onChange={(e) => updateField('minExperience', parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Max Experience (Years)</label>
                <input
                  type="number"
                  min={formData.minExperience}
                  value={formData.maxExperience}
                  onChange={(e) => updateField('maxExperience', e.target.value ? parseInt(e.target.value) : '')}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Education Level Required *</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => updateField('educationLevel', e.target.value)}
                required
              >
                <option value="high_school">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="professional_cert">Professional Certification</option>
              </select>
            </div>
          </div>
        )}

        {currentTab === 'compensation' && (
          <div className="tab-panel">
            <h3>Compensation & Benefits</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Minimum Salary</label>
                <input
                  type="number"
                  min="0"
                  value={formData.salary.min}
                  onChange={(e) => updateNestedField('salary', 'min', parseInt(e.target.value) || '')}
                />
              </div>

              <div className="form-group">
                <label>Maximum Salary</label>
                <input
                  type="number"
                  min={formData.salary.min || 0}
                  value={formData.salary.max}
                  onChange={(e) => updateNestedField('salary', 'max', parseInt(e.target.value) || '')}
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select
                  value={formData.salary.currency}
                  onChange={(e) => updateNestedField('salary', 'currency', e.target.value)}
                >
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div className="form-group">
                <label>Salary Type</label>
                <select
                  value={formData.salary.type}
                  onChange={(e) => updateNestedField('salary', 'type', e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.salary.negotiable}
                  onChange={(e) => updateNestedField('salary', 'negotiable', e.target.checked)}
                />
                Salary Negotiable
              </label>
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="tab-panel">
            <h3>Application Settings</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Application Deadline *</label>
                <input
                  type="date"
                  value={formData.applicationDeadline ? formData.applicationDeadline.split('T')[0] : ''}
                  onChange={(e) => updateField('applicationDeadline', e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Number of Positions *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.numberOfPositions}
                  onChange={(e) => updateField('numberOfPositions', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Application Method</label>
                <select
                  value={formData.applicationMethod}
                  onChange={(e) => updateField('applicationMethod', e.target.value)}
                >
                  <option value="online_form">Online Form</option>
                  <option value="email">Email</option>
                  <option value="in_person">In Person</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              <div className="form-group">
                <label>Visibility</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => updateField('visibility', e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="filled">Filled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.urgentHiring}
                  onChange={(e) => updateField('urgentHiring', e.target.checked)}
                />
                Urgent Hiring
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.featuredJob}
                  onChange={(e) => updateField('featuredJob', e.target.checked)}
                />
                Featured Job
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (initialData._id ? 'Update Job' : 'Create Job')}
        </button>
      </div>
    </form>
  );
};

export default JobForm;

