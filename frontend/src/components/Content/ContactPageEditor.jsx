import React from 'react';
import RichTextEditor from './RichTextEditor';
import './PageEditor.css';

const ContactPageEditor = ({ content, onChange, language }) => {
  const getFieldValue = (section, key) => {
    if (!content[section]) return '';
    const item = content[section].find(i => i.contentKey === key);
    return item?.content?.[language] || item?.value || '';
  };

  const handleFieldChange = (section, key, value, type = 'text') => {
    onChange(section, key, { [language]: value }, type);
  };

  return (
    <div className="page-editor">
      {/* Page Header */}
      <section className="editor-section">
        <h2 className="section-heading">Page Header</h2>
        
        <div className="form-group">
          <label>Page Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('header', 'title')}
            onChange={(e) => handleFieldChange('header', 'title', e.target.value)}
            placeholder="Contact Us"
          />
        </div>

        <div className="form-group">
          <label>Page Description</label>
          <RichTextEditor
            value={getFieldValue('header', 'description')}
            onChange={(value) => handleFieldChange('header', 'description', value, 'html')}
            minHeight="120px"
            toolbar="basic"
          />
        </div>
      </section>

      {/* Head Office Information */}
      <section className="editor-section">
        <h2 className="section-heading">Head Office</h2>
        
        <div className="form-group">
          <label>Office Name</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('head_office', 'name')}
            onChange={(e) => handleFieldChange('head_office', 'name', e.target.value)}
            placeholder="Head Office"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            className="form-control"
            value={getFieldValue('head_office', 'address')}
            onChange={(e) => handleFieldChange('head_office', 'address', e.target.value)}
            rows={4}
            placeholder="Enter full address..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Main Phone</label>
            <input
              type="tel"
              className="form-control"
              value={getFieldValue('head_office', 'phone')}
              onChange={(e) => handleFieldChange('head_office', 'phone', e.target.value)}
              placeholder="+966 11 xxx xxxx"
            />
          </div>

          <div className="form-group">
            <label>Fax</label>
            <input
              type="tel"
              className="form-control"
              value={getFieldValue('head_office', 'fax')}
              onChange={(e) => handleFieldChange('head_office', 'fax', e.target.value)}
              placeholder="+966 11 xxx xxxx"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>General Email</label>
            <input
              type="email"
              className="form-control"
              value={getFieldValue('head_office', 'email_general')}
              onChange={(e) => handleFieldChange('head_office', 'email_general', e.target.value, 'email')}
              placeholder="info@company.com"
            />
          </div>

          <div className="form-group">
            <label>HR Email</label>
            <input
              type="email"
              className="form-control"
              value={getFieldValue('head_office', 'email_hr')}
              onChange={(e) => handleFieldChange('head_office', 'email_hr', e.target.value, 'email')}
              placeholder="hr@company.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Working Hours</label>
          <RichTextEditor
            value={getFieldValue('head_office', 'working_hours')}
            onChange={(value) => handleFieldChange('head_office', 'working_hours', value, 'html')}
            minHeight="100px"
            toolbar="minimal"
          />
        </div>

        <div className="form-group">
          <label>Google Maps Embed Code</label>
          <textarea
            className="form-control"
            value={getFieldValue('head_office', 'maps_embed')}
            onChange={(e) => handleFieldChange('head_office', 'maps_embed', e.target.value)}
            rows={4}
            placeholder="Paste Google Maps embed code here..."
          />
          <small className="form-hint">
            Get embed code from Google Maps → Share → Embed a map
          </small>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="editor-section">
        <h2 className="section-heading">Regional Offices</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('regional_offices', 'title')}
            onChange={(e) => handleFieldChange('regional_offices', 'title', e.target.value)}
            placeholder="Our Regional Offices"
          />
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Individual regional office details are managed through the 
            Locations Management section. This controls the section introduction.
          </p>
        </div>
      </section>

      {/* Contact Form Settings */}
      <section className="editor-section">
        <h2 className="section-heading">Contact Form</h2>
        
        <div className="form-group">
          <label>Form Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('contact_form', 'title')}
            onChange={(e) => handleFieldChange('contact_form', 'title', e.target.value)}
            placeholder="Send Us a Message"
          />
        </div>

        <div className="form-group">
          <label>Form Description</label>
          <RichTextEditor
            value={getFieldValue('contact_form', 'description')}
            onChange={(value) => handleFieldChange('contact_form', 'description', value, 'html')}
            minHeight="100px"
            toolbar="minimal"
          />
        </div>

        <div className="form-group">
          <label>Success Message</label>
          <textarea
            className="form-control"
            value={getFieldValue('contact_form', 'success_message')}
            onChange={(e) => handleFieldChange('contact_form', 'success_message', e.target.value)}
            rows={3}
            placeholder="Thank you for contacting us! We'll get back to you soon."
          />
        </div>

        <div className="form-group">
          <label>Error Message</label>
          <textarea
            className="form-control"
            value={getFieldValue('contact_form', 'error_message')}
            onChange={(e) => handleFieldChange('contact_form', 'error_message', e.target.value)}
            rows={2}
            placeholder="Something went wrong. Please try again."
          />
        </div>
      </section>

      {/* Social Media */}
      <section className="editor-section">
        <h2 className="section-heading">Social Media</h2>
        
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input
            type="url"
            className="form-control"
            value={getFieldValue('social', 'linkedin')}
            onChange={(e) => handleFieldChange('social', 'linkedin', e.target.value, 'url')}
            placeholder="https://linkedin.com/company/..."
          />
        </div>

        <div className="form-group">
          <label>Twitter URL</label>
          <input
            type="url"
            className="form-control"
            value={getFieldValue('social', 'twitter')}
            onChange={(e) => handleFieldChange('social', 'twitter', e.target.value, 'url')}
            placeholder="https://twitter.com/..."
          />
        </div>

        <div className="form-group">
          <label>Facebook URL</label>
          <input
            type="url"
            className="form-control"
            value={getFieldValue('social', 'facebook')}
            onChange={(e) => handleFieldChange('social', 'facebook', e.target.value, 'url')}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="form-group">
          <label>Instagram URL</label>
          <input
            type="url"
            className="form-control"
            value={getFieldValue('social', 'instagram')}
            onChange={(e) => handleFieldChange('social', 'instagram', e.target.value, 'url')}
            placeholder="https://instagram.com/..."
          />
        </div>
      </section>
    </div>
  );
};

export default ContactPageEditor;
