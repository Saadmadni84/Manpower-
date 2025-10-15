import React from 'react';
import RichTextEditor from './RichTextEditor';
import MediaUploader from './MediaUploader';
import { FiPlus, FiTrash2, FiMove } from 'react-icons/fi';
import './PageEditor.css';

const HomePageEditor = ({ content, onChange, language, uploadMedia }) => {
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
      {/* Hero Section */}
      <section className="editor-section">
        <h2 className="section-heading">Hero Section</h2>
        
        <div className="form-group">
          <label>Hero Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('hero', 'title')}
            onChange={(e) => handleFieldChange('hero', 'title', e.target.value)}
            maxLength={60}
            placeholder="Enter hero title..."
          />
          <small className="form-hint">Maximum 60 characters</small>
        </div>

        <div className="form-group">
          <label>Hero Subtitle</label>
          <textarea
            className="form-control"
            value={getFieldValue('hero', 'subtitle')}
            onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)}
            maxLength={150}
            rows={3}
            placeholder="Enter hero subtitle..."
          />
          <small className="form-hint">Maximum 150 characters</small>
        </div>

        <div className="form-group">
          <label>Hero Description</label>
          <RichTextEditor
            value={getFieldValue('hero', 'description')}
            onChange={(value) => handleFieldChange('hero', 'description', value, 'html')}
            maxLength={300}
            minHeight="150px"
            toolbar="basic"
          />
        </div>

        <div className="form-group">
          <label>Hero Background Image</label>
          <MediaUploader
            currentFile={getFieldValue('hero', 'background_image')}
            onUpload={async (file) => {
              const result = await uploadMedia(file, 'hero-images');
              handleFieldChange('hero', 'background_image', result.url, 'image');
              return result;
            }}
            acceptedTypes="image/*"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>CTA Button Text</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('hero', 'cta_text')}
              onChange={(e) => handleFieldChange('hero', 'cta_text', e.target.value)}
              placeholder="e.g., Get Started"
            />
          </div>

          <div className="form-group">
            <label>CTA Button Link</label>
            <input
              type="url"
              className="form-control"
              value={getFieldValue('hero', 'cta_link')}
              onChange={(e) => handleFieldChange('hero', 'cta_link', e.target.value, 'url')}
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      {/* Company Statistics Section */}
      <section className="editor-section">
        <h2 className="section-heading">Company Statistics</h2>
        
        <div className="stats-grid">
          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              className="form-control"
              value={getFieldValue('statistics', 'years_experience')}
              onChange={(e) => handleFieldChange('statistics', 'years_experience', e.target.value, 'number')}
              placeholder="25"
            />
          </div>

          <div className="form-group">
            <label>Total Employees</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('statistics', 'total_employees')}
              onChange={(e) => handleFieldChange('statistics', 'total_employees', e.target.value)}
              placeholder="10,000+"
            />
          </div>

          <div className="form-group">
            <label>Number of Regions</label>
            <input
              type="number"
              className="form-control"
              value={getFieldValue('statistics', 'regions')}
              onChange={(e) => handleFieldChange('statistics', 'regions', e.target.value, 'number')}
              placeholder="4"
            />
          </div>

          <div className="form-group">
            <label>Total Clients Served</label>
            <input
              type="number"
              className="form-control"
              value={getFieldValue('statistics', 'clients_served')}
              onChange={(e) => handleFieldChange('statistics', 'clients_served', e.target.value, 'number')}
              placeholder="500"
            />
          </div>

          <div className="form-group">
            <label>Completed Projects</label>
            <input
              type="number"
              className="form-control"
              value={getFieldValue('statistics', 'completed_projects')}
              onChange={(e) => handleFieldChange('statistics', 'completed_projects', e.target.value, 'number')}
              placeholder="1000"
            />
          </div>

          <div className="form-group">
            <label>Success Rate (%)</label>
            <input
              type="number"
              className="form-control"
              value={getFieldValue('statistics', 'success_rate')}
              onChange={(e) => handleFieldChange('statistics', 'success_rate', e.target.value, 'number')}
              min="0"
              max="100"
              placeholder="95"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Statistics Background Image</label>
          <MediaUploader
            currentFile={getFieldValue('statistics', 'background_image')}
            onUpload={async (file) => {
              const result = await uploadMedia(file, 'statistics');
              handleFieldChange('statistics', 'background_image', result.url, 'image');
              return result;
            }}
            acceptedTypes="image/*"
          />
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="editor-section">
        <h2 className="section-heading">Services Preview</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('services_preview', 'title')}
            onChange={(e) => handleFieldChange('services_preview', 'title', e.target.value)}
            placeholder="Our Services"
          />
        </div>

        <div className="form-group">
          <label>Section Description</label>
          <RichTextEditor
            value={getFieldValue('services_preview', 'description')}
            onChange={(value) => handleFieldChange('services_preview', 'description', value, 'html')}
            maxLength={500}
            minHeight="120px"
            toolbar="basic"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Services Per Row</label>
            <select
              className="form-control"
              value={getFieldValue('services_preview', 'per_row')}
              onChange={(e) => handleFieldChange('services_preview', 'per_row', e.target.value, 'number')}
            >
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={getFieldValue('services_preview', 'show_view_all') === 'true'}
                onChange={(e) => handleFieldChange('services_preview', 'show_view_all', String(e.target.checked))}
              />
              <span>Show "View All" Button</span>
            </label>
          </div>
        </div>

        {getFieldValue('services_preview', 'show_view_all') === 'true' && (
          <div className="form-group">
            <label>View All Button Text</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('services_preview', 'view_all_text')}
              onChange={(e) => handleFieldChange('services_preview', 'view_all_text', e.target.value)}
              placeholder="View All Services"
            />
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="editor-section">
        <h2 className="section-heading">Testimonials</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('testimonials', 'title')}
            onChange={(e) => handleFieldChange('testimonials', 'title', e.target.value)}
            placeholder="What Our Clients Say"
          />
        </div>

        <div className="form-group">
          <label>Display Format</label>
          <select
            className="form-control"
            value={getFieldValue('testimonials', 'display_format')}
            onChange={(e) => handleFieldChange('testimonials', 'display_format', e.target.value)}
          >
            <option value="slider">Slider</option>
            <option value="grid">Grid</option>
            <option value="single">Single</option>
          </select>
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Individual testimonials are managed through the Testimonials 
            management section. This section controls how they are displayed on the home page.
          </p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="editor-section">
        <h2 className="section-heading">Call-to-Action</h2>
        
        <div className="form-group">
          <label>CTA Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('cta', 'title')}
            onChange={(e) => handleFieldChange('cta', 'title', e.target.value)}
            placeholder="Ready to Get Started?"
          />
        </div>

        <div className="form-group">
          <label>CTA Description</label>
          <textarea
            className="form-control"
            value={getFieldValue('cta', 'description')}
            onChange={(e) => handleFieldChange('cta', 'description', e.target.value)}
            rows={3}
            placeholder="Join thousands of satisfied clients..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Primary Button Text</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('cta', 'primary_button_text')}
              onChange={(e) => handleFieldChange('cta', 'primary_button_text', e.target.value)}
              placeholder="Contact Us"
            />
          </div>

          <div className="form-group">
            <label>Primary Button Link</label>
            <input
              type="url"
              className="form-control"
              value={getFieldValue('cta', 'primary_button_link')}
              onChange={(e) => handleFieldChange('cta', 'primary_button_link', e.target.value, 'url')}
              placeholder="/contact"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Background Image</label>
          <MediaUploader
            currentFile={getFieldValue('cta', 'background_image')}
            onUpload={async (file) => {
              const result = await uploadMedia(file, 'cta');
              handleFieldChange('cta', 'background_image', result.url, 'image');
              return result;
            }}
            acceptedTypes="image/*"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePageEditor;
