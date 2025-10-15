import React, { useState, useCallback, useRef } from 'react';
import './DragDropUpload.css';

const DragDropUpload = ({ 
  onFilesSelected, 
  multiple = true, 
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 20
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFiles = (files) => {
    const validFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Invalid file type. Only images are allowed.`);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name}: File size exceeds ${maxSize / (1024 * 1024)}MB limit.`);
        return;
      }

      validFiles.push(file);
    });

    // Check max files limit
    if (validFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed.`);
      return { validFiles: validFiles.slice(0, maxFiles), errors };
    }

    return { validFiles, errors };
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    const { validFiles, errors } = validateFiles(files);

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [onFilesSelected, maxSize, maxFiles]);

  const handleFileInput = useCallback((e) => {
    setError(null);
    const files = e.target.files;
    const { validFiles, errors } = validateFiles(files);

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [onFilesSelected, maxSize, maxFiles]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="drag-drop-upload-container">
      <div 
        className={`drag-drop-zone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        
        <div className="drag-drop-content">
          <div className="upload-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="drag-drop-text">
            {isDragging ? (
              <p className="drop-text">Drop files here</p>
            ) : (
              <>
                <p className="main-text">
                  Drag & drop {multiple ? 'images' : 'an image'} here
                </p>
                <p className="sub-text">or click to browse</p>
                <p className="info-text">
                  {multiple && `Up to ${maxFiles} files, `}
                  Max {maxSize / (1024 * 1024)}MB per file
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="upload-error">
          {error.split('\n').map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;

