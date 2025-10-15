import React, { useState } from 'react';
import DragDropUpload from '../ui/DragDropUpload';
import './ImageUpload.css';

const ImageUpload = ({ onUpload, onCancel, categories = [] }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    category: 'other',
    tags: [],
    keywords: [],
    eventName: '',
    location: '',
    photoDate: '',
    isFeatured: false,
    displayOnHomepage: false,
    altText: { en: '', ar: '' }
  });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFilesSelected = (files) => {
    const file = files[0];
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Auto-fill title from filename
    const filename = file.name.split('.')[0];
    setFormData(prev => ({
      ...prev,
      title: { ...prev.title, en: filename },
      altText: { ...prev.altText, en: filename }
    }));
  };

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
    
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      await onUpload({
        file: selectedFile,
        ...formData
      });
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setFormData({
        title: { en: '', ar: '' },
        description: { en: '', ar: '' },
        category: 'other',
        tags: [],
        keywords: [],
        eventName: '',
        location: '',
        photoDate: '',
        isFeatured: false,
        displayOnHomepage: false,
        altText: { en: '', ar: '' }
      });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <div className="upload-header">
        <h2>Upload Image</h2>
        <button type="button" onClick={onCancel} className="close-btn">
          <span>&times;</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        {!selectedFile ? (
          <DragDropUpload 
            onFilesSelected={handleFilesSelected}
            multiple={false}
          />
        ) : (
          <div className="image-preview-section">
            <img src={preview} alt="Preview" className="image-preview" />
            <button 
              type="button" 
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
              }}
              className="change-image-btn"
            >
              Change Image
            </button>
          </div>
        )}

        {selectedFile && (
          <>
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Description (English)</label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Description (Arabic)</label>
                  <textarea
                    value={formData.description.ar}
                    onChange={(e) => handleInputChange('description', e.target.value, 'ar')}
                    rows="3"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Categorization</h3>
              <div className="form-row">
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
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Type and press Enter to add"
                  />
                  <button type="button" onClick={handleAddTag} className="add-btn">
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {formData.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)}>
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Keywords (for search)</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    placeholder="Type and press Enter to add"
                  />
                  <button type="button" onClick={handleAddKeyword} className="add-btn">
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {formData.keywords.map(keyword => (
                    <span key={keyword} className="tag">
                      {keyword}
                      <button type="button" onClick={() => handleRemoveKeyword(keyword)}>
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Photo Details</h3>
              <div className="form-row">
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
              </div>

              <div className="form-group">
                <label>Photo Date</label>
                <input
                  type="date"
                  value={formData.photoDate}
                  onChange={(e) => handleInputChange('photoDate', e.target.value)}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Display Settings</h3>
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
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="upload-btn" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ImageUpload;

