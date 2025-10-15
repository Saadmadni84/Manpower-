import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import './ImageGrid.css';

const ImageGrid = ({ 
  images = [], 
  onView,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleStatus,
  onBulkAction,
  gridSize = 'medium',
  language = 'en',
  loading = false
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setSelectAll(selectedImages.length > 0 && selectedImages.length === images.length);
  }, [selectedImages, images]);

  const handleSelectImage = (imageId, checked) => {
    if (checked) {
      setSelectedImages(prev => [...prev, imageId]);
    } else {
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedImages(images.map(img => img._id));
    } else {
      setSelectedImages([]);
    }
    setSelectAll(checked);
  };

  const handleBulkDelete = () => {
    if (selectedImages.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedImages.length} image(s)?`)) {
      onBulkAction('delete', selectedImages);
      setSelectedImages([]);
      setSelectAll(false);
    }
  };

  const handleBulkFeatured = () => {
    if (selectedImages.length === 0) return;
    onBulkAction('feature', selectedImages);
    setSelectedImages([]);
    setSelectAll(false);
  };

  const handleBulkActivate = () => {
    if (selectedImages.length === 0) return;
    onBulkAction('activate', selectedImages);
    setSelectedImages([]);
    setSelectAll(false);
  };

  const gridSizeClass = {
    small: 'grid-small',
    medium: 'grid-medium',
    large: 'grid-large'
  }[gridSize] || 'grid-medium';

  if (loading) {
    return (
      <div className="grid-loading">
        <div className="loading-spinner large"></div>
        <p>Loading images...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="grid-empty">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <polyline points="21 15 16 10 5 21" strokeWidth="2"/>
          </svg>
        </div>
        <h3>No images found</h3>
        <p>Upload some images to get started</p>
      </div>
    );
  }

  return (
    <div className="image-grid-container">
      {selectedImages.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-selection">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span>{selectedImages.length} image(s) selected</span>
          </div>
          <div className="bulk-buttons">
            <button 
              className="bulk-btn feature-btn"
              onClick={handleBulkFeatured}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2"/>
              </svg>
              Mark as Featured
            </button>
            <button 
              className="bulk-btn activate-btn"
              onClick={handleBulkActivate}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              </svg>
              Toggle Active
            </button>
            <button 
              className="bulk-btn delete-btn"
              onClick={handleBulkDelete}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6" strokeWidth="2"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2"/>
              </svg>
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className={`image-grid ${gridSizeClass}`}>
        {images.map(image => (
          <ImageCard
            key={image._id}
            image={image}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFeatured={onToggleFeatured}
            onToggleStatus={onToggleStatus}
            onSelect={handleSelectImage}
            isSelected={selectedImages.includes(image._id)}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;

