import React, { useState } from 'react';
import '../../styles/management.css';
import './GalleryManagement.css';

const GalleryManagement = () => {
  const [images] = useState([
    { id: 1, title: 'Team Building Event 2024', category: 'Events', url: '🎉' },
    { id: 2, title: 'Construction Site', category: 'Work Sites', url: '🏗️' },
    { id: 3, title: 'Airport Operations', category: 'Work Sites', url: '✈️' },
    { id: 4, title: 'Safety Training', category: 'Training', url: '👷' },
    { id: 5, title: 'Annual Company Dinner', category: 'Events', url: '🍽️' },
    { id: 6, title: 'Office Team Photo', category: 'Team', url: '👥' }
  ]);

  return (
    <div className="gallery-management">
      <div className="page-header">
        <div>
          <h2>Gallery Management</h2>
          <p>Manage company photos and media</p>
        </div>
        <button className="btn-primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
          </svg>
          Upload Images
        </button>
      </div>

      <div className="gallery-grid">
        {images.map(image => (
          <div key={image.id} className="gallery-item">
            <div className="gallery-image">
              <div className="image-placeholder">{image.url}</div>
            </div>
            <div className="gallery-item-footer">
              <div>
                <h4>{image.title}</h4>
                <span className="badge-info">{image.category}</span>
              </div>
              <button className="btn-icon btn-delete">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManagement;
