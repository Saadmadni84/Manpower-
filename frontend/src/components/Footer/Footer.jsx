import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useFooter } from '../../hooks/useFooter';
import FooterCompanyInfo from './FooterCompanyInfo';
import FooterQuickLinks from './FooterQuickLinks';
import FooterServices from './FooterServices';
import FooterContact from './FooterContact';
import FooterNewsletter from './FooterNewsletter';
import FooterSocialMedia from './FooterSocialMedia';
import FooterBottom from './FooterBottom';
import styles from './Footer.module.css';

const Footer = () => {
  const { language } = useLanguage();
  const { footerContent, loading, error } = useFooter();

  // Show loading state
  if (loading) {
    return (
      <footer className={`${styles.footerMain} ${language === 'ar' ? styles.rtl : styles.ltr}`}>
        <div className={styles.footerContent}>
          <div className="container">
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading footer content...</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Show error state
  if (error) {
    console.error('Footer API Error:', error);
    // Fallback to static footer content
    return (
      <footer className={`${styles.footerMain} ${language === 'ar' ? styles.rtl : styles.ltr}`}>
        <div className={styles.footerContent}>
          <div className="container">
            <div className={styles.errorContainer}>
              <p>Footer content unavailable</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`${styles.footerMain} ${language === 'ar' ? styles.rtl : styles.ltr}`}>
      {/* Top Section - Main Content */}
      <div className={styles.footerContent}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Column 1 - Company Information */}
            <FooterCompanyInfo content={footerContent.company_info} />
            
            {/* Column 2 - Quick Links */}
            <FooterQuickLinks content={footerContent.quick_links} />
            
            {/* Column 3 - Our Services */}
            <FooterServices content={footerContent.services} />
            
            {/* Column 4 - Contact Information */}
            <FooterContact content={footerContent.contact} />
            
            {/* Column 5 - Newsletter Signup */}
            <FooterNewsletter content={footerContent.newsletter} />
          </div>
        </div>
      </div>

      {/* Social Media Bar */}
      <FooterSocialMedia content={footerContent.social_media} />

      {/* Bottom Section - Copyright & Legal */}
      <FooterBottom content={footerContent.legal} />
    </footer>
  );
};

export default Footer;
