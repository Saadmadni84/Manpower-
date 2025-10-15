import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or detect browser language
    const savedLanguage = localStorage.getItem('manpower-language');
    if (savedLanguage) {
      return savedLanguage;
    }
    
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ar')) {
      return 'ar';
    }
    return 'en';
  });

  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const [commonTranslations, navigationTranslations, homeTranslations, aboutTranslations, servicesTranslations, clientsTranslations, careersTranslations, galleryTranslations, contactTranslations, adminTranslations] = await Promise.all([
          import(`../locales/${language}/common.json`),
          import(`../locales/${language}/navigation.json`),
          import(`../locales/${language}/home.json`),
          import(`../locales/${language}/about.json`),
          import(`../locales/${language}/services.json`),
          import(`../locales/${language}/clients.json`),
          import(`../locales/${language}/careers.json`),
          import(`../locales/${language}/gallery.json`),
          import(`../locales/${language}/contact.json`),
          import(`../locales/${language}/admin.json`)
        ]);

        setTranslations({
          common: commonTranslations.default,
          navigation: navigationTranslations.default,
          home: homeTranslations.default,
          about: aboutTranslations.default,
          services: servicesTranslations.default,
          clients: clientsTranslations.default,
          careers: careersTranslations.default,
          gallery: galleryTranslations.default,
          contact: contactTranslations.default,
          admin: adminTranslations.default
        });
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if translation files are missing
        if (language !== 'en') {
          setLanguage('en');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // Update document attributes when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = language === 'ar' ? 'rtl' : 'ltr';
    
    // Update page title based on language
    const titleElement = document.querySelector('title');
    if (titleElement) {
      const baseTitle = 'Saudi Manpower';
      titleElement.textContent = language === 'ar' ? `شركة القوى العاملة السعودية - ${baseTitle}` : `${baseTitle} - Leading Workforce Solutions`;
    }
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
      localStorage.setItem('manpower-language', newLanguage);
    }
  };

  const t = (key, fallback = '') => {
    if (isLoading) return fallback;
    
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return value || fallback || key;
  };

  const isRTL = language === 'ar';
  const isArabic = language === 'ar';
  const isEnglish = language === 'en';

  const value = {
    language,
    setLanguage: changeLanguage,
    translations,
    isLoading,
    t,
    isRTL,
    isArabic,
    isEnglish,
    toggleLanguage: () => changeLanguage(language === 'en' ? 'ar' : 'en')
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;