import React, { useState } from 'react';
import DragDropUpload from '../ui/DragDropUpload';
import './BulkUpload.css';

const BulkUpload = ({ onUpload, onCancel, categories = [] }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sharedMetadata, setSharedMetadata] = useState({
    category: 'other',
    tags: [],
    keywords: [],
    eventName: '',
    location: '',
    photoDate: '',
    isFeatured: false,
    displayOnHomepage: false
  });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFilesSelected = (files) => {
    const newFiles = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id) => {
    setSelectedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleInputChange = (field, value) => {
    setSharedMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !sharedMetadata.tags.includes(tagInput.trim())) {
      setSharedMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setSharedMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !sharedMetadata.keywords.includes(keywordInput.trim())) {
      setSharedMetadata(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setSharedMetadata(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const formatFileSize = (bytes) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setUploading(true);
    try {
      const files = selectedFiles.map(f => f.file);
      await onUpload(files, sharedMetadata);
      
      // Clean up previews
      selectedFiles.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      
      // Reset
      setSelectedFiles([]);
      setSharedMetadata({
        category: 'other',
        tags: [],
        keywords: [],
        eventName: '',
        location: '',
        photoDate: '',
        isFeatured: false,
        displayOnHomepage: false
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="bulk-upload-container">
      <div className="bulk-upload-header">
        <h2>Bulk Upload Images</h2>
        <button type="button" onClick={onCancel} className="close-btn">
          <span>&times;</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bulk-upload-form">
        <div className="upload-section">
          <DragDropUpload 
            onFilesSelected={handleFilesSelected}
            multiple={true}
            maxFiles={20}
          />
        </div>

        {selectedFiles.length > 0 && (
          <>
            <div className="selected-files-section">
              <div className="files-header">
                <h3>Selected Images ({selectedFiles.length})</h3>
                <span className="total-size">{formatFileSize(totalSize)}</span>
              </div>
              
              <div className="files-grid">
                {selectedFiles.map(file => (
                  <div key={file.id} className="file-preview-card">
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      &times;
                    </button>
                    <img src={file.preview} alt={file.name} className="preview-image" />
                    <div className="file-info">
                      <p className="file-name" title={file.name}>{file.name}</p>
                      <p className="file-size">{formatFileSize(file.size)}</p>
                    </div>
                    {uploadProgress[file.id] !== undefined && (
                      <div className="upload-progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${uploadProgress[file.id]}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="metadata-section">
              <h3>Shared Metadata</h3>
              <p className="section-note">This metadata will be applied to all images</p>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={sharedMetadata.category}
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

              <div className="form-row">
                <div className="form-group">
                  <label>Event Name</label>
                  <input
                    type="text"
                    value={sharedMetadata.eventName}
                    onChange={(e) => handleInputChange('eventName', e.target.value)}
                    placeholder="e.g., Annual Conference 2024"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={sharedMetadata.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Dubai"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Photo Date</label>
                <input
                  type="date"
                  value={sharedMetadata.photoDate}
                  onChange={(e) => handleInputChange('photoDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tags"
                  />
                  <button type="button" onClick={handleAddTag} className="add-btn">
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {sharedMetadata.tags.map(tag => (
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
                <label>Keywords</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    placeholder="Add keywords for search"
                  />
                  <button type="button" onClick={handleAddKeyword} className="add-btn">
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {sharedMetadata.keywords.map(keyword => (
                    <span key={keyword} className="tag">
                      {keyword}
                      <button type="button" onClick={() => handleRemoveKeyword(keyword)}>
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={sharedMetadata.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  />
                  <span>Mark all as Featured</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={sharedMetadata.displayOnHomepage}
                    onChange={(e) => handleInputChange('displayOnHomepage', e.target.checked)}
                  />
                  <span>Display all on Homepage</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="upload-btn" disabled={uploading}>
                {uploading ? `Uploading ${selectedFiles.length} images...` : `Upload ${selectedFiles.length} Images`}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default BulkUpload;

