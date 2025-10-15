import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SaudiAdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState('ar'); // Arabic first for Saudi theme

  const menuItems = [
    {
      title: { ar: 'لوحة التحكم', en: 'Dashboard' },
      icon: '📊',
      path: '/admin/dashboard'
    },
    {
      title: { ar: 'إدارة المحتوى', en: 'Content Management' },
      icon: '📝',
      path: '/admin/content'
    },
    {
      title: { ar: 'إدارة الخدمات', en: 'Services Management' },
      icon: '⚡',
      path: '/admin/services'
    },
    {
      title: { ar: 'إدارة العملاء', en: 'Clients Management' },
      icon: '👥',
      path: '/admin/clients'
    },
    {
      title: { ar: 'إدارة العقود', en: 'Contracts Management' },
      icon: '📋',
      path: '/admin/contracts'
    },
    {
      title: { ar: 'إدارة الوظائف', en: 'Careers Management' },
      icon: '💼',
      path: '/admin/careers',
      badge: 156
    },
    {
      title: { ar: 'إدارة المعرض', en: 'Gallery Management' },
      icon: '🖼️',
      path: '/admin/gallery'
    },
    {
      title: { ar: 'الاستفسارات', en: 'Contact Enquiries' },
      icon: '📧',
      path: '/admin/enquiries',
      badge: 12
    },
    {
      title: { ar: 'إعدادات اللغة', en: 'Language Settings' },
      icon: '🌐',
      path: '/admin/language'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    window.location.href = '/admin-login';
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => isActive(item.path));
    return currentItem ? currentItem.title[language] : (language === 'ar' ? 'لوحة التحكم' : 'Dashboard');
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: language === 'ar' ? 'Tajawal, Arial, sans-serif' : 'Arial, sans-serif',
      direction: language === 'ar' ? 'rtl' : 'ltr'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '80px' : '320px',
        background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                backdropFilter: 'blur(10px)'
              }}>
                👷‍♂️
              </div>
              <div>
                <div style={{ 
                  fontWeight: '700', 
                  color: 'white', 
                  fontSize: '18px',
                  marginBottom: '4px'
                }}>
                  {language === 'ar' ? 'الشركة السعودية' : 'Saudi Company'}
                </div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: '12px' 
                }}>
                  {language === 'ar' ? 'إمداد القوى العاملة' : 'Manpower Supply'}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
        </div>

        {/* Language Toggle */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={toggleLanguage}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span style={{ fontSize: '18px' }}>
              {language === 'ar' ? '🇸🇦' : '🇺🇸'}
            </span>
            {!sidebarCollapsed && (
              <span>
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '24px 0', flex: 1 }}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 24px',
                marginBottom: '8px',
                border: 'none',
                background: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '15px',
                fontWeight: isActive(item.path) ? '700' : '500',
                textAlign: language === 'ar' ? 'right' : 'left',
                backdropFilter: isActive(item.path) ? 'blur(10px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span style={{ flex: 1 }}>
                    {item.title[language]}
                  </span>
                  {item.badge && (
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      minWidth: '20px',
                      textAlign: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <span>🏠</span>
            {!sidebarCollapsed && (
              <span>
                {language === 'ar' ? 'العودة للموقع' : 'Back to Website'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? '80px' : '320px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Top Bar */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#1e293b', 
              margin: 0,
              direction: language === 'ar' ? 'rtl' : 'ltr'
            }}>
              {getCurrentPageTitle()}
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              margin: '4px 0 0 0' 
            }}>
              {language === 'ar' ? 'إدارة شاملة لجميع أنشطة الشركة' : 'Comprehensive management of all company activities'}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Current Time */}
            <div style={{
              padding: '8px 16px',
              background: '#f1f5f9',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#475569',
              fontWeight: '600'
            }}>
              {new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}
            </div>

            {/* User Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '18px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}>
                أ
              </div>
              <div style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>
                  {language === 'ar' ? 'المدير العام' : 'Administrator'}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  admin@company.com
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
              >
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ 
          padding: '32px',
          background: '#f8fafc',
          minHeight: 'calc(100vh - 100px)'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SaudiAdminLayout;
