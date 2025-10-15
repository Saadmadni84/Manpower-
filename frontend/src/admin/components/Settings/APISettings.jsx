import React, { useState, useEffect } from 'react';
import useSettings from '../../../hooks/useSettings';
import './Settings.css';

const APISettings = () => {
  const { settings, loading, saving, fetchSettings, updateSettings } = useSettings('api');
  const [formData, setFormData] = useState({
    enable_public_api: false,
    api_rate_limit: 60,
    google_analytics_id: '',
    google_tag_manager_id: '',
    facebook_pixel_id: '',
    recaptcha_site_key: '',
    recaptcha_secret_key: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    fetchSettings('api');
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
                typeof formData[key] === 'boolean' ? 'boolean' : 'string',
      isEncrypted: key.includes('secret') || key.includes('key')
    }));

    const result = await updateSettings('api', settingsArray);

    if (result.success) {
      setMessage({ type: 'success', text: 'API settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleGenerateKey = () => {
    const newKey = {
      id: Date.now(),
      key: generateApiKey(),
      name: `API Key ${apiKeys.length + 1}`,
      created: new Date().toISOString(),
      status: 'active'
    };
    setApiKeys([...apiKeys, newKey]);
    setMessage({ type: 'success', text: 'New API key generated!' });
  };

  const handleRevokeKey = (keyId) => {
    if (window.confirm('Are you sure you want to revoke this API key?')) {
      setApiKeys(apiKeys.filter(k => k.id !== keyId));
      setMessage({ type: 'success', text: 'API key revoked successfully' });
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading API settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-header">
        <h2>API Configuration</h2>
        <p className="settings-description">
          Configure API access, integrations, and third-party services
        </p>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* API Access Settings */}
        <div className="settings-group">
          <h3>🔌 API Access</h3>
          
          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="enable_public_api"
                checked={formData.enable_public_api}
                onChange={handleChange}
              />
              <span>Enable Public API Access</span>
            </label>
            <small>Allow external applications to access your API endpoints</small>
          </div>

          {formData.enable_public_api && (
            <div className="form-field">
              <label htmlFor="api_rate_limit">
                API Rate Limit (Requests/Minute)
              </label>
              <input
                type="number"
                id="api_rate_limit"
                name="api_rate_limit"
                value={formData.api_rate_limit}
                onChange={handleChange}
                min="10"
                max="1000"
                required
              />
              <small>Maximum requests per minute per API key</small>
            </div>
          )}
        </div>

        {/* API Key Management */}
        {formData.enable_public_api && (
          <div className="settings-group">
            <div className="group-header">
              <h3>🔑 API Key Management</h3>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={handleGenerateKey}
              >
                <i className="fas fa-plus"></i> Generate New Key
              </button>
            </div>

            {apiKeys.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-key"></i>
                <p>No API keys generated yet</p>
                <small>Click "Generate New Key" to create your first API key</small>
              </div>
            ) : (
              <div className="api-keys-list">
                {apiKeys.map(key => (
                  <div key={key.id} className="api-key-item">
                    <div className="key-info">
                      <strong>{key.name}</strong>
                      <code className="api-key">{key.key}</code>
                      <small>Created: {new Date(key.created).toLocaleDateString()}</small>
                    </div>
                    <div className="key-actions">
                      <button
                        type="button"
                        className="btn-icon btn-copy"
                        onClick={() => {
                          navigator.clipboard.writeText(key.key);
                          setMessage({ type: 'success', text: 'API key copied to clipboard!' });
                        }}
                        title="Copy"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                      <button
                        type="button"
                        className="btn-icon btn-delete"
                        onClick={() => handleRevokeKey(key.id)}
                        title="Revoke"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Google Analytics & Tag Manager */}
        <div className="settings-group">
          <h3>📊 Google Analytics & Tag Manager</h3>
          
          <div className="form-field">
            <label htmlFor="google_analytics_id">
              <i className="fab fa-google"></i> Google Analytics ID
            </label>
            <input
              type="text"
              id="google_analytics_id"
              name="google_analytics_id"
              value={formData.google_analytics_id}
              onChange={handleChange}
              placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
            />
            <small>Your Google Analytics tracking ID</small>
          </div>

          <div className="form-field">
            <label htmlFor="google_tag_manager_id">
              <i className="fab fa-google"></i> Google Tag Manager ID
            </label>
            <input
              type="text"
              id="google_tag_manager_id"
              name="google_tag_manager_id"
              value={formData.google_tag_manager_id}
              onChange={handleChange}
              placeholder="GTM-XXXXXXX"
            />
            <small>Your Google Tag Manager container ID</small>
          </div>
        </div>

        {/* Social Media Pixels */}
        <div className="settings-group">
          <h3>📱 Social Media Tracking</h3>
          
          <div className="form-field">
            <label htmlFor="facebook_pixel_id">
              <i className="fab fa-facebook"></i> Facebook Pixel ID
            </label>
            <input
              type="text"
              id="facebook_pixel_id"
              name="facebook_pixel_id"
              value={formData.facebook_pixel_id}
              onChange={handleChange}
              placeholder="XXXXXXXXXXXXXXX"
            />
            <small>Your Facebook Pixel tracking ID</small>
          </div>
        </div>

        {/* reCAPTCHA Configuration */}
        <div className="settings-group">
          <h3>🤖 Google reCAPTCHA</h3>
          
          <div className="form-field">
            <label htmlFor="recaptcha_site_key">
              reCAPTCHA Site Key
            </label>
            <input
              type="text"
              id="recaptcha_site_key"
              name="recaptcha_site_key"
              value={formData.recaptcha_site_key}
              onChange={handleChange}
              placeholder="6Lc..."
            />
            <small>Public key for client-side validation</small>
          </div>

          <div className="form-field">
            <label htmlFor="recaptcha_secret_key">
              reCAPTCHA Secret Key
            </label>
            <input
              type="password"
              id="recaptcha_secret_key"
              name="recaptcha_secret_key"
              value={formData.recaptcha_secret_key}
              onChange={handleChange}
              placeholder="6Lc..."
            />
            <small>⚠️ Secret key for server-side validation (encrypted)</small>
          </div>

          <div className="help-text">
            Get your reCAPTCHA keys from: <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer">Google reCAPTCHA Admin</a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            type="button"
            onClick={() => fetchSettings('api')}
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
            {saving ? 'Saving...' : 'Save API Settings'}
          </button>
        </div>
      </form>

      {/* API Documentation Link */}
      <div className="settings-help">
        <h4>📖 API Documentation</h4>
        <div className="help-content">
          <p>
            For complete API documentation, endpoints, and usage examples, visit:
          </p>
          <a href="/api/docs" className="btn-secondary" target="_blank" rel="noopener noreferrer">
            <i className="fas fa-book"></i> View API Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default APISettings;
