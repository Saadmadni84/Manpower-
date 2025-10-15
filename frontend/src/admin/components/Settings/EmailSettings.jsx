import React, { useState, useEffect } from 'react';
import useSettings from '../../../hooks/useSettings';
import './Settings.css';

const EmailSettings = () => {
  const { settings, loading, saving, fetchSettings, updateSettings, testEmail } = useSettings('email');
  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    encryption_type: 'TLS',
    from_name: 'Manpower Company',
    from_email: '',
    enable_notifications: true,
    notify_new_inquiry: true,
    notify_new_application: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchSettings('email');
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
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const settingsArray = Object.keys(formData).map(key => ({
      key,
      value: formData[key],
      dataType: typeof formData[key] === 'number' ? 'number' : 
                typeof formData[key] === 'boolean' ? 'boolean' : 'string',
      isEncrypted: key === 'smtp_password'
    }));

    const result = await updateSettings('email', settingsArray);

    if (result.success) {
      setMessage({ type: 'success', text: 'Email settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailAddress) {
      setMessage({ type: 'error', text: 'Please enter an email address for testing' });
      return;
    }

    setTesting(true);
    setMessage({ type: '', text: '' });

    const result = await testEmail(testEmailAddress);

    setTesting(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Test email sent successfully! Check your inbox.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to send test email' });
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading email settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-header">
        <h2>Email & Notifications Settings</h2>
        <p className="settings-description">
          Configure SMTP settings and email notifications
        </p>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* SMTP Configuration */}
        <div className="settings-group">
          <h3>SMTP Configuration</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="smtp_host">SMTP Server Host *</label>
              <input
                type="text"
                id="smtp_host"
                name="smtp_host"
                value={formData.smtp_host}
                onChange={handleChange}
                required
                placeholder="smtp.gmail.com"
              />
              <small>Your SMTP server address (e.g., smtp.gmail.com, smtp-mail.outlook.com)</small>
            </div>

            <div className="form-field">
              <label htmlFor="smtp_port">SMTP Port *</label>
              <input
                type="number"
                id="smtp_port"
                name="smtp_port"
                value={formData.smtp_port}
                onChange={handleChange}
                required
              />
              <small>Common ports: 25, 465 (SSL), 587 (TLS)</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="smtp_username">SMTP Username *</label>
              <input
                type="text"
                id="smtp_username"
                name="smtp_username"
                value={formData.smtp_username}
                onChange={handleChange}
                required
                placeholder="your-email@gmail.com"
              />
            </div>

            <div className="form-field">
              <label htmlFor="smtp_password">SMTP Password *</label>
              <input
                type="password"
                id="smtp_password"
                name="smtp_password"
                value={formData.smtp_password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <small>⚠️ This will be encrypted in the database</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="encryption_type">Encryption Type *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="encryption_type"
                    value="None"
                    checked={formData.encryption_type === 'None'}
                    onChange={handleChange}
                  />
                  <span>None</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="encryption_type"
                    value="SSL"
                    checked={formData.encryption_type === 'SSL'}
                    onChange={handleChange}
                  />
                  <span>SSL (Port 465)</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="encryption_type"
                    value="TLS"
                    checked={formData.encryption_type === 'TLS'}
                    onChange={handleChange}
                  />
                  <span>TLS (Port 587)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Email Sender Settings */}
        <div className="settings-group">
          <h3>Email Sender Information</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="from_name">From Name *</label>
              <input
                type="text"
                id="from_name"
                name="from_name"
                value={formData.from_name}
                onChange={handleChange}
                required
                placeholder="Manpower Company"
              />
              <small>The name that appears in recipient's inbox</small>
            </div>

            <div className="form-field">
              <label htmlFor="from_email">From Email Address *</label>
              <input
                type="email"
                id="from_email"
                name="from_email"
                value={formData.from_email}
                onChange={handleChange}
                required
                placeholder="noreply@company.com"
              />
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="settings-group">
          <h3>Notification Settings</h3>
          
          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="enable_notifications"
                checked={formData.enable_notifications}
                onChange={handleChange}
              />
              <span>Enable Email Notifications</span>
            </label>
            <small>Master switch for all email notifications</small>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="notify_new_inquiry"
                checked={formData.notify_new_inquiry}
                onChange={handleChange}
                disabled={!formData.enable_notifications}
              />
              <span>Notify on New Contact Inquiry</span>
            </label>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="notify_new_application"
                checked={formData.notify_new_application}
                onChange={handleChange}
                disabled={!formData.enable_notifications}
              />
              <span>Notify on New Job Application</span>
            </label>
          </div>
        </div>

        {/* Test Email Section */}
        <div className="settings-group">
          <h3>Test Email Configuration</h3>
          <p className="help-text">
            Send a test email to verify your SMTP configuration is working correctly.
          </p>
          
          <div className="test-email-section">
            <input
              type="email"
              placeholder="Enter test email address"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              className="test-email-input"
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={handleTestEmail}
              disabled={testing || !testEmailAddress}
            >
              {testing ? 'Sending...' : 'Send Test Email'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            type="button"
            onClick={() => fetchSettings('email')}
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
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Help Section */}
      <div className="settings-help">
        <h4>📧 Email Configuration Guide</h4>
        <div className="help-content">
          <div className="help-item">
            <strong>Gmail:</strong>
            <ul>
              <li>Host: smtp.gmail.com</li>
              <li>Port: 587 (TLS) or 465 (SSL)</li>
              <li>Enable "Less secure app access" or use App Password</li>
            </ul>
          </div>
          <div className="help-item">
            <strong>Outlook/Office 365:</strong>
            <ul>
              <li>Host: smtp-mail.outlook.com or smtp.office365.com</li>
              <li>Port: 587 (TLS)</li>
              <li>Use your full email address as username</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
