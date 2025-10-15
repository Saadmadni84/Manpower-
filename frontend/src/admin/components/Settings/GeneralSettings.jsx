import React, { useState, useEffect } from 'react';
import useSettings from '../../../hooks/useSettings';
import './Settings.css';

const GeneralSettings = () => {
  const { settings, loading, saving, fetchSettings, updateSettings } = useSettings('general');
  const [formData, setFormData] = useState({
    company_name_en: '',
    company_name_ar: '',
    registration_number: '',
    tax_number: '',
    founded_year: new Date().getFullYear(),
    default_language: 'en',
    default_currency: 'SAR',
    date_format: 'DD/MM/YYYY',
    timezone: 'Asia/Riyadh',
    primary_phone: '',
    primary_email: '',
    support_email: '',
    sales_email: '',
    company_description_en: '',
    company_description_ar: '',
    physical_address_en: '',
    physical_address_ar: '',
    website_url: '',
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
    instagram_url: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings('general');
  }, [fetchSettings]);

  useEffect(() => {
    if (settings && settings.length > 0) {
      const newFormData = { ...formData };
      settings.forEach(setting => {
        if (setting.key in newFormData) {
          newFormData[setting.key] = setting.value || '';
        }
      });
      setFormData(newFormData);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Convert form data to settings array
    const settingsArray = Object.keys(formData).map(key => ({
      key,
      value: formData[key],
      dataType: typeof formData[key] === 'number' ? 'number' : 'string'
    }));

    const result = await updateSettings('general', settingsArray);

    if (result.success) {
      setMessage({ type: 'success', text: 'General settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all changes? This will reload the current saved settings.')) {
      fetchSettings('general');
      setMessage({ type: 'info', text: 'Form reset to saved values' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading general settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-header">
        <h2>General Settings</h2>
        <p className="settings-description">
          Configure basic company information and system defaults
        </p>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Company Information */}
        <div className="settings-group">
          <h3>Company Information</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="company_name_en">Company Name (English) *</label>
              <input
                type="text"
                id="company_name_en"
                name="company_name_en"
                value={formData.company_name_en}
                onChange={handleChange}
                required
                placeholder="Manpower Supply Company"
              />
            </div>

            <div className="form-field">
              <label htmlFor="company_name_ar">Company Name (Arabic) *</label>
              <input
                type="text"
                id="company_name_ar"
                name="company_name_ar"
                value={formData.company_name_ar}
                onChange={handleChange}
                required
                placeholder="شركة توريد العمالة"
                dir="rtl"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="registration_number">Company Registration Number</label>
              <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                placeholder="CR-123456789"
              />
            </div>

            <div className="form-field">
              <label htmlFor="tax_number">Tax Number / VAT ID</label>
              <input
                type="text"
                id="tax_number"
                name="tax_number"
                value={formData.tax_number}
                onChange={handleChange}
                placeholder="300000000000003"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="founded_year">Founded Year *</label>
              <input
                type="number"
                id="founded_year"
                name="founded_year"
                value={formData.founded_year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="website_url">Website URL</label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://www.company.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="company_description_en">Company Description (English)</label>
              <textarea
                id="company_description_en"
                name="company_description_en"
                value={formData.company_description_en}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description of your company..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="company_description_ar">Company Description (Arabic)</label>
              <textarea
                id="company_description_ar"
                name="company_description_ar"
                value={formData.company_description_ar}
                onChange={handleChange}
                rows="4"
                placeholder="وصف مختصر لشركتك..."
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* System Defaults */}
        <div className="settings-group">
          <h3>System Defaults</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="default_language">Default Language *</label>
              <select
                id="default_language"
                name="default_language"
                value={formData.default_language}
                onChange={handleChange}
                required
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="default_currency">Default Currency *</label>
              <select
                id="default_currency"
                name="default_currency"
                value={formData.default_currency}
                onChange={handleChange}
                required
              >
                <option value="SAR">SAR - Saudi Riyal</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="date_format">Date Format *</label>
              <select
                id="date_format"
                name="date_format"
                value={formData.date_format}
                onChange={handleChange}
                required
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="timezone">Time Zone *</label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                required
              >
                <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="settings-group">
          <h3>Contact Information</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="primary_phone">Primary Phone Number *</label>
              <input
                type="tel"
                id="primary_phone"
                name="primary_phone"
                value={formData.primary_phone}
                onChange={handleChange}
                required
                placeholder="+966 XX XXX XXXX"
              />
            </div>

            <div className="form-field">
              <label htmlFor="primary_email">Primary Email Address *</label>
              <input
                type="email"
                id="primary_email"
                name="primary_email"
                value={formData.primary_email}
                onChange={handleChange}
                required
                placeholder="info@company.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="support_email">Support Email</label>
              <input
                type="email"
                id="support_email"
                name="support_email"
                value={formData.support_email}
                onChange={handleChange}
                placeholder="support@company.com"
              />
            </div>

            <div className="form-field">
              <label htmlFor="sales_email">Sales Email</label>
              <input
                type="email"
                id="sales_email"
                name="sales_email"
                value={formData.sales_email}
                onChange={handleChange}
                placeholder="sales@company.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="physical_address_en">Physical Address (English)</label>
              <textarea
                id="physical_address_en"
                name="physical_address_en"
                value={formData.physical_address_en}
                onChange={handleChange}
                rows="3"
                placeholder="Street, City, State, Country"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="physical_address_ar">Physical Address (Arabic)</label>
              <textarea
                id="physical_address_ar"
                name="physical_address_ar"
                value={formData.physical_address_ar}
                onChange={handleChange}
                rows="3"
                placeholder="الشارع، المدينة، الولاية، الدولة"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="settings-group">
          <h3>Social Media Links</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="linkedin_url">
                <i className="fab fa-linkedin"></i> LinkedIn
              </label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="twitter_url">
                <i className="fab fa-twitter"></i> Twitter
              </label>
              <input
                type="url"
                id="twitter_url"
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="facebook_url">
                <i className="fab fa-facebook"></i> Facebook
              </label>
              <input
                type="url"
                id="facebook_url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="instagram_url">
                <i className="fab fa-instagram"></i> Instagram
              </label>
              <input
                type="url"
                id="instagram_url"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            type="button"
            onClick={handleReset}
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
    </div>
  );
};

export default GeneralSettings;
