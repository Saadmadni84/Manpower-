import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import LanguageToggle from '../../common/Header/LanguageToggle';
import styles from './SmartNavigation.module.css';

const SmartNavigation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolling, setIsScrolling] = useState(false);

  const navItems = [
    { id: 'home', label: t('navigation.home'), path: '/'},
    { id: 'about', label: t('navigation.about'), path: '/about' },
    { id: 'services', label: t('navigation.services'), path: '/services' },
    { id: 'clients', label: t('navigation.clients'), path: '/clients' },
    { id: 'careers', label: t('navigation.careers'), path: '/careers' },
    { id: 'gallery', label: t('navigation.gallery'), path: '/gallery' },
    { id: 'contact', label: t('navigation.contact'), path: '/contact'},
    { id: 'admin', label: t('navigation.admin'), path: '/admin-login', isAdmin: true }
  ];

  useEffect(() => {
    // Set active section based on current route
    const pathToSection = {
      '/': 'home',
      '/about': 'about',
      '/services': 'services',
      '/contact': 'contact'
    };
    setActiveSection(pathToSection[location.pathname] || 'home');

    const handleScroll = () => {
      setIsScrolling(true);
      
      // Only detect sections on home page, but exclude sections that are also separate pages
      if (location.pathname === '/') {
        const sections = ['home', 'stats', 'testimonials']; // Only detect actual home page sections
        const scrollPosition = window.scrollY + 100;

        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      }

      // Clear scrolling state after a delay
      setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (itemId) => {
    setActiveSection(itemId);
    
    // Only smooth scroll to sections if we're on the home page and it's a home section
    // But exclude 'about' and 'services' as they should navigate to separate pages
    if (location.pathname === '/' && itemId !== 'home' && itemId !== 'about' && itemId !== 'services') {
      const element = document.getElementById(itemId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return; // Prevent default navigation
      }
    }
  };

  return (
    <nav className={`${styles.nav} ${isScrolling ? styles.scrolling : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={() => setActiveSection('home')}>
          <span className={styles.logoIcon}>👷</span>
          <span className={styles.logoText}>Saudi Manpower</span>
        </Link>

        {/* Navigation Items */}
        <div className={styles.navItems}>
          {navItems.map((item, index) => (
            <Link
              key={item.id}
              to={item.path}
              className={`${styles.navItem} ${
                activeSection === item.id ? styles.active : ''
              } ${item.isAdmin ? styles.adminBtn : ''}`}
              onClick={() => handleNavClick(item.id)}
              style={{ '--delay': `${index * 100}ms` }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              
              {/* Animated Underline */}
              <div className={styles.underline}></div>
              
              {/* Hover Glow Effect */}
              <div className={styles.hoverGlow}></div>
            </Link>
          ))}
        </div>

        {/* Language Toggle */}
        <LanguageToggle />

        {/* Mobile Menu Toggle */}
        <button className={styles.mobileToggle}>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressIndicator}>
        <div 
          className={styles.progressBar}
          style={{ 
            width: `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%` 
          }}
        ></div>
      </div>
    </nav>
  );
};

export default SmartNavigation;
