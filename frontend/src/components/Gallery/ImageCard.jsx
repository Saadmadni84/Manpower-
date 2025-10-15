import React, { useState } from 'react';
import './ImageCard.css';

const ImageCard = ({ 
  image, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleFeatured,
  onToggleStatus,
  onSelect,
  isSelected = false,
  showActions = true,
  language = 'en'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      company_events: '#1976d2',
      projects: '#2e7d32',
      team_photos: '#ed6c02',
      facilities: '#9c27b0',
      achievements: '#d32f2f',
      training: '#0288d1',
      awards: '#f57c00',
      client_visits: '#795548',
      other: '#607d8b'
    };
    return colors[category] || '#607d8b';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      company_events: 'Company Events',
      projects: 'Projects',
      team_photos: 'Team Photos',
      facilities: 'Facilities',
      achievements: 'Achievements',
      training: 'Training',
      awards: 'Awards',
      client_visits: 'Client Visits',
      other: 'Other'
    };
    return labels[category] || 'Other';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const title = image.title?.[language] || image.title?.en || 'Untitled';
  const imageUrl = image.thumbnail || image.image;

  return (
    <div className={`image-card ${isSelected ? 'selected' : ''} ${!image.isActive ? 'inactive' : ''}`}>
      {showActions && (
        <div className="card-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(image._id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="card-image-container" onClick={() => onView(image)}>
        {!imageLoaded && !imageError && (
          <div className="image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="image-error">
            <span>Failed to load image</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            className="card-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        )}

        <div className="image-overlay">
          <div className="overlay-content">
            <h3 className="image-title">{title}</h3>
            <p className="image-meta">
              {image.dimensions?.width && image.dimensions?.height && (
                <span>{image.dimensions.width} × {image.dimensions.height}</span>
              )}
              {image.fileSize && <span>{formatFileSize(image.fileSize)}</span>}
            </p>
            {showActions && (
              <div className="overlay-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(image);
                  }}
                  title="View"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                  </svg>
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(image);
                  }}
                  title="Edit"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2"/>
                  </svg>
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image);
                  }}
                  title="Delete"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3 6 5 6 21 6" strokeWidth="2"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-details">
        <div className="card-header">
          <h4 className="card-title" title={title}>{title}</h4>
          <div className="card-badges">
            {image.isFeatured && (
              <span className="badge featured-badge" title="Featured">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </span>
            )}
            {!image.isActive && (
              <span className="badge inactive-badge" title="Inactive">
                Inactive
              </span>
            )}
          </div>
        </div>

        <div 
          className="category-badge" 
          style={{ backgroundColor: getCategoryColor(image.category) }}
        >
          {getCategoryLabel(image.category)}
        </div>

        <div className="card-info">
          <span className="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
            </svg>
            {formatDate(image.createdAt)}
          </span>

          {image.stats && (
            <>
              <span className="info-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                </svg>
                {image.stats.views || 0}
              </span>
              <span className="info-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2"/>
                  <polyline points="7 10 12 15 17 10" strokeWidth="2"/>
                  <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2"/>
                </svg>
                {image.stats.downloads || 0}
              </span>
            </>
          )}
        </div>

        {showActions && (
          <div className="card-quick-actions">
            <button
              className={`quick-action-btn ${image.isFeatured ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatured(image._id);
              }}
              title={image.isFeatured ? 'Remove from featured' : 'Mark as featured'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={image.isFeatured ? 'currentColor' : 'none'} stroke="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
            <button
              className={`quick-action-btn ${image.isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(image._id);
              }}
              title={image.isActive ? 'Deactivate' : 'Activate'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {image.isActive ? (
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2"/>
                    <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2"/>
                  </>
                )}
                {image.isActive && <circle cx="12" cy="12" r="3" strokeWidth="2"/>}
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;

