import React from 'react';
import './CVViewer.css';

const CVViewer = ({ cvFile, onClose }) => {
  const getFileExtension = (filename) => {
    return filename?.split('.').pop().toLowerCase();
  };

  const extension = getFileExtension(cvFile?.filename);

  const renderContent = () => {
    if (!cvFile) {
      return <div className="no-cv">No CV file available</div>;
    }

    // For PDF files
    if (extension === 'pdf') {
      return (
        <iframe
          src={`${process.env.REACT_APP_API_URL}/${cvFile.path}`}
          title="CV Viewer"
          className="cv-iframe"
        />
      );
    }

    // For image files (if CV is uploaded as image)
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return (
        <img
          src={`${process.env.REACT_APP_API_URL}/${cvFile.path}`}
          alt="CV"
          className="cv-image"
        />
      );
    }

    // For other file types, show download option
    return (
      <div className="cv-download-container">
        <div className="file-icon">📄</div>
        <h3>{cvFile.originalName || cvFile.filename}</h3>
        <p>File type: {extension?.toUpperCase()}</p>
        <p>Size: {(cvFile.size / 1024).toFixed(2)} KB</p>
        <a
          href={`${process.env.REACT_APP_API_URL}/${cvFile.path}`}
          download={cvFile.originalName}
          className="download-btn"
        >
          Download CV
        </a>
      </div>
    );
  };

  return (
    <div className="cv-viewer-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>CV Viewer</h2>
          <div className="header-actions">
            <a
              href={cvFile ? `${process.env.REACT_APP_API_URL}/${cvFile.path}` : '#'}
              download={cvFile?.originalName}
              className="download-link"
            >
              ⬇️ Download
            </a>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CVViewer;

