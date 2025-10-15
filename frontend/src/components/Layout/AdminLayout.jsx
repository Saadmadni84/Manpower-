import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [notifications, setNotifications] = useState({
    totalServices: 0,
    totalClients: 0,
    activeContracts: 0,
    activeJobs: 0,
    galleryImages: 0,
    newEnquiries: 0
  });
  const [notificationsList, setNotificationsList] = useState([]);

  // Saudi corporate theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0'
      },
      secondary: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20'
      },
      error: {
        main: '#d32f2f'
      },
      warning: {
        main: '#ed6c02'
      },
      success: {
        main: '#2e7d32'
      },
      background: {
        default: '#f5f7fa',
        paper: '#ffffff'
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700
      },
      h2: {
        fontWeight: 700
      },
      h3: {
        fontWeight: 600
      },
      h4: {
        fontWeight: 600
      },
      h5: {
        fontWeight: 600
      },
      h6: {
        fontWeight: 600
      }
    },
    shape: {
      borderRadius: 12
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderRadius: 12
          }
        }
      }
    }
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    console.log('🔐 AdminLayout - Auth Check:', { 
      hasToken: !!token, 
      hasUser: !!user,
      currentPath: window.location.pathname,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'NONE'
    });
    
    // TEMPORARY: BYPASS AUTH CHECK FOR TESTING
    console.warn('⚠️ AUTH CHECK TEMPORARILY DISABLED FOR TESTING');
    
    // Set a dummy user if none exists
    if (!user) {
      setAdminUser({ username: 'admin', email: 'admin@test.com' });
    } else {
      setAdminUser(JSON.parse(user));
    }
    
    // Only fetch stats if we have a token
    if (token) {
      fetchQuickStats();
    }
    
    /* ORIGINAL AUTH CODE - COMMENTED OUT FOR TESTING
    if (!token || !user) {
      console.warn('❌ AdminLayout - No auth found, redirecting to login...');
      navigate('/admin-login');
      return;
    }

    console.log('✅ AdminLayout - Auth OK, loading dashboard...');
    setAdminUser(JSON.parse(user));
    fetchQuickStats();
    */

    // Set up auto-refresh for stats every 30 seconds
    const interval = setInterval(fetchQuickStats, 30000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchQuickStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Debug: Log the received stats
          console.log('Dashboard Stats:', data.data.stats);
          
          // Update notifications with all counts for badges
          setNotifications({
            totalServices: data.data.stats.totalServices || 0,
            totalClients: data.data.stats.totalClients || 0,
            activeContracts: data.data.stats.activeContracts || 0,
            activeJobs: data.data.stats.activeJobs || 0,
            galleryImages: data.data.stats.galleryImages || 0,
            newEnquiries: data.data.stats.contactEnquiries || 0
          });
          
          // Create notification list from stats
          const newNotifications = [];
          if (data.data.stats.pendingCVs > 0) {
            newNotifications.push({
              title: 'Pending CVs',
              message: `You have ${data.data.stats.pendingCVs} new CV submissions to review`,
              read: false
            });
          }
          if (data.data.stats.contactEnquiries > 0) {
            newNotifications.push({
              title: 'New Enquiries',
              message: `You have ${data.data.stats.contactEnquiries} new contact enquiries`,
              read: false
            });
          }
          setNotificationsList(newNotifications);
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

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // TEMPORARY: Skip the loading check for testing
  console.warn('⚠️ ADMIN USER CHECK BYPASSED FOR TESTING');
  
  // Force set admin user if not set
  if (!adminUser) {
    console.log('🔧 Setting dummy admin user...');
    setAdminUser({ username: 'admin', email: 'admin@test.com' });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarClose}
          onLogout={handleLogout}
          notifications={notifications}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', lg: 'calc(100% - 280px)' },
            minHeight: '100vh'
          }}
        >
          {/* Top Navigation Bar */}
          <TopNavbar
            onMenuToggle={handleSidebarToggle}
            sidebarOpen={sidebarOpen}
            adminUser={adminUser}
            onLogout={handleLogout}
            notifications={notificationsList}
          />

          {/* Page Content */}
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              backgroundColor: 'background.default',
              overflowY: 'auto'
            }}
          >
            {children}
          </Box>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 2,
              px: 3,
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: 'white',
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            © {new Date().getFullYear()} Manpower Supply Company. All rights reserved.
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;

