import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './LanguageToggle.module.css';

const LanguageToggle = () => {
  const { language, toggleLanguage, isRTL, t } = useLanguage();

  const handleToggle = () => {
    console.log('Language toggle clicked, current language:', language);
    toggleLanguage();
  };

  return (
    <div className={styles.languageToggle}>
      <button 
        onClick={handleToggle}
        className={`${styles.toggleButton} ${isRTL ? styles.rtl : styles.ltr}`}
        aria-label={t('navigation.language')}
        title={t('navigation.language')}
      >
        <span className={styles.flag}>
          {language === 'en' ? '🇺🇸' : '🇸🇦'}
        </span>
        <span className={styles.languageText}>
          {language === 'en' ? t('navigation.arabic') : t('navigation.english')}
        </span>
        <span className={styles.arrow}>
          {isRTL ? '←' : '→'}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;

