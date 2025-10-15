import React from 'react';
import RichTextEditor from './RichTextEditor';
import MediaUploader from './MediaUploader';
import './PageEditor.css';

const ClientsPageEditor = ({ content, onChange, language, uploadMedia }) => {
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
        <h2 className="section-heading">Clients Page Header</h2>
        
        <div className="form-group">
          <label>Page Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('header', 'title')}
            onChange={(e) => handleFieldChange('header', 'title', e.target.value)}
            placeholder="Our Clients"
          />
        </div>

        <div className="form-group">
          <label>Page Description</label>
          <RichTextEditor
            value={getFieldValue('header', 'description')}
            onChange={(value) => handleFieldChange('header', 'description', value, 'html')}
            minHeight="150px"
            toolbar="basic"
          />
        </div>

        <div className="form-group">
          <label>Header Background Image</label>
          <MediaUploader
            currentFile={getFieldValue('header', 'background_image')}
            onUpload={async (file) => {
              const result = await uploadMedia(file, 'clients');
              handleFieldChange('header', 'background_image', result.url, 'image');
              return result;
            }}
            acceptedTypes="image/*"
          />
        </div>
      </section>

      {/* Client Display Settings */}
      <section className="editor-section">
        <h2 className="section-heading">Client Display Settings</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>Clients Per Row</label>
            <select
              className="form-control"
              value={getFieldValue('display', 'per_row')}
              onChange={(e) => handleFieldChange('display', 'per_row', e.target.value, 'number')}
            >
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>

          <div className="form-group">
            <label>Display Format</label>
            <select
              className="form-control"
              value={getFieldValue('display', 'format')}
              onChange={(e) => handleFieldChange('display', 'format', e.target.value)}
            >
              <option value="logo_grid">Logo Grid</option>
              <option value="logo_with_names">Logo with Names</option>
              <option value="cards">Cards</option>
            </select>
          </div>

          <div className="form-group">
            <label>Logo Size</label>
            <select
              className="form-control"
              value={getFieldValue('display', 'logo_size')}
              onChange={(e) => handleFieldChange('display', 'logo_size', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={getFieldValue('display', 'show_featured') === 'true'}
                onChange={(e) => handleFieldChange('display', 'show_featured', String(e.target.checked))}
              />
              <span>Show Featured Clients Section</span>
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={getFieldValue('display', 'show_all') === 'true'}
                onChange={(e) => handleFieldChange('display', 'show_all', String(e.target.checked))}
              />
              <span>Show All Clients Section</span>
            </label>
          </div>
        </div>
      </section>

      {/* Featured Clients Section */}
      <section className="editor-section">
        <h2 className="section-heading">Featured Clients</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('featured', 'title')}
            onChange={(e) => handleFieldChange('featured', 'title', e.target.value)}
            placeholder="Our Featured Clients"
          />
        </div>

        <div className="form-group">
          <label>Section Description</label>
          <RichTextEditor
            value={getFieldValue('featured', 'description')}
            onChange={(value) => handleFieldChange('featured', 'description', value, 'html')}
            minHeight="100px"
            toolbar="minimal"
          />
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Featured clients are marked in the Clients Management section. 
            This controls how the featured section is displayed.
          </p>
        </div>
      </section>

      {/* All Clients Section */}
      <section className="editor-section">
        <h2 className="section-heading">All Clients</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('all_clients', 'title')}
            onChange={(e) => handleFieldChange('all_clients', 'title', e.target.value)}
            placeholder="All Our Clients"
          />
        </div>

        <div className="form-group">
          <label>Section Description</label>
          <RichTextEditor
            value={getFieldValue('all_clients', 'description')}
            onChange={(value) => handleFieldChange('all_clients', 'description', value, 'html')}
            minHeight="100px"
            toolbar="minimal"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={getFieldValue('all_clients', 'show_categories') === 'true'}
              onChange={(e) => handleFieldChange('all_clients', 'show_categories', String(e.target.checked))}
            />
            <span>Show Category Filter</span>
          </label>
        </div>
      </section>

      {/* Client Categories */}
      <section className="editor-section">
        <h2 className="section-heading">Client Categories</h2>
        
        <div className="form-group">
          <label>Categories Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('categories', 'title')}
            onChange={(e) => handleFieldChange('categories', 'title', e.target.value)}
            placeholder="Clients by Industry"
          />
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Individual client categories are managed in the Clients Management section. 
            This controls the section display settings.
          </p>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="editor-section">
        <h2 className="section-heading">Client Testimonials</h2>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={getFieldValue('testimonials', 'enabled') === 'true'}
              onChange={(e) => handleFieldChange('testimonials', 'enabled', String(e.target.checked))}
            />
            <span>Show Client Testimonials on This Page</span>
          </label>
        </div>

        {getFieldValue('testimonials', 'enabled') === 'true' && (
          <>
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

            <div className="form-row">
              <div className="form-group">
                <label>Display Format</label>
                <select
                  className="form-control"
                  value={getFieldValue('testimonials', 'format')}
                  onChange={(e) => handleFieldChange('testimonials', 'format', e.target.value)}
                >
                  <option value="slider">Slider</option>
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                </select>
              </div>

              <div className="form-group">
                <label>Number to Display</label>
                <input
                  type="number"
                  className="form-control"
                  value={getFieldValue('testimonials', 'count')}
                  onChange={(e) => handleFieldChange('testimonials', 'count', e.target.value, 'number')}
                  min="3"
                  max="12"
                  placeholder="6"
                />
              </div>
            </div>
          </>
        )}
      </section>

      {/* Statistics */}
      <section className="editor-section">
        <h2 className="section-heading">Client Statistics</h2>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={getFieldValue('statistics', 'enabled') === 'true'}
              onChange={(e) => handleFieldChange('statistics', 'enabled', String(e.target.checked))}
            />
            <span>Show Client Statistics</span>
          </label>
        </div>

        {getFieldValue('statistics', 'enabled') === 'true' && (
          <>
            <div className="form-group">
              <label>Section Title</label>
              <input
                type="text"
                className="form-control"
                value={getFieldValue('statistics', 'title')}
                onChange={(e) => handleFieldChange('statistics', 'title', e.target.value)}
                placeholder="By The Numbers"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Clients Label</label>
                <input
                  type="text"
                  className="form-control"
                  value={getFieldValue('statistics', 'total_label')}
                  onChange={(e) => handleFieldChange('statistics', 'total_label', e.target.value)}
                  placeholder="Total Clients"
                />
              </div>

              <div className="form-group">
                <label>Active Clients Label</label>
                <input
                  type="text"
                  className="form-control"
                  value={getFieldValue('statistics', 'active_label')}
                  onChange={(e) => handleFieldChange('statistics', 'active_label', e.target.value)}
                  placeholder="Active Partnerships"
                />
              </div>
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="editor-section">
        <h2 className="section-heading">Call to Action</h2>
        
        <div className="form-group">
          <label>CTA Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('cta', 'title')}
            onChange={(e) => handleFieldChange('cta', 'title', e.target.value)}
            placeholder="Become Our Client"
          />
        </div>

        <div className="form-group">
          <label>CTA Description</label>
          <textarea
            className="form-control"
            value={getFieldValue('cta', 'description')}
            onChange={(e) => handleFieldChange('cta', 'description', e.target.value)}
            rows={3}
            placeholder="Join our growing list of satisfied clients..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Button Text</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('cta', 'button_text')}
              onChange={(e) => handleFieldChange('cta', 'button_text', e.target.value)}
              placeholder="Contact Us"
            />
          </div>

          <div className="form-group">
            <label>Button Link</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('cta', 'button_link')}
              onChange={(e) => handleFieldChange('cta', 'button_link', e.target.value)}
              placeholder="/contact"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientsPageEditor;
