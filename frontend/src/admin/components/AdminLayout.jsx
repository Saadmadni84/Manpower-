import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [quickStats, setQuickStats] = useState({ pendingCVs: 0, newEnquiries: 0 });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin-login');
      return;
    }

    setAdminUser(JSON.parse(user));
    fetchQuickStats();
  }, [navigate]);

  const fetchQuickStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/dashboard/quick-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuickStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching quick stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch('http://localhost:5001/api/admin/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin-login');
    }
  };

  const menuItems = [
    { title: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { title: 'Website Content', icon: '📝', path: '/admin/content' },
    { title: 'Services', icon: '⚡', path: '/admin/services' },
    { title: 'Clients', icon: '👥', path: '/admin/clients' },
    { title: 'Contracts', icon: '📋', path: '/admin/contracts' },
    { title: 'Careers & Jobs', icon: '💼', path: '/admin/careers', badge: quickStats.pendingCVs },
    { title: 'Gallery', icon: '🖼️', path: '/admin/gallery' },
    { title: 'Contact Enquiries', icon: '📧', path: '/admin/enquiries', badge: quickStats.newEnquiries }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => isActive(item.path));
    return currentItem ? currentItem.title : 'Dashboard';
  };

  if (!adminUser) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="company-logo">
            <span className="logo-icon">🏢</span>
            {!sidebarCollapsed && <span className="logo-text">Manpower Admin</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span className="nav-text">{item.title}</span>
                  {item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <div className="header-left">
            <h1 className="page-title">{getCurrentPageTitle()}</h1>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">Welcome, {adminUser.username}</span>
              <span className="user-role">({adminUser.role})</span>
            </div>
            
            <button className="header-logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
