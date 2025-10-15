import React, { useState } from 'react';
import './InterviewScheduler.css';

const InterviewScheduler = ({ application, onSchedule, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'phone_screening',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    location: {
      type: 'online',
      address: '',
      meetingLink: ''
    },
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule(formData);
  };

  return (
    <div className="interview-scheduler-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Schedule Interview</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="applicant-info">
            <h3>{application.personalInfo.firstName} {application.personalInfo.lastName}</h3>
            <p>{application.jobId?.title?.en}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Interview Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="phone_screening">Phone Screening</option>
                <option value="video_call">Video Call</option>
                <option value="in_person">In Person</option>
                <option value="technical">Technical Interview</option>
                <option value="panel">Panel Interview</option>
                <option value="final">Final Interview</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes) *</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  min="15"
                  step="15"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location Type *</label>
              <select
                value={formData.location.type}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, type: e.target.value }
                })}
                required
              >
                <option value="online">Online</option>
                <option value="office">Office</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            {formData.location.type === 'online' && (
              <div className="form-group">
                <label>Meeting Link</label>
                <input
                  type="url"
                  placeholder="https://zoom.us/..."
                  value={formData.location.meetingLink}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, meetingLink: e.target.value }
                  })}
                />
              </div>
            )}

            {formData.location.type === 'office' && (
              <div className="form-group">
                <label>Office Address</label>
                <input
                  type="text"
                  placeholder="Enter office address"
                  value={formData.location.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })}
                />
              </div>
            )}

            <div className="form-group">
              <label>Notes</label>
              <textarea
                rows="4"
                placeholder="Any additional notes or instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Schedule Interview</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;

