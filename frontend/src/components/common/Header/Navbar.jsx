import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/clients', label: t('nav.clients') },
    { path: '/careers', label: t('nav.careers') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/contracts', label: t('nav.contracts') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/admin/login', label: t('nav.admin') },
  ];

  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '30px' }}>
        {navItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path}
              style={{ 
                textDecoration: 'none', 
                color: '#2c3e50', 
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

