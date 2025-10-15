import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

const FooterBottom = () => {
  const { language, changeLanguage } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  const legalLinks = [
    { name: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' }, url: '/privacy-policy' },
    { name: { en: 'Terms of Service', ar: 'شروط الخدمة' }, url: '/terms-of-service' },
    { name: { en: 'Cookie Policy', ar: 'سياسة ملفات تعريف الارتباط' }, url: '/cookie-policy' },
    { name: { en: 'Data Protection', ar: 'حماية البيانات' }, url: '/data-protection' },
    { name: { en: 'Careers', ar: 'الوظائف' }, url: '/careers' },
    { name: { en: 'Sitemap', ar: 'خريطة الموقع' }, url: '/sitemap' }
  ];

  const quickActions = [
    { name: { en: 'Job Application', ar: 'طلب وظيفة' }, url: '/job-application', icon: 'assignment' },
    { name: { en: 'Client Portal', ar: 'بوابة العملاء' }, url: '/client-portal', icon: 'business' },
    { name: { en: 'Employee Portal', ar: 'بوابة الموظفين' }, url: '/employee-portal', icon: 'person' },
    { name: { en: 'Complaint Form', ar: 'نموذج الشكوى' }, url: '/complaint-form', icon: 'report' }
  ];

  return (
    <div className={styles.footerBottom}>
      <div className="container">
        <div className={styles.bottomContent}>
          {/* Main Bottom Section */}
          <div className={styles.bottomMain}>
            {/* Copyright */}
            <div className={styles.copyright}>
              <p className={styles.copyrightText}>
                © {currentYear} {' '}
                {language === 'en' 
                  ? 'Manpower Supply Company. All rights reserved.' 
                  : 'شركة توريد القوى العاملة. جميع الحقوق محفوظة.'
                }
              </p>
              <p className={styles.companyDetails}>
                {language === 'en'
                  ? 'Commercial Registration: 1010123456 | Tax Number: 300123456789003'
                  : 'السجل التجاري: 1010123456 | الرقم الضريبي: 300123456789003'
                }
              </p>
            </div>

            {/* Legal Links */}
            <div className={styles.legalLinks}>
              {legalLinks.map((link, index) => (
                <React.Fragment key={index}>
                  <Link to={link.url} className={styles.legalLink}>
                    {link.name[language]}
                  </Link>
                  {index < legalLinks.length - 1 && <span className={styles.separator}>|</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Additional Info */}
            <div className={styles.additionalInfo}>
              <div className={styles.certifications}>
                <span className={styles.certBadge}>
                  {language === 'en' ? 'ISO 9001:2015 Certified' : 'معتمد ISO 9001:2015'}
                </span>
                <span className={styles.separator}>- </span>
                <span className={styles.certBadge}>
                  {language === 'en' ? 'Ministry of Labor Approved' : 'معتمد من وزارة العمل'}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Bottom Section */}
          <div className={styles.bottomSecondary}>
            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <h4 className={styles.actionsTitle}>
                {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
              </h4>
              <div className={styles.actionsList}>
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.url} className={styles.actionLink}>
                    <span className="material-icons">{action.icon}</span>
                    <span>{action.name[language]}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className={styles.languageSelector}>
              <h4 className={styles.languageTitle}>
                {language === 'en' ? 'Language' : 'اللغة'}
              </h4>
              <div className={styles.languageButtons}>
                <button 
                  className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  <span className="material-icons">language</span>
                  English
                </button>
                <span className={styles.separator}>|</span>
                <button 
                  className={`${styles.langBtn} ${language === 'ar' ? styles.active : ''}`}
                  onClick={() => changeLanguage('ar')}
                >
                  <span className="material-icons">language</span>
                  العربية
                </button>
              </div>
            </div>

            {/* Back to Top */}
            <div className={styles.backToTop}>
              <button 
                className={styles.backToTopBtn}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title={language === 'en' ? 'Back to Top' : 'العودة إلى الأعلى'}
              >
                <span className="material-icons">keyboard_arrow_up</span>
                <span className={styles.backToTopText}>
                  {language === 'en' ? 'Back to Top' : 'العودة للأعلى'}
                </span>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className={styles.securityNotice}>
            <div className={styles.securityContent}>
              <span className="material-icons">security</span>
              <div className={styles.securityText}>
                <strong>{language === 'en' ? 'Secure & Protected' : 'آمن ومحمي'}</strong>
                <span>
                  {language === 'en' 
                    ? 'Your data is protected with industry-standard encryption'
                    : 'بياناتك محمية بتشفير معياري للصناعة'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Development Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className={styles.devInfo}>
              <p className={styles.devText}>
                Development Mode | Version 1.0.0 | Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
