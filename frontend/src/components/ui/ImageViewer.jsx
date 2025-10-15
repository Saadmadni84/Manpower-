import React, { useState, useEffect, useCallback } from 'react';
import './ImageViewer.css';

const ImageViewer = ({ 
  image, 
  images = [], 
  onClose, 
  onPrevious, 
  onNext,
  onDownload,
  language = 'en'
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const currentIndex = images.findIndex(img => img._id === image._id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const resetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = () => {
    resetView();
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handlePrevious = useCallback(() => {
    if (hasPrevious) {
      resetView();
      onPrevious();
    }
  }, [hasPrevious, onPrevious]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      resetView();
      onNext();
    }
  }, [hasNext, onNext]);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
      case '_':
        handleZoomOut();
        break;
      case '0':
        handleReset();
        break;
      case 'i':
      case 'I':
        setShowInfo(prev => !prev);
        break;
      default:
        break;
    }
  }, [onClose, handlePrevious, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    resetView();
  }, [image._id]);

  const title = image.title?.[language] || image.title?.en || 'Untitled';
  const description = image.description?.[language] || image.description?.en || '';

  return (
    <div className="image-viewer-overlay" onClick={onClose}>
      <div className="image-viewer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="viewer-header">
          <div className="viewer-title">
            <h2>{title}</h2>
            {currentIndex >= 0 && (
              <span className="image-counter">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>
          <button className="close-viewer-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        {/* Main Image Area */}
        <div 
          className="viewer-main"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            src={image.image}
            alt={title}
            className="viewer-image"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            draggable={false}
          />

          {/* Navigation Buttons */}
          {hasPrevious && (
            <button className="nav-btn prev-btn" onClick={handlePrevious}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6" strokeWidth="2"/>
              </svg>
            </button>
          )}
          {hasNext && (
            <button className="nav-btn next-btn" onClick={handleNext}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6" strokeWidth="2"/>
              </svg>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="viewer-controls">
          <div className="control-group">
            <button 
              className="control-btn"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom Out (-)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <line x1="8" y1="11" x2="14" y2="11" strokeWidth="2"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/>
              </svg>
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button 
              className="control-btn"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              title="Zoom In (+)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <line x1="11" y1="8" x2="11" y2="14" strokeWidth="2"/>
                <line x1="8" y1="11" x2="14" y2="11" strokeWidth="2"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/>
              </svg>
            </button>
            <button 
              className="control-btn"
              onClick={handleReset}
              title="Reset (0)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 4v6h6" strokeWidth="2"/>
                <path d="M23 20v-6h-6" strokeWidth="2"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2"/>
              </svg>
            </button>
          </div>

          <div className="control-group">
            <button 
              className="control-btn"
              onClick={() => setShowInfo(!showInfo)}
              title="Toggle Info (I)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2"/>
              </svg>
            </button>
            {onDownload && (
              <button 
                className="control-btn"
                onClick={() => onDownload(image)}
                title="Download"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2"/>
                  <polyline points="7 10 12 15 17 10" strokeWidth="2"/>
                  <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="viewer-info">
            {description && (
              <div className="info-section">
                <h4>Description</h4>
                <p>{description}</p>
              </div>
            )}
            <div className="info-grid">
              {image.category && (
                <div className="info-item">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{image.category.replace('_', ' ')}</span>
                </div>
              )}
              {image.dimensions && (
                <div className="info-item">
                  <span className="info-label">Dimensions:</span>
                  <span className="info-value">
                    {image.dimensions.width} × {image.dimensions.height}
                  </span>
                </div>
              )}
              {image.fileSize && (
                <div className="info-item">
                  <span className="info-label">File Size:</span>
                  <span className="info-value">
                    {(image.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              )}
              {image.eventName && (
                <div className="info-item">
                  <span className="info-label">Event:</span>
                  <span className="info-value">{image.eventName}</span>
                </div>
              )}
              {image.location && (
                <div className="info-item">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{image.location}</span>
                </div>
              )}
              {image.photoDate && (
                <div className="info-item">
                  <span className="info-label">Photo Date:</span>
                  <span className="info-value">
                    {new Date(image.photoDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            {image.tags && image.tags.length > 0 && (
              <div className="info-section">
                <h4>Tags</h4>
                <div className="tag-list">
                  {image.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="viewer-shortcuts">
          <span>← → Navigate</span>
          <span>+ - Zoom</span>
          <span>0 Reset</span>
          <span>I Info</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;

