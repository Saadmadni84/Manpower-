import React, { useState, useEffect } from 'react';
import useSettings from '../../../hooks/useSettings';
import './Settings.css';

const SystemSettings = () => {
  const { 
    settings, 
    loading, 
    saving, 
    fetchSettings, 
    updateSettings,
    getSystemInfo 
  } = useSettings('system');
  
  const [formData, setFormData] = useState({
    cache_duration_minutes: 60,
    max_file_size_mb: 10,
    enable_image_compression: true,
    compression_quality: 80,
    api_rate_limit: 100,
    maintenance_mode: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [systemInfo, setSystemInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  useEffect(() => {
    fetchSettings('system');
    loadSystemInfo();
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

  const loadSystemInfo = async () => {
    setLoadingInfo(true);
    const result = await getSystemInfo();
    if (result.success) {
      setSystemInfo(result.data);
    }
    setLoadingInfo(false);
  };

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

    const result = await updateSettings('system', settingsArray);

    if (result.success) {
      setMessage({ type: 'success', text: 'System settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-header">
        <h2>System Configuration</h2>
        <p className="settings-description">
          Configure system performance, file storage, and maintenance settings
        </p>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Performance Settings */}
        <div className="settings-group">
          <h3>⚡ Performance Settings</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="cache_duration_minutes">
                Cache Duration (Minutes)
              </label>
              <input
                type="number"
                id="cache_duration_minutes"
                name="cache_duration_minutes"
                value={formData.cache_duration_minutes}
                onChange={handleChange}
                min="0"
                max="1440"
                required
              />
              <small>How long to cache data (0 = disabled)</small>
            </div>

            <div className="form-field">
              <label htmlFor="api_rate_limit">
                API Rate Limit (Requests/Min)
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
              <small>Maximum API requests per minute per user</small>
            </div>
          </div>
        </div>

        {/* File Storage Settings */}
        <div className="settings-group">
          <h3>📁 File Storage Settings</h3>
          
          <div className="form-field">
            <label htmlFor="max_file_size_mb">
              Maximum File Upload Size (MB)
            </label>
            <input
              type="number"
              id="max_file_size_mb"
              name="max_file_size_mb"
              value={formData.max_file_size_mb}
              onChange={handleChange}
              min="1"
              max="100"
              required
            />
            <small>Maximum size for uploaded files</small>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="enable_image_compression"
                checked={formData.enable_image_compression}
                onChange={handleChange}
              />
              <span>Enable Automatic Image Compression</span>
            </label>
          </div>

          {formData.enable_image_compression && (
            <div className="form-field">
              <label htmlFor="compression_quality">
                Compression Quality: {formData.compression_quality}%
              </label>
              <input
                type="range"
                id="compression_quality"
                name="compression_quality"
                value={formData.compression_quality}
                onChange={handleChange}
                min="50"
                max="100"
                step="5"
              />
              <div className="slider-labels">
                <span>Lower Quality (Smaller Size)</span>
                <span>Higher Quality (Larger Size)</span>
              </div>
            </div>
          )}
        </div>

        {/* Maintenance Mode */}
        <div className="settings-group">
          <h3>🔧 Maintenance Mode</h3>
          
          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="maintenance_mode"
                checked={formData.maintenance_mode}
                onChange={handleChange}
              />
              <span>Enable Maintenance Mode</span>
            </label>
            <small className="warning-text">
              ⚠️ When enabled, the public website will show a maintenance message.
              Admin panel will remain accessible.
            </small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            type="button"
            onClick={() => fetchSettings('system')}
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
            {saving ? 'Saving...' : 'Save System Settings'}
          </button>
        </div>
      </form>

      {/* System Information */}
      {systemInfo && (
        <div className="settings-group system-info-section">
          <h3>💻 System Information</h3>
          
          <div className="system-info-grid">
            <div className="info-card">
              <div className="info-icon">🖥️</div>
              <div className="info-content">
                <label>Server OS</label>
                <strong>{systemInfo.server?.platform}</strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">⚙️</div>
              <div className="info-content">
                <label>Node.js Version</label>
                <strong>{systemInfo.server?.nodeVersion}</strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">💾</div>
              <div className="info-content">
                <label>Total Memory</label>
                <strong>{formatBytes(systemInfo.memory?.total)}</strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📊</div>
              <div className="info-content">
                <label>Memory Used</label>
                <strong>{formatBytes(systemInfo.memory?.used)}</strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🗄️</div>
              <div className="info-content">
                <label>Database Status</label>
                <strong className={systemInfo.database?.connected ? 'text-success' : 'text-error'}>
                  {systemInfo.database?.connected ? 'Connected' : 'Disconnected'}
                </strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📈</div>
              <div className="info-content">
                <label>Server Uptime</label>
                <strong>{formatUptime(systemInfo.server?.uptime)}</strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📦</div>
              <div className="info-content">
                <label>Uploads Size</label>
                <strong>{systemInfo.storage?.uploadsSizeMB} MB</strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🔢</div>
              <div className="info-content">
                <label>CPU Cores</label>
                <strong>{systemInfo.cpu?.cores}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={loadSystemInfo}
            disabled={loadingInfo}
            style={{ marginTop: '20px' }}
          >
            {loadingInfo ? 'Refreshing...' : 'Refresh System Info'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
