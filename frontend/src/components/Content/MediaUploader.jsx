import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiFile } from 'react-icons/fi';
import './MediaUploader.css';

const MediaUploader = ({ 
  onUpload, 
  acceptedTypes = 'image/*,video/*', 
  maxSize = 10, // MB
  multiple = false,
  currentFile = null,
  onRemove = null
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentFile);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (!files.length) return;

    // Validate file size
    const validFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    setUploading(true);
    try {
      if (multiple) {
        const results = await Promise.all(
          validFiles.map(file => onUpload(file))
        );
        setPreview(results.map(r => r.url));
      } else {
        const result = await onUpload(validFiles[0]);
        setPreview(result.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const renderPreview = () => {
    if (!preview) return null;

    if (Array.isArray(preview)) {
      return (
        <div className="preview-grid">
          {preview.map((url, index) => (
            <div key={index} className="preview-item">
              <img src={url} alt={`Upload ${index + 1}`} />
            </div>
          ))}
        </div>
      );
    }

    const isImage = typeof preview === 'string' && 
      (preview.match(/\.(jpeg|jpg|gif|png|webp)$/i) || preview.startsWith('data:image'));

    return (
      <div className="preview-container">
        {isImage ? (
          <img src={preview} alt="Upload preview" className="preview-image" />
        ) : (
          <div className="file-preview">
            <FiFile size={48} />
            <span>File uploaded</span>
          </div>
        )}
        <button 
          className="remove-btn"
          onClick={handleRemove}
          type="button"
        >
          <FiX />
        </button>
      </div>
    );
  };

  return (
    <div className="media-uploader">
      {preview ? (
        renderPreview()
      ) : (
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            multiple={multiple}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <div className="upload-content">
            {uploading ? (
              <>
                <div className="spinner"></div>
                <p>Uploading...</p>
              </>
            ) : (
              <>
                <FiUpload size={48} />
                <p className="upload-text">
                  Drag & drop files here or <span className="link">browse</span>
                </p>
                <p className="upload-hint">
                  Max size: {maxSize}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
