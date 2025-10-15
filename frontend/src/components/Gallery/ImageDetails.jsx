import React, { useState } from 'react';
import './ImageDetails.css';

const ImageDetails = ({ image, onUpdate, onClose, categories = [] }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: image.title || { en: '', ar: '' },
    description: image.description || { en: '', ar: '' },
    category: image.category || 'other',
    tags: image.tags || [],
    keywords: image.keywords || [],
    displayOrder: image.displayOrder || 0,
    isFeatured: image.isFeatured || false,
    displayOnHomepage: image.displayOnHomepage || false,
    isActive: image.isActive !== undefined ? image.isActive : true,
    photoDate: image.photoDate || '',
    eventName: image.eventName || '',
    location: image.location || '',
    altText: image.altText || { en: '', ar: '' }
  });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate(image._id, formData);
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update image');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'info' },
    { id: 'display', label: 'Display', icon: 'eye' },
    { id: 'photo', label: 'Photo Details', icon: 'camera' },
    { id: 'seo', label: 'SEO', icon: 'search' },
    { id: 'technical', label: 'Technical', icon: 'settings' }
  ];

  return (
    <div className="image-details-modal">
      <div className="details-header">
        <h2>Image Details</h2>
        <button type="button" onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>

      <div className="details-content">
        <div className="image-preview-section">
          <img src={image.thumbnail || image.image} alt={formData.title.en} className="details-image" />
          <p className="image-filename">{image.originalFilename}</p>
        </div>

        <div className="details-form-section">
          <div className="tabs-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="details-form">
            {activeTab === 'basic' && (
              <div className="tab-content">
                <div className="form-group">
                  <label>Title (English) *</label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Title (Arabic)</label>
                  <input
                    type="text"
                    value={formData.title.ar}
                    onChange={(e) => handleInputChange('title', e.target.value, 'ar')}
                    dir="rtl"
                  />
                </div>
                <div className="form-group">
                  <label>Description (English)</label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Description (Arabic)</label>
                  <textarea
                    value={formData.description.ar}
                    onChange={(e) => handleInputChange('description', e.target.value, 'ar')}
                    rows="4"
                    dir="rtl"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tags</label>
                  <div className="tag-input-container">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tag"
                    />
                    <button type="button" onClick={handleAddTag} className="add-btn">Add</button>
                  </div>
                  <div className="tag-list">
                    {formData.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)}>&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="tab-content">
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    />
                    <span>Featured Image</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.displayOnHomepage}
                      onChange={(e) => handleInputChange('displayOnHomepage', e.target.checked)}
                    />
                    <span>Display on Homepage</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                    <span>Active Status</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'photo' && (
              <div className="tab-content">
                <div className="form-group">
                  <label>Photo Date</label>
                  <input
                    type="date"
                    value={formData.photoDate ? formData.photoDate.split('T')[0] : ''}
                    onChange={(e) => handleInputChange('photoDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Event Name</label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => handleInputChange('eventName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Keywords (for search)</label>
                  <div className="tag-input-container">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      placeholder="Add keyword"
                    />
                    <button type="button" onClick={handleAddKeyword} className="add-btn">Add</button>
                  </div>
                  <div className="tag-list">
                    {formData.keywords.map(keyword => (
                      <span key={keyword} className="tag">
                        {keyword}
                        <button type="button" onClick={() => handleRemoveKeyword(keyword)}>&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="tab-content">
                <div className="form-group">
                  <label>Alt Text (English)</label>
                  <input
                    type="text"
                    value={formData.altText.en}
                    onChange={(e) => handleInputChange('altText', e.target.value, 'en')}
                    placeholder="Describe the image for accessibility"
                  />
                </div>
                <div className="form-group">
                  <label>Alt Text (Arabic)</label>
                  <input
                    type="text"
                    value={formData.altText.ar}
                    onChange={(e) => handleInputChange('altText', e.target.value, 'ar')}
                    dir="rtl"
                    placeholder="وصف الصورة لسهولة الوصول"
                  />
                </div>
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="tab-content">
                <div className="info-grid">
                  <div className="info-item">
                    <label>File Size</label>
                    <p>{image.fileSize ? `${(image.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Dimensions</label>
                    <p>{image.dimensions ? `${image.dimensions.width} × ${image.dimensions.height}` : 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>MIME Type</label>
                    <p>{image.mimeType || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Upload Date</label>
                    <p>{new Date(image.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="info-item">
                    <label>Views</label>
                    <p>{image.stats?.views || 0}</p>
                  </div>
                  <div className="info-item">
                    <label>Downloads</label>
                    <p>{image.stats?.downloads || 0}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageDetails;

