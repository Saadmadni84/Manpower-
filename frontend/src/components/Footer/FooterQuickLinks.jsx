import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

const FooterQuickLinks = ({ content }) => {
  const { language } = useLanguage();
  
  // Fallback content if API data is not available
  const fallbackContent = {
    en: [
      { name: 'Home', url: '/', icon: 'home' },
      { name: 'About Us', url: '/about', icon: 'info' },
      { name: 'Our Services', url: '/services', icon: 'build' },
      { name: 'Career Opportunities', url: '/careers', icon: 'work' },
      { name: 'Our Clients', url: '/clients', icon: 'business' },
      { name: 'Contact Us', url: '/contact', icon: 'contact_mail' },
      { name: 'Gallery', url: '/gallery', icon: 'photo_library' },
      { name: 'Blog & News', url: '/blog', icon: 'article' }
    ],
    ar: [
      { name: 'الرئيسية', url: '/', icon: 'home' },
      { name: 'من نحن', url: '/about', icon: 'info' },
      { name: 'خدماتنا', url: '/services', icon: 'build' },
      { name: 'الوظائف', url: '/careers', icon: 'work' },
      { name: 'عملاؤنا', url: '/clients', icon: 'business' },
      { name: 'اتصل بنا', url: '/contact', icon: 'contact_mail' },
      { name: 'المعرض', url: '/gallery', icon: 'photo_library' },
      { name: 'الأخبار', url: '/blog', icon: 'article' }
    ]
  };

  const displayContent = content || fallbackContent;

  const quickLinks = displayContent[language] || displayContent.en || [];

  return (
    <div className={styles.footerColumn}>
      <div className={styles.quickLinks}>
        <h3 className={styles.footerHeading}>
          {language === 'en' ? 'Quick Links' : 'روابط سريعة'}
        </h3>
        <ul className={styles.linksList}>
          {quickLinks.map((link, index) => (
            <li key={index} className={styles.linkItem}>
              <Link to={link.url} className={styles.footerLink}>
                <span className={`material-icons ${styles.linkIcon}`}>
                  {link.icon}
                </span>
                <span className={styles.linkText}>
                  {link.name}
                </span>
                <span className={styles.linkArrow}>
                  {language === 'ar' ? '←' : '→'}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Additional Quick Actions */}
        <div className={styles.quickActions}>
          <h4 className={styles.actionsTitle}>
            {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
          </h4>
          <div className={styles.actionButtons}>
            <Link to="/job-application" className={styles.actionButton}>
              <span className="material-icons">assignment</span>
              <span>{language === 'en' ? 'Apply for Job' : 'تقدم للوظيفة'}</span>
            </Link>
            <Link to="/client-portal" className={styles.actionButton}>
              <span className="material-icons">business</span>
              <span>{language === 'en' ? 'Client Portal' : 'بوابة العملاء'}</span>
            </Link>
            <Link to="/employee-portal" className={styles.actionButton}>
              <span className="material-icons">person</span>
              <span>{language === 'en' ? 'Employee Portal' : 'بوابة الموظفين'}</span>
            </Link>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className={styles.emergencyContact}>
          <h4 className={styles.emergencyTitle}>
            {language === 'en' ? 'Emergency Contact' : 'الاتصال الطارئ'}
          </h4>
          <div className={styles.emergencyInfo}>
            <span className="material-icons">emergency</span>
            <div className={styles.emergencyDetails}>
              <strong>+966 50 123 4569</strong>
              <span>{language === 'en' ? '24/7 Support' : 'دعم 24/7'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterQuickLinks;
