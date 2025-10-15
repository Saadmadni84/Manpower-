import React, { useState, useEffect } from 'react';
import useSettings from '../../../hooks/useSettings';
import './Settings.css';

const LanguageSettings = () => {
  const { settings, loading, saving, fetchSettings, updateSettings } = useSettings('language');
  const [formData, setFormData] = useState({
    system_language: 'en',
    enable_rtl: true,
    auto_detect_language: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings('language');
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
      dataType: typeof formData[key] === 'boolean' ? 'boolean' : 'string'
    }));

    const result = await updateSettings('language', settingsArray);

    if (result.success) {
      setMessage({ type: 'success', text: 'Language settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading language settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-header">
        <h2>Language & Localization Settings</h2>
        <p className="settings-description">
          Configure language preferences and RTL support
        </p>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Default Language Settings */}
        <div className="settings-group">
          <h3>🌐 Default Language</h3>
          
          <div className="form-field">
            <label htmlFor="system_language">System Default Language</label>
            <select
              id="system_language"
              name="system_language"
              value={formData.system_language}
              onChange={handleChange}
              required
            >
              <option value="en">English</option>
              <option value="ar">Arabic (العربية)</option>
            </select>
            <small>Default language for admin panel and website</small>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="auto_detect_language"
                checked={formData.auto_detect_language}
                onChange={handleChange}
              />
              <span>Auto-Detect User Language</span>
            </label>
            <small>Automatically detect and use visitor's browser language</small>
          </div>
        </div>

        {/* RTL Support */}
        <div className="settings-group">
          <h3>↔️ RTL (Right-to-Left) Support</h3>
          
          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="enable_rtl"
                checked={formData.enable_rtl}
                onChange={handleChange}
              />
              <span>Enable Arabic RTL Support</span>
            </label>
            <small>Enable right-to-left layout for Arabic language</small>
          </div>

          {formData.enable_rtl && (
            <div className="rtl-preview">
              <h4>RTL Preview:</h4>
              <div className="preview-box" dir="rtl">
                <p style={{ textAlign: 'right' }}>هذا مثال على النص العربي في وضع RTL</p>
                <p style={{ textAlign: 'right' }}>This is how Arabic text appears in RTL mode</p>
              </div>
            </div>
          )}
        </div>

        {/* Translation Information */}
        <div className="settings-group">
          <h3>📝 Translation Status</h3>
          
          <div className="translation-status">
            <div className="status-item">
              <div className="status-header">
                <span className="language-flag">🇬🇧</span>
                <strong>English (EN)</strong>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%' }}></div>
              </div>
              <span className="status-label">100% Complete</span>
            </div>

            <div className="status-item">
              <div className="status-header">
                <span className="language-flag">🇸🇦</span>
                <strong>Arabic (AR)</strong>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%' }}></div>
              </div>
              <span className="status-label">100% Complete</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            type="button"
            onClick={() => fetchSettings('language')}
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
            {saving ? 'Saving...' : 'Save Language Settings'}
          </button>
        </div>
      </form>

      {/* Language Guide */}
      <div className="settings-help">
        <h4>🗣️ Language Configuration Guide</h4>
        <div className="help-content">
          <div className="guide-section">
            <h5>Supported Languages:</h5>
            <ul>
              <li><strong>English (EN):</strong> Fully supported, left-to-right (LTR) layout</li>
              <li><strong>Arabic (AR):</strong> Fully supported, right-to-left (RTL) layout</li>
            </ul>
          </div>

          <div className="guide-section">
            <h5>How It Works:</h5>
            <ul>
              <li>Content is stored in both English and Arabic in the database</li>
              <li>Users can switch languages using the language toggle</li>
              <li>Layout automatically adjusts for RTL when Arabic is selected</li>
              <li>Admin panel supports both languages seamlessly</li>
            </ul>
          </div>

          <div className="guide-section">
            <h5>Best Practices:</h5>
            <ul>
              <li>Always provide content in both languages for better user experience</li>
              <li>Test RTL layout thoroughly when adding new features</li>
              <li>Use browser's language detection for better localization</li>
              <li>Maintain consistent translations across all pages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
