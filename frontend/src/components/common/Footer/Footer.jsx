import React from 'react';
import SocialLinks from './SocialLinks';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './Footer.module.css';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>{t('footer.company.name')}</h3>
            <p>{t('footer.company.description')}</p>
          </div>
          
          <div className={styles.section}>
            <h4>{t('footer.quickLinks.title')}</h4>
            <ul>
              <li><a href="/">{t('navigation.home')}</a></li>
              <li><a href="/about">{t('navigation.about')}</a></li>
              <li><a href="/services">{t('navigation.services')}</a></li>
              <li><a href="/contact">{t('navigation.contact')}</a></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4>{t('footer.contact.title')}</h4>
            <p>{t('footer.contact.email')}</p>
            <p>{t('footer.contact.phone')}</p>
            <p>{t('footer.contact.address')}</p>
            <p>{t('footer.contact.branches')}</p>
          </div>
          
          <div className={styles.section}>
            <h4>{t('footer.social.title')}</h4>
            <SocialLinks />
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; 2024 Saudi Manpower Supply Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

