import React, { useState } from 'react';
import './ImageEditor.css';

/**
 * Basic Image Editor Component
 * This is a placeholder for basic image editing functionality
 * For production use, consider integrating libraries like:
 * - react-image-crop
 * - react-easy-crop
 * - tui-image-editor
 * - konva/react-konva
 */
const ImageEditor = ({ image, onSave, onClose }) => {
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [filter, setFilter] = useState('none');

  const filters = {
    none: '',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    blur: 'blur(2px)',
    vintage: 'sepia(50%) contrast(120%) brightness(90%)',
    cool: 'saturate(150%) hue-rotate(180deg)',
    warm: 'saturate(150%) hue-rotate(-15deg)'
  };

  const handleSave = () => {
    const edits = {
      rotation,
      brightness,
      contrast,
      filter
    };
    onSave(edits);
  };

  const handleReset = () => {
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setFilter('none');
  };

  const getImageStyle = () => {
    return {
      transform: `rotate(${rotation}deg)`,
      filter: `brightness(${brightness}%) contrast(${contrast}%) ${filters[filter]}`
    };
  };

  return (
    <div className="image-editor-modal">
      <div className="editor-header">
        <h2>Image Editor</h2>
        <button type="button" onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>

      <div className="editor-content">
        <div className="preview-section">
          <div className="preview-container">
            <img 
              src={image.image} 
              alt={image.title?.en || 'Image'}
              className="preview-image"
              style={getImageStyle()}
            />
          </div>
        </div>

        <div className="controls-section">
          <div className="control-group">
            <h3>Rotation</h3>
            <div className="rotation-buttons">
              <button onClick={() => setRotation(r => r - 90)}>
                ↶ -90°
              </button>
              <button onClick={() => setRotation(r => r + 90)}>
                ↷ +90°
              </button>
              <button onClick={() => setRotation(0)}>
                Reset
              </button>
            </div>
            <div className="value-display">{rotation}°</div>
          </div>

          <div className="control-group">
            <h3>Brightness</h3>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(e.target.value)}
            />
            <div className="value-display">{brightness}%</div>
          </div>

          <div className="control-group">
            <h3>Contrast</h3>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(e.target.value)}
            />
            <div className="value-display">{contrast}%</div>
          </div>

          <div className="control-group">
            <h3>Filters</h3>
            <div className="filter-buttons">
              {Object.keys(filters).map(filterName => (
                <button
                  key={filterName}
                  className={filter === filterName ? 'active' : ''}
                  onClick={() => setFilter(filterName)}
                >
                  {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="editor-note">
            <p><strong>Note:</strong> This is a basic preview editor. Changes are cosmetic only. For advanced editing features like cropping, resizing, and saving edited versions, please integrate a dedicated image editing library.</p>
          </div>
        </div>
      </div>

      <div className="editor-actions">
        <button onClick={handleReset} className="reset-btn">
          Reset All
        </button>
        <div className="action-buttons">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleSave} className="save-btn">
            Apply Edits
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;

