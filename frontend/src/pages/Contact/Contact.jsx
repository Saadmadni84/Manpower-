import React from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
import ContactForm from '../../components/forms/ContactForm/ContactForm';
import ContactInfo from './components/ContactInfo';
import MapComponent from './components/MapComponent';
import OfficeLocations from './components/OfficeLocations';
import SEOHead from '../../components/common/SEOHead/SEOHead';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Contact.module.css';

const Contact = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <MainLayout>
      <SEOHead 
        title="Contact Us - Manpower Company"
        description="Get in touch with us for your manpower needs. We're here to help you find the right talent."
      />
      <div className={styles.contact}>
        <div className="container">
          <h1 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2.5rem', color: '#2c3e50' }}>
            {t('contact.title')}
          </h1>
          
          <div className={styles.content}>
            <div className={styles.formSection}>
              <ContactForm />
            </div>
            
            <div className={styles.infoSection}>
              <ContactInfo />
              <OfficeLocations />
            </div>
          </div>
          
          <div className={styles.mapSection}>
            <MapComponent />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;

