import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

const FooterCompanyInfo = ({ content }) => {
  const { language } = useLanguage();
  
  // Fallback content if API data is not available
  const fallbackContent = {
    en: {
      name: 'Saudi Manpower',
      tagline: 'Leading Workforce Solutions',
      description: 'Leading manpower supply company in Saudi Arabia with 25+ years of experience providing quality workforce solutions across multiple industries.',
      mission: 'To provide exceptional workforce solutions that empower businesses and create meaningful career opportunities.',
      stats: { experience: '25+', employees: '10,000+', regions: '4' },
      certifications: [
        { name: 'ISO 9001:2015', image: '/assets/iso-certification.png' },
        { name: 'Ministry Approved', image: '/assets/saudi-ministry-logo.png' }
      ]
    },
    ar: {
      name: 'القوى العاملة السعودية',
      tagline: 'حلول القوى العاملة الرائدة',
      description: 'شركة رائدة في توريد القوى العاملة في المملكة العربية السعودية مع أكثر من 25 سنة من الخبرة في توفير حلول القوى العاملة عالية الجودة عبر صناعات متعددة.',
      mission: 'تقديم حلول استثنائية للقوى العاملة تمكن الشركات وتخلق فرص عمل هادفة.',
      stats: { experience: '25+', employees: '10,000+', regions: '4' },
      certifications: [
        { name: 'ISO 9001:2015', image: '/assets/iso-certification.png' },
        { name: 'معتمد من الوزارة', image: '/assets/saudi-ministry-logo.png' }
      ]
    }
  };

  const displayContent = content || fallbackContent;

  return (
    <div className={styles.footerColumn}>
      <div className={styles.companyInfo}>
        {/* Company Logo */}
        <div className={styles.companyLogo}>
          <img 
            src="/assets/logo-white.png" 
            alt={language === 'en' ? 'Manpower Supply Company' : 'شركة توريد القوى العاملة'} 
            className={styles.logoImage}
          />
          <div className={styles.logoText}>
            <h3 className={styles.companyName}>
              {displayContent[language]?.name || displayContent.en.name}
            </h3>
            <p className={styles.companyTagline}>
              {displayContent[language]?.tagline || displayContent.en.tagline}
            </p>
          </div>
        </div>
        
        {/* Company Description */}
        <p className={styles.companyDescription}>
          {displayContent[language]?.description || displayContent.en.description}
        </p>
        
        {/* Key Stats */}
        <div className={styles.companyStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{displayContent[language]?.stats?.experience || displayContent.en.stats.experience}</span>
            <span className={styles.statLabel}>
              {language === 'en' ? 'Years Experience' : 'سنة خبرة'}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{displayContent[language]?.stats?.employees || displayContent.en.stats.employees}</span>
            <span className={styles.statLabel}>
              {language === 'en' ? 'Employees' : 'موظف'}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{displayContent[language]?.stats?.regions || displayContent.en.stats.regions}</span>
            <span className={styles.statLabel}>
              {language === 'en' ? 'Regions' : 'مناطق'}
            </span>
          </div>
        </div>

        {/* Certifications/Awards */}
        <div className={styles.certifications}>
          {(displayContent[language]?.certifications || displayContent.en.certifications || []).map((cert, index) => (
            <div key={index} className={styles.certItem}>
              <img 
                src={cert.image} 
                alt={cert.name} 
                className={styles.certImage}
              />
              <span className={styles.certText}>
                {cert.name}
              </span>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className={styles.missionStatement}>
          <h4 className={styles.missionTitle}>
            {language === 'en' ? 'Our Mission' : 'مهمتنا'}
          </h4>
          <p className={styles.missionText}>
            {displayContent[language]?.mission || displayContent.en.mission}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterCompanyInfo;
