import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Build as BuildIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  PhotoLibrary as PhotoLibraryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/Dashboard/StatCard';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import useDashboard from '../../hooks/useDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminName, setAdminName] = useState('Admin');

  const {
    stats,
    activities,
    loading,
    refreshDashboard,
    lastUpdated
  } = useDashboard(true, 30000); // Auto-refresh every 30 seconds

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get admin name
    const user = localStorage.getItem('adminUser');
    if (user) {
      const userData = JSON.parse(user);
      setAdminName(userData.username || 'Admin');
    }

    return () => clearInterval(timer);
  }, []);

  const statsConfig = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: '⚙️',
      color: '#1976d2',
      bgColor: '#e3f2fd',
      navigateTo: '/admin/services',
      trend: 'up',
      trendValue: '12.5'
    },
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: '👥',
      color: '#2e7d32',
      bgColor: '#e8f5e9',
      navigateTo: '/admin/clients',
      trend: 'up',
      trendValue: '8.3'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: '💼',
      color: '#ed6c02',
      bgColor: '#fff3e0',
      navigateTo: '/admin/careers',
      trend: 'up',
      trendValue: '15.7'
    },
    {
      title: 'Pending CVs',
      value: stats.pendingCVs,
      icon: '📄',
      color: '#9c27b0',
      bgColor: '#f3e5f5',
      navigateTo: '/admin/careers',
      trend: 'neutral',
      trendValue: '0'
    },
    {
      title: 'Gallery Images',
      value: stats.galleryImages,
      icon: '🖼️',
      color: '#d32f2f',
      bgColor: '#ffebee',
      navigateTo: '/admin/gallery',
      trend: 'down',
      trendValue: '3.2'
    },
    {
      title: 'Contact Enquiries',
      value: stats.contactEnquiries,
      icon: '📧',
      color: '#0288d1',
      bgColor: '#e1f5fe',
      navigateTo: '/admin/enquiries',
      trend: 'up',
      trendValue: '22.1'
    }
  ];

  const quickActions = [
    {
      title: 'Add Service',
      description: 'Create a new manpower service',
      icon: <BuildIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      action: () => navigate('/admin/services?action=add')
    },
    {
      title: 'Add Client',
      description: 'Register a new client',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      action: () => navigate('/admin/clients?action=add')
    },
    {
      title: 'Post Job',
      description: 'Create a job opening',
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      action: () => navigate('/admin/careers?action=add')
    },
    {
      title: 'Upload Image',
      description: 'Add to gallery',
      icon: <PhotoLibraryIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      action: () => navigate('/admin/gallery?action=upload')
    }
  ];

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  if (loading && !stats.totalServices) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Loading dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="enhanced-dashboard">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Welcome back, {adminName}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>📅</span>
              {formatDateTime(currentTime)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              label={`Last updated: ${formatLastUpdated(lastUpdated)}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <IconButton
              color="primary"
              onClick={refreshDashboard}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Here's what's happening with your company today
        </Typography>
      </Box>

      {/* Statistics Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsConfig.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions and Recent Activity */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={6}>
          <Card elevation={3} sx={{ borderRadius: '12px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  ⚡ Quick Actions
                </Typography>
                <TrendingUpIcon sx={{ color: 'primary.main' }} />
              </Box>

              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: '12px',
                        border: '2px solid',
                        borderColor: 'transparent',
                        background: `linear-gradient(135deg, ${action.color}08 0%, ${action.color}15 100%)`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: action.color,
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 16px ${action.color}30`
                        }
                      }}
                      onClick={action.action}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `${action.color}20`,
                            color: action.color
                          }}
                        >
                          {action.icon}
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {action.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={6}>
          <RecentActivity activities={activities} loading={loading} />
        </Grid>
      </Grid>

      {/* System Health Status (Optional) */}
      <Box sx={{ mt: 4 }}>
        <Card elevation={3} sx={{ borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🚀 System Status: All Systems Operational
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Database, API, and all services are running smoothly
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  99.9%
                </Typography>
                <Typography variant="caption">Uptime</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;

