import React, { useState, useEffect } from 'react';
import useSettings from '../../../hooks/useSettings';
import './Settings.css';

const SecuritySettings = () => {
  const { settings, loading, saving, fetchSettings, updateSettings } = useSettings('security');
  const [formData, setFormData] = useState({
    min_password_length: 8,
    require_uppercase: true,
    require_numbers: true,
    require_special_chars: true,
    password_expiry_days: 90,
    account_lockout_attempts: 5,
    lockout_duration_minutes: 30,
    session_timeout_minutes: 60,
    enable_2fa: false,
    log_login_attempts: true,
    log_admin_activities: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings('security');
  }, [fetchSettings]);

  useEffect(() => {
    if (settings && settings.length > 0) {
      const newFormData = { ...formData };
      settings.forEach(setting => {
        if (setting.key in newFormData) {
          newFormData[setting.key] = setting.value;
        }
      });
      setFormData(newFormData);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const settingsArray = Object.keys(formData).map(key => ({
      key,
      value: formData[key],
      dataType: typeof formData[key] === 'number' ? 'number' : 
                typeof formData[key] === 'boolean' ? 'boolean' : 'string'
    }));

    const result = await updateSettings('security', settingsArray);

    if (result.success) {
      setMessage({ type: 'success', text: 'Security settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading security settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-header">
        <h2>Security Settings</h2>
        <p className="settings-description">
          Configure password policies, session management, and security monitoring
        </p>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Password Policies */}
        <div className="settings-group">
          <h3>🔐 Password Policies</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="min_password_length">Minimum Password Length</label>
              <input
                type="number"
                id="min_password_length"
                name="min_password_length"
                value={formData.min_password_length}
                onChange={handleChange}
                min="6"
                max="20"
                required
              />
              <small>Recommended: 8 or more characters</small>
            </div>

            <div className="form-field">
              <label htmlFor="password_expiry_days">Password Expiry (Days)</label>
              <input
                type="number"
                id="password_expiry_days"
                name="password_expiry_days"
                value={formData.password_expiry_days}
                onChange={handleChange}
                min="0"
              />
              <small>0 = never expires</small>
            </div>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="require_uppercase"
                checked={formData.require_uppercase}
                onChange={handleChange}
              />
              <span>Require Uppercase Letters (A-Z)</span>
            </label>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="require_numbers"
                checked={formData.require_numbers}
                onChange={handleChange}
              />
              <span>Require Numbers (0-9)</span>
            </label>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="require_special_chars"
                checked={formData.require_special_chars}
                onChange={handleChange}
              />
              <span>Require Special Characters (!@#$%^&*)</span>
            </label>
          </div>
        </div>

        {/* Account Lockout Settings */}
        <div className="settings-group">
          <h3>🚫 Account Lockout Settings</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="account_lockout_attempts">
                Failed Login Attempts Before Lockout
              </label>
              <input
                type="number"
                id="account_lockout_attempts"
                name="account_lockout_attempts"
                value={formData.account_lockout_attempts}
                onChange={handleChange}
                min="3"
                max="10"
                required
              />
              <small>Number of failed attempts before account is locked</small>
            </div>

            <div className="form-field">
              <label htmlFor="lockout_duration_minutes">
                Lockout Duration (Minutes)
              </label>
              <input
                type="number"
                id="lockout_duration_minutes"
                name="lockout_duration_minutes"
                value={formData.lockout_duration_minutes}
                onChange={handleChange}
                min="5"
                max="120"
                required
              />
              <small>How long the account remains locked</small>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="settings-group">
          <h3>🔑 Two-Factor Authentication (2FA)</h3>
          
          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="enable_2fa"
                checked={formData.enable_2fa}
                onChange={handleChange}
              />
              <span>Enable Two-Factor Authentication for All Admins</span>
            </label>
            <small>⚠️ This feature is coming soon</small>
          </div>
        </div>

        {/* Session Management */}
        <div className="settings-group">
          <h3>⏱️ Session Management</h3>
          
          <div className="form-field">
            <label htmlFor="session_timeout_minutes">
              Session Timeout (Minutes)
            </label>
            <input
              type="number"
              id="session_timeout_minutes"
              name="session_timeout_minutes"
              value={formData.session_timeout_minutes}
              onChange={handleChange}
              min="15"
              max="480"
              required
            />
            <small>Automatically log out inactive users after this duration</small>
          </div>
        </div>

        {/* Security Monitoring */}
        <div className="settings-group">
          <h3>📊 Security Monitoring</h3>
          
          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="log_login_attempts"
                checked={formData.log_login_attempts}
                onChange={handleChange}
              />
              <span>Log All Login Attempts</span>
            </label>
            <small>Track successful and failed login attempts</small>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="log_admin_activities"
                checked={formData.log_admin_activities}
                onChange={handleChange}
              />
              <span>Log Admin Activities</span>
            </label>
            <small>Track all admin actions for audit trail</small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            type="button"
            onClick={() => fetchSettings('security')}
            className="btn-secondary"
            disabled={saving}
          >
            Reset Changes
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Security Settings'}
          </button>
        </div>
      </form>

      {/* Security Recommendations */}
      <div className="settings-help security-recommendations">
        <h4>🛡️ Security Best Practices</h4>
        <div className="recommendation-grid">
          <div className="recommendation-item">
            <i className="fas fa-check-circle"></i>
            <div>
              <strong>Strong Password Policy</strong>
              <p>Require at least 8 characters with mixed case, numbers, and special characters</p>
            </div>
          </div>
          <div className="recommendation-item">
            <i className="fas fa-check-circle"></i>
            <div>
              <strong>Account Lockout</strong>
              <p>Lock accounts after 5 failed login attempts for 30 minutes</p>
            </div>
          </div>
          <div className="recommendation-item">
            <i className="fas fa-check-circle"></i>
            <div>
              <strong>Session Timeout</strong>
              <p>Automatically logout after 60 minutes of inactivity</p>
            </div>
          </div>
          <div className="recommendation-item">
            <i className="fas fa-check-circle"></i>
            <div>
              <strong>Activity Logging</strong>
              <p>Enable all security logging for audit trails and compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
