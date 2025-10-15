import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

const FooterContact = ({ content }) => {
  const { language } = useLanguage();
  
  // Fallback content if API data is not available
  const fallbackContent = {
    en: {
      addresses: [
        { type: 'Head Office', address: 'King Fahd Road, Al Olaya District, Riyadh 12213, Saudi Arabia', isPrimary: true },
        { type: 'Jeddah Branch', address: 'Prince Sultan Road, Al Rawdah District, Jeddah 23432' },
        { type: 'Dammam Branch', address: 'King Abdulaziz Road, Al Faisaliyah District, Dammam 32414' }
      ],
      phones: [
        { number: '+966 11 123 4567', type: 'Main', icon: 'phone' },
        { number: '+966 11 123 4568', type: 'HR Department', icon: 'phone' },
        { number: '+966 50 123 4569', type: 'WhatsApp', icon: 'whatsapp', isWhatsApp: true }
      ],
      emails: [
        { email: 'info@manpowercompany.sa', type: 'General', icon: 'email' },
        { email: 'careers@manpowercompany.sa', type: 'Careers', icon: 'work' },
        { email: 'support@manpowercompany.sa', type: 'Support', icon: 'support' }
      ],
      workingHours: [
        { day: 'Sunday - Thursday', time: '8:00 AM - 5:00 PM' },
        { day: 'Friday', time: 'Closed' },
        { day: 'Saturday', time: '9:00 AM - 2:00 PM' }
      ],
      emergency: { number: '+966 50 123 4569', available: '24/7 Available' }
    },
    ar: {
      addresses: [
        { type: 'المكتب الرئيسي', address: 'طريق الملك فهد، حي العليا، الرياض 12213، المملكة العربية السعودية', isPrimary: true },
        { type: 'فرع جدة', address: 'طريق الأمير سلطان، حي الروضة، جدة 23432' },
        { type: 'فرع الدمام', address: 'طريق الملك عبدالعزيز، حي الفيصلية، الدمام 32414' }
      ],
      phones: [
        { number: '+966 11 123 4567', type: 'الرئيسي', icon: 'phone' },
        { number: '+966 11 123 4568', type: 'قسم الموارد البشرية', icon: 'phone' },
        { number: '+966 50 123 4569', type: 'واتساب', icon: 'whatsapp', isWhatsApp: true }
      ],
      emails: [
        { email: 'info@manpowercompany.sa', type: 'عام', icon: 'email' },
        { email: 'careers@manpowercompany.sa', type: 'الوظائف', icon: 'work' },
        { email: 'support@manpowercompany.sa', type: 'الدعم', icon: 'support' }
      ],
      workingHours: [
        { day: 'الأحد - الخميس', time: '8:00 ص - 5:00 م' },
        { day: 'الجمعة', time: 'مغلق' },
        { day: 'السبت', time: '9:00 ص - 2:00 م' }
      ],
      emergency: { number: '+966 50 123 4569', available: 'متاح 24/7' }
    }
  };

  const displayContent = content || fallbackContent;

  const contactInfo = displayContent[language] || displayContent.en;

  return (
    <div className={styles.footerColumn}>
      <div className={styles.contactInfo}>
        <h3 className={styles.footerHeading}>
          {language === 'en' ? 'Contact Information' : 'معلومات الاتصال'}
        </h3>
        
        {/* Office Addresses */}
        <div className={styles.contactSection}>
          <h4 className={styles.contactSectionTitle}>
            {language === 'en' ? 'Our Offices' : 'مكاتبنا'}
          </h4>
          <div className={styles.addressesList}>
            {contactInfo.addresses.map((office, index) => (
              <div key={index} className={`${styles.addressItem} ${office.isPrimary ? styles.primary : ''}`}>
                <span className={`material-icons ${styles.addressIcon}`}>location_on</span>
                <div className={styles.addressDetails}>
                  <strong className={styles.officeType}>{office.type}</strong>
                  <p className={styles.addressText}>{office.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone Numbers */}
        <div className={styles.contactSection}>
          <h4 className={styles.contactSectionTitle}>
            {language === 'en' ? 'Phone Numbers' : 'أرقام الهاتف'}
          </h4>
          <div className={styles.phonesList}>
            {contactInfo.phones.map((phone, index) => (
              <div key={index} className={styles.contactItem}>
                <span className={`material-icons ${styles.contactIcon}`}>{phone.icon}</span>
                <div className={styles.contactDetails}>
                  <a href={`tel:${phone.number}`} className={styles.contactLink}>
                    {phone.number}
                  </a>
                  <span className={styles.contactType}>{phone.type}</span>
                </div>
                {phone.isWhatsApp && (
                  <a 
                    href={`https://wa.me/${phone.number.replace(/\D/g, '')}`}
                    className={styles.whatsappBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={language === 'en' ? 'Chat on WhatsApp' : 'تحدث عبر واتساب'}
                  >
                    <span className="material-icons">message</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Email Addresses */}
        <div className={styles.contactSection}>
          <h4 className={styles.contactSectionTitle}>
            {language === 'en' ? 'Email Addresses' : 'عناوين البريد الإلكتروني'}
          </h4>
          <div className={styles.emailsList}>
            {contactInfo.emails.map((email, index) => (
              <div key={index} className={styles.contactItem}>
                <span className={`material-icons ${styles.contactIcon}`}>{email.icon}</span>
                <div className={styles.contactDetails}>
                  <a href={`mailto:${email.email}`} className={styles.contactLink}>
                    {email.email}
                  </a>
                  <span className={styles.contactType}>{email.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className={styles.contactSection}>
          <h4 className={styles.contactSectionTitle}>
            {language === 'en' ? 'Working Hours' : 'ساعات العمل'}
          </h4>
          <div className={styles.workingHours}>
            <div className={styles.hoursItem}>
              <span className={styles.hoursDay}>
                {language === 'en' ? 'Sunday - Thursday' : 'الأحد - الخميس'}
              </span>
              <span className={styles.hoursTime}>8:00 AM - 5:00 PM</span>
            </div>
            <div className={styles.hoursItem}>
              <span className={styles.hoursDay}>
                {language === 'en' ? 'Friday' : 'الجمعة'}
              </span>
              <span className={styles.hoursTime}>
                {language === 'en' ? 'Closed' : 'مغلق'}
              </span>
            </div>
            <div className={styles.hoursItem}>
              <span className={styles.hoursDay}>
                {language === 'en' ? 'Saturday' : 'السبت'}
              </span>
              <span className={styles.hoursTime}>9:00 AM - 2:00 PM</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className={styles.emergencySection}>
          <h4 className={styles.emergencyTitle}>
            {language === 'en' ? 'Emergency Contact' : 'الاتصال الطارئ'}
          </h4>
          <div className={styles.emergencyInfo}>
            <span className="material-icons">emergency</span>
            <div className={styles.emergencyDetails}>
              <strong>+966 50 123 4569</strong>
              <span>{language === 'en' ? '24/7 Available' : 'متاح 24/7'}</span>
            </div>
          </div>
        </div>

        {/* Contact Form CTA */}
        <div className={styles.contactCTA}>
          <p className={styles.ctaText}>
            {language === 'en' 
              ? 'Need immediate assistance?' 
              : 'تحتاج مساعدة فورية؟'
            }
          </p>
          <a href="/contact" className={styles.ctaButton}>
            <span className="material-icons">send</span>
            <span>{language === 'en' ? 'Contact Us Now' : 'اتصل بنا الآن'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterContact;
