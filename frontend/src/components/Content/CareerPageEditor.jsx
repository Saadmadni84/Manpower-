import React from 'react';
import RichTextEditor from './RichTextEditor';
import MediaUploader from './MediaUploader';
import './PageEditor.css';

const CareerPageEditor = ({ content, onChange, language, uploadMedia }) => {
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
      {/* Career Page Header */}
      <section className="editor-section">
        <h2 className="section-heading">Career Page Header</h2>
        
        <div className="form-group">
          <label>Page Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('header', 'title')}
            onChange={(e) => handleFieldChange('header', 'title', e.target.value)}
            placeholder="Join Our Team"
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
              const result = await uploadMedia(file, 'career');
              handleFieldChange('header', 'background_image', result.url, 'image');
              return result;
            }}
            acceptedTypes="image/*"
          />
        </div>

        <div className="form-group">
          <label>Career Video URL (Optional)</label>
          <input
            type="url"
            className="form-control"
            value={getFieldValue('header', 'video_url')}
            onChange={(e) => handleFieldChange('header', 'video_url', e.target.value, 'url')}
            placeholder="https://youtube.com/watch?v=..."
          />
          <small className="form-hint">YouTube or Vimeo URL</small>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="editor-section">
        <h2 className="section-heading">Why Work With Us</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('why_work', 'title')}
            onChange={(e) => handleFieldChange('why_work', 'title', e.target.value)}
            placeholder="Why Work With Us"
          />
        </div>

        <div className="form-group">
          <label>Section Description</label>
          <RichTextEditor
            value={getFieldValue('why_work', 'description')}
            onChange={(value) => handleFieldChange('why_work', 'description', value, 'html')}
            minHeight="120px"
            toolbar="basic"
          />
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Individual benefits are managed as a list. 
            Each benefit includes a title, description, and icon.
          </p>
        </div>
      </section>

      {/* Employee Benefits */}
      <section className="editor-section">
        <h2 className="section-heading">Employee Benefits</h2>
        
        <div className="form-group">
          <label>Benefits Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('benefits', 'title')}
            onChange={(e) => handleFieldChange('benefits', 'title', e.target.value)}
            placeholder="Employee Benefits"
          />
        </div>

        <div className="benefits-list">
          <div className="form-group">
            <label>Benefit 1: Competitive Salary</label>
            <textarea
              className="form-control"
              value={getFieldValue('benefits', 'competitive_salary')}
              onChange={(e) => handleFieldChange('benefits', 'competitive_salary', e.target.value)}
              rows={2}
              placeholder="Description of competitive salary package..."
            />
          </div>

          <div className="form-group">
            <label>Benefit 2: Health Insurance</label>
            <textarea
              className="form-control"
              value={getFieldValue('benefits', 'health_insurance')}
              onChange={(e) => handleFieldChange('benefits', 'health_insurance', e.target.value)}
              rows={2}
              placeholder="Description of health insurance coverage..."
            />
          </div>

          <div className="form-group">
            <label>Benefit 3: Career Development</label>
            <textarea
              className="form-control"
              value={getFieldValue('benefits', 'career_development')}
              onChange={(e) => handleFieldChange('benefits', 'career_development', e.target.value)}
              rows={2}
              placeholder="Description of career development opportunities..."
            />
          </div>

          <div className="form-group">
            <label>Benefit 4: Work-Life Balance</label>
            <textarea
              className="form-control"
              value={getFieldValue('benefits', 'work_life_balance')}
              onChange={(e) => handleFieldChange('benefits', 'work_life_balance', e.target.value)}
              rows={2}
              placeholder="Description of work-life balance policies..."
            />
          </div>

          <div className="form-group">
            <label>Benefit 5: Professional Training</label>
            <textarea
              className="form-control"
              value={getFieldValue('benefits', 'training')}
              onChange={(e) => handleFieldChange('benefits', 'training', e.target.value)}
              rows={2}
              placeholder="Description of training programs..."
            />
          </div>

          <div className="form-group">
            <label>Benefit 6: Other Benefits</label>
            <textarea
              className="form-control"
              value={getFieldValue('benefits', 'other')}
              onChange={(e) => handleFieldChange('benefits', 'other', e.target.value)}
              rows={2}
              placeholder="Description of other benefits..."
            />
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="editor-section">
        <h2 className="section-heading">Career Opportunities</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('opportunities', 'title')}
            onChange={(e) => handleFieldChange('opportunities', 'title', e.target.value)}
            placeholder="Current Openings"
          />
        </div>

        <div className="form-group">
          <label>Section Description</label>
          <RichTextEditor
            value={getFieldValue('opportunities', 'description')}
            onChange={(value) => handleFieldChange('opportunities', 'description', value, 'html')}
            minHeight="100px"
            toolbar="minimal"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={getFieldValue('opportunities', 'show_categories') === 'true'}
                onChange={(e) => handleFieldChange('opportunities', 'show_categories', String(e.target.checked))}
              />
              <span>Show Job Categories Filter</span>
            </label>
          </div>

          <div className="form-group">
            <label>Featured Jobs Count</label>
            <input
              type="number"
              className="form-control"
              value={getFieldValue('opportunities', 'featured_count')}
              onChange={(e) => handleFieldChange('opportunities', 'featured_count', e.target.value, 'number')}
              min="0"
              max="20"
              placeholder="6"
            />
          </div>
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Actual job postings are managed through the Jobs Management section. 
            This controls how they are displayed on the career page.
          </p>
        </div>
      </section>

      {/* Application Process */}
      <section className="editor-section">
        <h2 className="section-heading">Application Process</h2>
        
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('process', 'title')}
            onChange={(e) => handleFieldChange('process', 'title', e.target.value)}
            placeholder="How to Apply"
          />
        </div>

        <div className="form-group">
          <label>Process Introduction</label>
          <RichTextEditor
            value={getFieldValue('process', 'introduction')}
            onChange={(value) => handleFieldChange('process', 'introduction', value, 'html')}
            minHeight="100px"
            toolbar="minimal"
          />
        </div>

        <div className="process-steps">
          <h4>Application Steps:</h4>
          
          <div className="form-group">
            <label>Step 1: Title</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('process', 'step1_title')}
              onChange={(e) => handleFieldChange('process', 'step1_title', e.target.value)}
              placeholder="Search & Browse"
            />
            <label>Step 1: Description</label>
            <textarea
              className="form-control"
              value={getFieldValue('process', 'step1_description')}
              onChange={(e) => handleFieldChange('process', 'step1_description', e.target.value)}
              rows={2}
              placeholder="Browse our current job openings..."
            />
          </div>

          <div className="form-group">
            <label>Step 2: Title</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('process', 'step2_title')}
              onChange={(e) => handleFieldChange('process', 'step2_title', e.target.value)}
              placeholder="Submit Application"
            />
            <label>Step 2: Description</label>
            <textarea
              className="form-control"
              value={getFieldValue('process', 'step2_description')}
              onChange={(e) => handleFieldChange('process', 'step2_description', e.target.value)}
              rows={2}
              placeholder="Fill out the application form..."
            />
          </div>

          <div className="form-group">
            <label>Step 3: Title</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('process', 'step3_title')}
              onChange={(e) => handleFieldChange('process', 'step3_title', e.target.value)}
              placeholder="Initial Review"
            />
            <label>Step 3: Description</label>
            <textarea
              className="form-control"
              value={getFieldValue('process', 'step3_description')}
              onChange={(e) => handleFieldChange('process', 'step3_description', e.target.value)}
              rows={2}
              placeholder="Our HR team will review your application..."
            />
          </div>

          <div className="form-group">
            <label>Step 4: Title</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('process', 'step4_title')}
              onChange={(e) => handleFieldChange('process', 'step4_title', e.target.value)}
              placeholder="Interview"
            />
            <label>Step 4: Description</label>
            <textarea
              className="form-control"
              value={getFieldValue('process', 'step4_description')}
              onChange={(e) => handleFieldChange('process', 'step4_description', e.target.value)}
              rows={2}
              placeholder="Qualified candidates will be invited for interviews..."
            />
          </div>

          <div className="form-group">
            <label>Step 5: Title</label>
            <input
              type="text"
              className="form-control"
              value={getFieldValue('process', 'step5_title')}
              onChange={(e) => handleFieldChange('process', 'step5_title', e.target.value)}
              placeholder="Job Offer"
            />
            <label>Step 5: Description</label>
            <textarea
              className="form-control"
              value={getFieldValue('process', 'step5_description')}
              onChange={(e) => handleFieldChange('process', 'step5_description', e.target.value)}
              rows={2}
              placeholder="Successful candidates will receive a job offer..."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="editor-section">
        <h2 className="section-heading">Career CTA</h2>
        
        <div className="form-group">
          <label>CTA Text</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('cta', 'text')}
            onChange={(e) => handleFieldChange('cta', 'text', e.target.value)}
            placeholder="Ready to Start Your Career?"
          />
        </div>

        <div className="form-group">
          <label>CTA Button Text</label>
          <input
            type="text"
            className="form-control"
            value={getFieldValue('cta', 'button_text')}
            onChange={(e) => handleFieldChange('cta', 'button_text', e.target.value)}
            placeholder="View All Jobs"
          />
        </div>
      </section>
    </div>
  );
};

export default CareerPageEditor;
