import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

const FooterServices = () => {
  const { language } = useLanguage();

  const services = [
    { 
      name: { en: 'Airport Operations', ar: 'عمليات المطار' }, 
      url: '/services/airport', 
      icon: 'flight',
      description: { 
        en: 'Ground handling, security, customer service', 
        ar: 'التعامل مع الأرض والأمن وخدمة العملاء' 
      }
    },
    { 
      name: { en: 'Corporate Services', ar: 'الخدمات المؤسسية' }, 
      url: '/services/corporate', 
      icon: 'business_center',
      description: { 
        en: 'Administrative, HR, management professionals', 
        ar: 'محترفون إداريون وموارد بشرية وإدارة' 
      }
    },
    { 
      name: { en: 'Catering Services', ar: 'خدمات الضيافة' }, 
      url: '/services/catering', 
      icon: 'restaurant',
      description: { 
        en: 'Chefs, kitchen staff, food service', 
        ar: 'طهاة وموظفو مطبخ وخدمة الطعام' 
      }
    },
    { 
      name: { en: 'Logistics & Warehousing', ar: 'اللوجستيات والمستودعات' }, 
      url: '/services/logistics', 
      icon: 'local_shipping',
      description: { 
        en: 'Warehouse staff, drivers, supply chain', 
        ar: 'موظفو مستودعات وسائقون وسلسلة توريد' 
      }
    },
    { 
      name: { en: 'Construction', ar: 'الإنشاءات' }, 
      url: '/services/construction', 
      icon: 'construction',
      description: { 
        en: 'Engineers, technicians, construction workers', 
        ar: 'مهندسون وفنيون وعمال بناء' 
      }
    },
    { 
      name: { en: 'Facility Management', ar: 'إدارة المرافق' }, 
      url: '/services/facility', 
      icon: 'build',
      description: { 
        en: 'Maintenance, cleaning, security personnel', 
        ar: 'صيانة وتنظيف وموظفو أمن' 
      }
    }
  ];

  return (
    <div className={styles.footerColumn}>
      <div className={styles.services}>
        <h3 className={styles.footerHeading}>
          {language === 'en' ? 'Our Services' : 'خدماتنا'}
        </h3>
        <ul className={styles.servicesList}>
          {services.map((service, index) => (
            <li key={index} className={styles.serviceItem}>
              <Link to={service.url} className={styles.serviceLink}>
                <span className={`material-icons ${styles.serviceIcon}`}>
                  {service.icon}
                </span>
                <div className={styles.serviceInfo}>
                  <span className={styles.serviceName}>
                    {service.name[language]}
                  </span>
                  <span className={styles.serviceDescription}>
                    {service.description[language]}
                  </span>
                </div>
                <span className={styles.serviceArrow}>
                  {language === 'ar' ? '←' : '→'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* View All Services Button */}
        <Link to="/services" className={styles.viewAllBtn}>
          <span className={styles.viewAllText}>
            {language === 'en' ? 'View All Services' : 'عرض جميع الخدمات'}
          </span>
          <span className="material-icons">arrow_forward</span>
        </Link>

        {/* Service Highlights */}
        <div className={styles.serviceHighlights}>
          <h4 className={styles.highlightsTitle}>
            {language === 'en' ? 'Service Highlights' : 'نقاط بارزة في الخدمات'}
          </h4>
          <div className={styles.highlightsList}>
            <div className={styles.highlightItem}>
              <span className="material-icons">verified</span>
              <span>{language === 'en' ? 'Licensed & Certified' : 'مرخص ومعتمد'}</span>
            </div>
            <div className={styles.highlightItem}>
              <span className="material-icons">schedule</span>
              <span>{language === 'en' ? '24/7 Support' : 'دعم 24/7'}</span>
            </div>
            <div className={styles.highlightItem}>
              <span className="material-icons">group</span>
              <span>{language === 'en' ? 'Skilled Professionals' : 'محترفون مهرة'}</span>
            </div>
            <div className={styles.highlightItem}>
              <span className="material-icons">speed</span>
              <span>{language === 'en' ? 'Quick Deployment' : 'نشر سريع'}</span>
            </div>
          </div>
        </div>

        {/* Industry Coverage */}
        <div className={styles.industryCoverage}>
          <h4 className={styles.coverageTitle}>
            {language === 'en' ? 'Industry Coverage' : 'التغطية الصناعية'}
          </h4>
          <div className={styles.industryTags}>
            <span className={styles.industryTag}>Aviation</span>
            <span className={styles.industryTag}>Healthcare</span>
            <span className={styles.industryTag}>Hospitality</span>
            <span className={styles.industryTag}>Manufacturing</span>
            <span className={styles.industryTag}>Construction</span>
            <span className={styles.industryTag}>Retail</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterServices;
