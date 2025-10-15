import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CompleteAdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '📊',
      path: '/admin/dashboard'
    },
    {
      title: 'Website Content',
      icon: '📝',
      path: '/admin/content'
    },
    {
      title: 'Services',
      icon: '⚡',
      path: '/admin/services'
    },
    {
      title: 'Clients',
      icon: '👥',
      path: '/admin/clients'
    },
    {
      title: 'Contracts',
      icon: '📋',
      path: '/admin/contracts'
    },
    {
      title: 'Careers & Jobs',
      icon: '💼',
      path: '/admin/careers'
    },
    {
      title: 'Gallery',
      icon: '🖼️',
      path: '/admin/gallery'
    },
    {
      title: 'Contact Enquiries',
      icon: '📧',
      path: '/admin/enquiries',
      badge: 12
    }
  ];

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = '/admin-login';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => isActive(item.path));
    return currentItem ? currentItem.title : 'Dashboard';
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '80px' : '280px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#2563eb',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                👷
              </div>
              <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Admin Portal</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px'
            }}
          >
            ☰
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '20px 0' }}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                border: 'none',
                background: isActive(item.path) ? '#eff6ff' : 'transparent',
                color: isActive(item.path) ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '15px',
                fontWeight: isActive(item.path) ? '600' : '500'
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.title}</span>
                  {item.badge && (
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: '600'
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
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              border: 'none',
              background: '#f1f5f9',
              color: '#64748b',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <span>🏠</span>
            {!sidebarCollapsed && <span>Back to Website</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? '80px' : '280px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Top Bar */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '20px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1e293b', 
            margin: 0 
          }}>
            {getCurrentPageTitle()}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* User Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#2563eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600'
              }}>
                A
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                  Admin User
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Administrator
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ padding: '30px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default CompleteAdminLayout;
