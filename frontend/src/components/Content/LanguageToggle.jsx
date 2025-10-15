import React from 'react';
import './LanguageToggle.css';

const LanguageToggle = ({ currentLanguage, onChange }) => {
  return (
    <div className="language-toggle">
      <button
        className={`language-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => onChange('en')}
      >
        <span className="flag-icon">🇬🇧</span>
        <span className="language-text">English</span>
      </button>
      <button
        className={`language-btn ${currentLanguage === 'ar' ? 'active' : ''}`}
        onClick={() => onChange('ar')}
      >
        <span className="flag-icon">🇸🇦</span>
        <span className="language-text">العربية</span>
      </button>
    </div>
  );
};

export default LanguageToggle;
