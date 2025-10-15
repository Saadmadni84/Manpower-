import React, { useState, useEffect } from 'react';
import useSettings from '../../../hooks/useSettings';
import './Settings.css';

const WebsiteSettings = () => {
  const { settings, loading, saving, fetchSettings, updateSettings } = useSettings('website');
  const [formData, setFormData] = useState({
    meta_title_en: 'Manpower Supply Company',
    meta_title_ar: 'شركة توريد العمالة',
    meta_description_en: '',
    meta_description_ar: '',
    meta_keywords_en: '',
    meta_keywords_ar: '',
    enable_contact_form: true,
    enable_recaptcha: false,
    enable_schema_markup: true,
    google_search_console_code: '',
    bing_webmaster_code: '',
    og_image_url: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings('website');
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

    const result = await updateSettings('website', settingsArray);

    if (result.success) {
      setMessage({ type: 'success', text: 'Website settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading website settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-header">
        <h2>Website Settings</h2>
        <p className="settings-description">
          Configure SEO, social media, and website features
        </p>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* SEO Configuration */}
        <div className="settings-group">
          <h3>🔍 SEO Configuration</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="meta_title_en">Default Meta Title (English) *</label>
              <input
                type="text"
                id="meta_title_en"
                name="meta_title_en"
                value={formData.meta_title_en}
                onChange={handleChange}
                required
                maxLength="60"
                placeholder="Company Name - Short Description"
              />
              <small>Character count: {formData.meta_title_en.length}/60 (Optimal: 50-60)</small>
            </div>

            <div className="form-field">
              <label htmlFor="meta_title_ar">Default Meta Title (Arabic) *</label>
              <input
                type="text"
                id="meta_title_ar"
                name="meta_title_ar"
                value={formData.meta_title_ar}
                onChange={handleChange}
                required
                maxLength="60"
                placeholder="اسم الشركة - وصف مختصر"
                dir="rtl"
              />
              <small>عدد الأحرف: {formData.meta_title_ar.length}/60</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="meta_description_en">Default Meta Description (English)</label>
              <textarea
                id="meta_description_en"
                name="meta_description_en"
                value={formData.meta_description_en}
                onChange={handleChange}
                rows="3"
                maxLength="160"
                placeholder="Brief description of your manpower company..."
              />
              <small>Character count: {formData.meta_description_en.length}/160 (Optimal: 120-160)</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="meta_description_ar">Default Meta Description (Arabic)</label>
              <textarea
                id="meta_description_ar"
                name="meta_description_ar"
                value={formData.meta_description_ar}
                onChange={handleChange}
                rows="3"
                maxLength="160"
                placeholder="وصف مختصر لشركة توريد العمالة..."
                dir="rtl"
              />
              <small>عدد الأحرف: {formData.meta_description_ar.length}/160</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="meta_keywords_en">Meta Keywords (English)</label>
              <input
                type="text"
                id="meta_keywords_en"
                name="meta_keywords_en"
                value={formData.meta_keywords_en}
                onChange={handleChange}
                placeholder="manpower, recruitment, staffing, jobs"
              />
              <small>Comma-separated keywords</small>
            </div>

            <div className="form-field">
              <label htmlFor="meta_keywords_ar">Meta Keywords (Arabic)</label>
              <input
                type="text"
                id="meta_keywords_ar"
                name="meta_keywords_ar"
                value={formData.meta_keywords_ar}
                onChange={handleChange}
                placeholder="توظيف، عمالة، وظائف"
                dir="rtl"
              />
              <small>كلمات مفتاحية مفصولة بفواصل</small>
            </div>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="enable_schema_markup"
                checked={formData.enable_schema_markup}
                onChange={handleChange}
              />
              <span>Enable Schema.org Structured Data</span>
            </label>
            <small>Helps search engines understand your content better</small>
          </div>
        </div>

        {/* Search Console Verification */}
        <div className="settings-group">
          <h3>🔎 Search Console Verification</h3>
          
          <div className="form-field">
            <label htmlFor="google_search_console_code">
              <i className="fab fa-google"></i> Google Search Console Verification Code
            </label>
            <textarea
              id="google_search_console_code"
              name="google_search_console_code"
              value={formData.google_search_console_code}
              onChange={handleChange}
              rows="3"
              placeholder='<meta name="google-site-verification" content="..." />'
            />
            <small>Paste the verification meta tag from Google Search Console</small>
          </div>

          <div className="form-field">
            <label htmlFor="bing_webmaster_code">
              <i className="fab fa-microsoft"></i> Bing Webmaster Verification Code
            </label>
            <textarea
              id="bing_webmaster_code"
              name="bing_webmaster_code"
              value={formData.bing_webmaster_code}
              onChange={handleChange}
              rows="3"
              placeholder='<meta name="msvalidate.01" content="..." />'
            />
            <small>Paste the verification meta tag from Bing Webmaster Tools</small>
          </div>
        </div>

        {/* Social Media Integration */}
        <div className="settings-group">
          <h3>📱 Social Media Integration</h3>
          
          <div className="form-field">
            <label htmlFor="og_image_url">Open Graph Default Image URL</label>
            <input
              type="url"
              id="og_image_url"
              name="og_image_url"
              value={formData.og_image_url}
              onChange={handleChange}
              placeholder="https://yoursite.com/images/og-image.jpg"
            />
            <small>Default image when sharing on social media (1200x630px recommended)</small>
          </div>

          <div className="og-image-preview">
            {formData.og_image_url && (
              <div className="preview-card">
                <h5>Preview:</h5>
                <img src={formData.og_image_url} alt="OG Preview" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
        </div>

        {/* Contact Form Settings */}
        <div className="settings-group">
          <h3>📧 Contact Form Settings</h3>
          
          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="enable_contact_form"
                checked={formData.enable_contact_form}
                onChange={handleChange}
              />
              <span>Enable Contact Form</span>
            </label>
            <small>Allow visitors to send inquiries through the contact form</small>
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="enable_recaptcha"
                checked={formData.enable_recaptcha}
                onChange={handleChange}
              />
              <span>Enable reCAPTCHA Spam Protection</span>
            </label>
            <small>Protect contact form from spam submissions</small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            type="button"
            onClick={() => fetchSettings('website')}
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
            {saving ? 'Saving...' : 'Save Website Settings'}
          </button>
        </div>
      </form>

      {/* SEO Tips */}
      <div className="settings-help">
        <h4>💡 SEO Best Practices</h4>
        <div className="help-content">
          <div className="seo-tips">
            <div className="tip-item">
              <strong>Title Tags:</strong>
              <ul>
                <li>Keep between 50-60 characters</li>
                <li>Include primary keywords</li>
                <li>Make it compelling and unique</li>
              </ul>
            </div>

            <div className="tip-item">
              <strong>Meta Descriptions:</strong>
              <ul>
                <li>Optimal length: 120-160 characters</li>
                <li>Include call-to-action</li>
                <li>Accurately describe page content</li>
              </ul>
            </div>

            <div className="tip-item">
              <strong>Open Graph Images:</strong>
              <ul>
                <li>Recommended size: 1200x630 pixels</li>
                <li>Format: JPG or PNG</li>
                <li>Keep file size under 1MB</li>
              </ul>
            </div>

            <div className="tip-item">
              <strong>Keywords:</strong>
              <ul>
                <li>Focus on relevant, specific terms</li>
                <li>Don't overuse (keyword stuffing)</li>
                <li>Research competitor keywords</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteSettings;
