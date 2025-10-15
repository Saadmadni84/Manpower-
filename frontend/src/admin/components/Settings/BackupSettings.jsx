import React, { useState, useEffect } from 'react';
import useSettings from '../../../hooks/useSettings';
import './Settings.css';

const BackupSettings = () => {
  const { 
    settings, 
    loading, 
    saving, 
    fetchSettings, 
    updateSettings,
    createBackup,
    getBackupHistory
  } = useSettings('backup');
  
  const [formData, setFormData] = useState({
    enable_auto_backup: true,
    backup_frequency: 'daily',
    backup_retention_days: 30,
    include_uploads: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [backupHistory, setBackupHistory] = useState([]);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchSettings('backup');
    loadBackupHistory();
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

  const loadBackupHistory = async () => {
    setLoadingHistory(true);
    const result = await getBackupHistory();
    if (result.success) {
      setBackupHistory(result.data || []);
    }
    setLoadingHistory(false);
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

    const result = await updateSettings('backup', settingsArray);

    if (result.success) {
      setMessage({ type: 'success', text: 'Backup settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
  };

  const handleCreateBackup = async () => {
    if (!window.confirm('Create a backup now? This may take a few minutes.')) {
      return;
    }

    setCreatingBackup(true);
    setMessage({ type: 'info', text: 'Creating backup... Please wait.' });

    const result = await createBackup();

    setCreatingBackup(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Backup created successfully!' });
      loadBackupHistory();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create backup' });
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading backup settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-header">
        <h2>Backup & Maintenance Settings</h2>
        <p className="settings-description">
          Configure automated backups and system maintenance
        </p>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Automated Backups */}
        <div className="settings-group">
          <h3>🔄 Automated Backups</h3>
          
          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="enable_auto_backup"
                checked={formData.enable_auto_backup}
                onChange={handleChange}
              />
              <span>Enable Automated Backups</span>
            </label>
            <small>Automatically create backups on a schedule</small>
          </div>

          {formData.enable_auto_backup && (
            <>
              <div className="form-field">
                <label htmlFor="backup_frequency">Backup Frequency</label>
                <select
                  id="backup_frequency"
                  name="backup_frequency"
                  value={formData.backup_frequency}
                  onChange={handleChange}
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="backup_retention_days">
                  Backup Retention Period (Days)
                </label>
                <input
                  type="number"
                  id="backup_retention_days"
                  name="backup_retention_days"
                  value={formData.backup_retention_days}
                  onChange={handleChange}
                  min="7"
                  max="365"
                  required
                />
                <small>Older backups will be automatically deleted</small>
              </div>

              <div className="form-field checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    name="include_uploads"
                    checked={formData.include_uploads}
                    onChange={handleChange}
                  />
                  <span>Include File Uploads in Backup</span>
                </label>
                <small>⚠️ Including uploads will increase backup size significantly</small>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            type="button"
            onClick={() => fetchSettings('backup')}
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
            {saving ? 'Saving...' : 'Save Backup Settings'}
          </button>
        </div>
      </form>

      {/* Manual Backup Section */}
      <div className="settings-group">
        <h3>📦 Manual Backup</h3>
        <p className="help-text">
          Create a manual backup of your database and files right now.
        </p>
        
        <button
          type="button"
          className="btn-primary"
          onClick={handleCreateBackup}
          disabled={creatingBackup}
        >
          {creatingBackup ? (
            <>
              <div className="spinner-small"></div>
              Creating Backup...
            </>
          ) : (
            <>
              <i className="fas fa-download"></i>
              Create Backup Now
            </>
          )}
        </button>
      </div>

      {/* Backup History */}
      <div className="settings-group">
        <div className="group-header">
          <h3>📜 Backup History</h3>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={loadBackupHistory}
            disabled={loadingHistory}
          >
            {loadingHistory ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {backupHistory.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-archive"></i>
            <p>No backups found</p>
          </div>
        ) : (
          <div className="settings-table">
            <table>
              <thead>
                <tr>
                  <th>Backup Name</th>
                  <th>Date & Time</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {backupHistory.map((backup, index) => (
                  <tr key={index}>
                    <td>
                      <code>{backup.name}</code>
                    </td>
                    <td>
                      {new Date(backup.date).toLocaleString()}
                    </td>
                    <td>{backup.sizeMB} MB</td>
                    <td>
                      <span className="badge badge-info">Manual</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-download"
                          title="Download"
                          onClick={() => alert('Download functionality coming soon')}
                        >
                          <i className="fas fa-download"></i>
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          title="Delete"
                          onClick={() => alert('Delete functionality coming soon')}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Backup Information */}
      <div className="settings-help">
        <h4>ℹ️ Backup Information</h4>
        <div className="help-content">
          <ul>
            <li><strong>Database:</strong> All database collections are backed up</li>
            <li><strong>Uploads:</strong> Optional - includes all uploaded files (CVs, images, documents)</li>
            <li><strong>Location:</strong> Backups are stored in: <code>/backend/admin/backups</code></li>
            <li><strong>Retention:</strong> Old backups are automatically deleted based on retention settings</li>
            <li><strong>Restoration:</strong> Contact system administrator for backup restoration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;
