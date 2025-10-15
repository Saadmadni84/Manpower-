import React from 'react';
import './CategoryManager.css';

const CategoryManager = ({ categories = [], onClose }) => {
  const getCategoryColor = (value) => {
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
    return colors[value] || '#607d8b';
  };

  const getCategoryIcon = (value) => {
    const icons = {
      company_events: 'event',
      projects: 'construction',
      team_photos: 'people',
      facilities: 'business',
      achievements: 'emoji_events',
      training: 'school',
      awards: 'military_tech',
      client_visits: 'handshake',
      other: 'photo_library'
    };
    return icons[value] || 'photo_library';
  };

  return (
    <div className="category-manager-modal">
      <div className="category-header">
        <h2>Gallery Categories</h2>
        <button type="button" onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>

      <div className="category-content">
        <div className="categories-grid">
          {categories.map(cat => (
            <div 
              key={cat.value} 
              className="category-card"
              style={{ borderLeftColor: getCategoryColor(cat.value) }}
            >
              <div 
                className="category-icon"
                style={{ backgroundColor: `${getCategoryColor(cat.value)}20` }}
              >
                <span 
                  className="material-icons" 
                  style={{ color: getCategoryColor(cat.value) }}
                >
                  {getCategoryIcon(cat.value)}
                </span>
              </div>
              <div className="category-info">
                <h3>{cat.label}</h3>
                <p className="category-count">
                  {cat.count || 0} {cat.count === 1 ? 'image' : 'images'}
                </p>
                <p className="category-value">{cat.value}</p>
              </div>
              <div 
                className="category-badge"
                style={{ backgroundColor: getCategoryColor(cat.value) }}
              >
                {cat.count || 0}
              </div>
            </div>
          ))}
        </div>

        <div className="category-stats">
          <div className="stat-item">
            <h4>Total Categories</h4>
            <p>{categories.length}</p>
          </div>
          <div className="stat-item">
            <h4>Total Images</h4>
            <p>{categories.reduce((sum, cat) => sum + (cat.count || 0), 0)}</p>
          </div>
          <div className="stat-item">
            <h4>Most Used</h4>
            <p>
              {categories.reduce((max, cat) => 
                (cat.count || 0) > (max.count || 0) ? cat : max, 
                categories[0] || { label: 'N/A' }
              ).label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;

