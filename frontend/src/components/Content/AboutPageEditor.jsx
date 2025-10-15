import React from 'react';
import RichTextEditor from './RichTextEditor';
import MediaUploader from './MediaUploader';
import './PageEditor.css';

const AboutPageEditor = ({ content, onChange, language, uploadMedia }) => {
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
      {/* Company Overview Section */}
      <section className="editor-section">
        <h2 className="section-heading">Company Overview</h2>
        
        <div className="form-group">
          <label>Page Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('overview', 'title')}
            onChange={(e) => handleFieldChange('overview', 'title', e.target.value)}
            placeholder="About Us"
          />
        </div>

        <div className="form-group">
          <label>Company Introduction</label>
          <RichTextEditor
            value={getFieldValue('overview', 'introduction')}
            onChange={(value) => handleFieldChange('overview', 'introduction', value, 'html')}
            minHeight="200px"
            toolbar="full"
          />
        </div>

        <div className="form-group">
          <label>Mission Statement</label>
          <RichTextEditor
            value={getFieldValue('overview', 'mission')}
            onChange={(value) => handleFieldChange('overview', 'mission', value, 'html')}
            minHeight="150px"
            toolbar="basic"
          />
        </div>

        <div className="form-group">
          <label>Vision Statement</label>
          <RichTextEditor
            value={getFieldValue('overview', 'vision')}
            onChange={(value) => handleFieldChange('overview', 'vision', value, 'html')}
            minHeight="150px"
            toolbar="basic"
          />
        </div>

        <div className="form-group">
          <label>Company Image</label>
          <MediaUploader
            currentFile={getFieldValue('overview', 'image')}
            onUpload={async (file) => {
              const result = await uploadMedia(file, 'about');
              handleFieldChange('overview', 'image', result.url, 'image');
              return result;
            }}
            acceptedTypes="image/*"
          />
        </div>
      </section>

      {/* Core Values Section */}
      <section className="editor-section">
        <h2 className="section-heading">Core Values</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('values', 'title')}
            onChange={(e) => handleFieldChange('values', 'title', e.target.value)}
            placeholder="Our Core Values"
          />
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Core values are managed as a list. Each value should include:
            a title, description, and icon. Use the JSON editor for advanced configuration.
          </p>
        </div>

        <div className="form-group">
          <label>Values Description</label>
          <RichTextEditor
            value={getFieldValue('values', 'description')}
            onChange={(value) => handleFieldChange('values', 'description', value, 'html')}
            minHeight="120px"
            toolbar="basic"
          />
        </div>
      </section>

      {/* Company History Section */}
      <section className="editor-section">
        <h2 className="section-heading">Company History</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('history', 'title')}
            onChange={(e) => handleFieldChange('history', 'title', e.target.value)}
            placeholder="Our Journey"
          />
        </div>

        <div className="form-group">
          <label>History Description</label>
          <RichTextEditor
            value={getFieldValue('history', 'description')}
            onChange={(value) => handleFieldChange('history', 'description', value, 'html')}
            minHeight="150px"
            toolbar="basic"
          />
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Timeline entries are managed separately. This section controls 
            the introduction to your company's history.
          </p>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="editor-section">
        <h2 className="section-heading">Leadership Team</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('team', 'title')}
            onChange={(e) => handleFieldChange('team', 'title', e.target.value)}
            placeholder="Meet Our Leadership Team"
          />
        </div>

        <div className="form-group">
          <label>Team Description</label>
          <RichTextEditor
            value={getFieldValue('team', 'description')}
            onChange={(value) => handleFieldChange('team', 'description', value, 'html')}
            minHeight="120px"
            toolbar="basic"
          />
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Individual team member profiles are managed through the 
            Team Management section. This controls the section introduction.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="editor-section">
        <h2 className="section-heading">Why Choose Us</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('why_us', 'title')}
            onChange={(e) => handleFieldChange('why_us', 'title', e.target.value)}
            placeholder="Why Choose Us"
          />
        </div>

        <div className="form-group">
          <label>Introduction</label>
          <RichTextEditor
            value={getFieldValue('why_us', 'introduction')}
            onChange={(value) => handleFieldChange('why_us', 'introduction', value, 'html')}
            minHeight="120px"
            toolbar="basic"
          />
        </div>

        <div className="form-group">
          <label>Background Image</label>
          <MediaUploader
            currentFile={getFieldValue('why_us', 'background_image')}
            onUpload={async (file) => {
              const result = await uploadMedia(file, 'about');
              handleFieldChange('why_us', 'background_image', result.url, 'image');
              return result;
            }}
            acceptedTypes="image/*"
          />
        </div>
      </section>

      {/* Certifications Section */}
      <section className="editor-section">
        <h2 className="section-heading">Certifications & Awards</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('certifications', 'title')}
            onChange={(e) => handleFieldChange('certifications', 'title', e.target.value)}
            placeholder="Certifications & Awards"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <RichTextEditor
            value={getFieldValue('certifications', 'description')}
            onChange={(value) => handleFieldChange('certifications', 'description', value, 'html')}
            minHeight="120px"
            toolbar="basic"
          />
        </div>
      </section>
    </div>
  );
};

export default AboutPageEditor;
