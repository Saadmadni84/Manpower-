import React, { useState } from 'react';
import { FiX, FiMonitor, FiTablet, FiSmartphone, FiExternalLink } from 'react-icons/fi';
import './PreviewModal.css';

const PreviewModal = ({ isOpen, onClose, page, content, language = 'en' }) => {
  const [device, setDevice] = useState('desktop'); // desktop, tablet, mobile

  if (!isOpen) return null;

  const getDeviceClass = () => {
    switch (device) {
      case 'tablet':
        return 'device-tablet';
      case 'mobile':
        return 'device-mobile';
      default:
        return 'device-desktop';
    }
  };

  const renderContent = () => {
    if (!content) {
      return (
        <div className="preview-placeholder">
          <p>No content to preview</p>
        </div>
      );
    }

    // This is a simplified preview - in production, you'd render actual components
    return (
      <div className="preview-content" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {Object.entries(content).map(([section, items]) => (
          <div key={section} className="preview-section">
            <h3 className="section-title">{section.replace(/_/g, ' ').toUpperCase()}</h3>
            <div className="section-content">
              {Array.isArray(items) ? (
                items.map((item, idx) => (
                  <div key={idx} className="content-item">
                    <strong>{item.contentKey}:</strong>
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: item.value || item.content?.[language] || 'No content' 
                      }} 
                    />
                  </div>
                ))
              ) : (
                <div dangerouslySetInnerHTML={{ __html: items }} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <div className="preview-title">
            <h2>Preview: {page} Page</h2>
            <span className="preview-language">{language === 'en' ? 'English' : 'العربية'}</span>
          </div>
          
          <div className="preview-actions">
            <div className="device-selector">
              <button
                className={`device-btn ${device === 'desktop' ? 'active' : ''}`}
                onClick={() => setDevice('desktop')}
                title="Desktop view"
              >
                <FiMonitor />
              </button>
              <button
                className={`device-btn ${device === 'tablet' ? 'active' : ''}`}
                onClick={() => setDevice('tablet')}
                title="Tablet view"
              >
                <FiTablet />
              </button>
              <button
                className={`device-btn ${device === 'mobile' ? 'active' : ''}`}
                onClick={() => setDevice('mobile')}
                title="Mobile view"
              >
                <FiSmartphone />
              </button>
            </div>
            
            <button className="open-new-tab-btn" title="Open in new tab">
              <FiExternalLink />
            </button>
            
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>
        
        <div className="preview-body">
          <div className={`preview-frame ${getDeviceClass()}`}>
            <div className="preview-frame-inner">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
