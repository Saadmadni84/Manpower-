import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNewsletter } from '../../hooks/useNewsletter';
import styles from './Footer.module.css';

const FooterNewsletter = () => {
  const { language } = useLanguage();
  const { loading, message, error, subscribe, clearMessages } = useNewsletter();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    preferences: {
      jobAlerts: true,
      companyNews: true,
      industryUpdates: false
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const preferenceKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [preferenceKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      await subscribe({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        preferences: formData.preferences,
        source: 'footer'
      });

      // Reset form on success
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        preferences: {
          jobAlerts: true,
          companyNews: true,
          industryUpdates: false
        }
      });
    } catch (err) {
      // Error is handled by the hook
      console.error('Newsletter subscription error:', err);
    }
  };

  return (
    <div className={styles.footerColumn}>
      <div className={styles.newsletter}>
        <h3 className={styles.footerHeading}>
          {language === 'en' ? 'Stay Updated' : 'ابق محدثاً'}
        </h3>
        
        <p className={styles.newsletterDescription}>
          {language === 'en' 
            ? 'Subscribe to our newsletter for the latest job opportunities, company news, and industry insights.'
            : 'اشترك في نشرتنا الإخبارية للحصول على أحدث فرص العمل وأخبار الشركة ورؤى الصناعة.'
          }
        </p>

        <form onSubmit={handleSubmit} className={styles.newsletterForm}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'}
                className={styles.newsletterInput}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'First Name (Optional)' : 'الاسم الأول (اختياري)'}
                className={styles.newsletterInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'Last Name (Optional)' : 'الاسم الأخير (اختياري)'}
                className={styles.newsletterInput}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className={styles.preferencesSection}>
            <h4 className={styles.preferencesTitle}>
              {language === 'en' ? 'Email Preferences' : 'تفضيلات البريد الإلكتروني'}
            </h4>
            <div className={styles.preferencesList}>
              <label className={styles.preferenceItem}>
                <input
                  type="checkbox"
                  name="preferences.jobAlerts"
                  checked={formData.preferences.jobAlerts}
                  onChange={handleInputChange}
                  className={styles.preferenceCheckbox}
                />
                <span className={styles.preferenceText}>
                  {language === 'en' ? 'Job Alerts' : 'تنبيهات الوظائف'}
                </span>
              </label>
              
              <label className={styles.preferenceItem}>
                <input
                  type="checkbox"
                  name="preferences.companyNews"
                  checked={formData.preferences.companyNews}
                  onChange={handleInputChange}
                  className={styles.preferenceCheckbox}
                />
                <span className={styles.preferenceText}>
                  {language === 'en' ? 'Company News' : 'أخبار الشركة'}
                </span>
              </label>
              
              <label className={styles.preferenceItem}>
                <input
                  type="checkbox"
                  name="preferences.industryUpdates"
                  checked={formData.preferences.industryUpdates}
                  onChange={handleInputChange}
                  className={styles.preferenceCheckbox}
                />
                <span className={styles.preferenceText}>
                  {language === 'en' ? 'Industry Updates' : 'تحديثات الصناعة'}
                </span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.subscribeButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                {language === 'en' ? 'Subscribing...' : 'جاري الاشتراك...'}
              </>
            ) : (
              <>
                <span className="material-icons">send</span>
                {language === 'en' ? 'Subscribe Now' : 'اشترك الآن'}
              </>
            )}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div className={styles.successMessage}>
            <span className="material-icons">check_circle</span>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            <span className="material-icons">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Benefits */}
        <div className={styles.newsletterBenefits}>
          <h4 className={styles.benefitsTitle}>
            {language === 'en' ? 'What You\'ll Get:' : 'ما ستحصل عليه:'}
          </h4>
          <ul className={styles.benefitsList}>
            <li className={styles.benefitItem}>
              <span className="material-icons">notifications</span>
              <span>{language === 'en' ? 'Latest job openings' : 'أحدث الوظائف الشاغرة'}</span>
            </li>
            <li className={styles.benefitItem}>
              <span className="material-icons">trending_up</span>
              <span>{language === 'en' ? 'Industry insights' : 'رؤى الصناعة'}</span>
            </li>
            <li className={styles.benefitItem}>
              <span className="material-icons">event</span>
              <span>{language === 'en' ? 'Company events' : 'أحداث الشركة'}</span>
            </li>
            <li className={styles.benefitItem}>
              <span className="material-icons">security</span>
              <span>{language === 'en' ? 'Privacy protected' : 'محمي الخصوصية'}</span>
            </li>
          </ul>
        </div>

        {/* Privacy Notice */}
        <div className={styles.privacyNotice}>
          <p className={styles.privacyText}>
            {language === 'en' 
              ? 'We respect your privacy. Unsubscribe at any time.'
              : 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.'
            }
          </p>
          <a href="/privacy-policy" className={styles.privacyLink}>
            {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterNewsletter;
