import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Badge,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Web as WebIcon,
  Build as BuildIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Mail as MailIcon,
  ContactMail as ContactMailIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ open, onClose, onLogout, notifications = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [contentMenuOpen, setContentMenuOpen] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
      color: '#1976d2'
    },
    {
      title: 'Website Content',
      icon: <WebIcon />,
      path: '/admin/content',
      color: '#2e7d32'
    },
    {
      title: 'Our Services',
      icon: <BuildIcon />,
      path: '/admin/services',
      color: '#ed6c02',
      badge: notifications.totalServices || 0
    },
    {
      title: 'Clients',
      icon: <BusinessIcon />,
      path: '/admin/clients',
      color: '#0288d1',
      badge: notifications.totalClients || 0
    },
    {
      title: 'Contact Enquiries',
      icon: <ContactMailIcon />,
      path: '/admin/enquiries',
      color: '#7b1fa2',
      badge: notifications.newEnquiries || 0
    },
    {
      title: 'Career & Jobs',
      icon: <WorkIcon />,
      path: '/admin/careers',
      color: '#9c27b0',
      badge: notifications.activeJobs || 0
    },
    {
      title: 'Gallery',
      icon: <PhotoLibraryIcon />,
      path: '/admin/gallery',
      color: '#d32f2f',
      badge: notifications.galleryImages || 0
    },
    {
      title: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings',
      color: '#5e35b1'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleContentMenuToggle = () => {
    setContentMenuOpen(!contentMenuOpen);
  };

  const drawerWidth = 280;

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 45,
              height: 45,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>M</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
              Manpower
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
              Admin Panel
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 2, px: 1.5 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => item.expandable ? handleContentMenuToggle() : handleNavigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                    '&:hover': {
                      backgroundColor: `${item.color}25`,
                    },
                    '& .MuiListItemIcon-root': {
                      color: item.color,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '60%',
                      backgroundColor: item.color,
                      borderRadius: '0 4px 4px 0'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateX(4px)',
                  },
                  position: 'relative'
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? item.color : 'text.secondary',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isActive(item.path) ? 600 : 500
                  }}
                />
                {item.badge !== undefined && (
                  <Badge
                    badgeContent={item.badge}
                    color={item.badge > 0 ? "error" : "default"}
                    sx={{
                      '& .MuiBadge-badge': {
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.7rem',
                        height: '20px',
                        minWidth: '20px',
                        backgroundColor: item.badge > 0 ? undefined : 'rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  />
                )}
                {item.expandable && (
                  contentMenuOpen ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            
            {/* Submenu for Website Content */}
            {item.expandable && (
              <Collapse in={contentMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((subItem) => (
                    <ListItemButton
                      key={subItem.path}
                      onClick={() => handleNavigate(subItem.path)}
                      selected={isActive(subItem.path)}
                      sx={{
                        pl: 7,
                        py: 1,
                        borderRadius: '12px',
                        mx: 1,
                        mb: 0.5,
                        transition: 'all 0.3s ease',
                        '&.Mui-selected': {
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                          '&:hover': {
                            backgroundColor: `${item.color}25`,
                          }
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          transform: 'translateX(4px)',
                        }
                      }}
                    >
                      <ListItemText
                        primary={subItem.title}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive(subItem.path) ? 600 : 400
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      <Divider />

      {/* Sidebar Footer */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={onLogout}
          sx={{
            borderRadius: '12px',
            py: 1.5,
            px: 2,
            border: '1px solid rgba(211, 47, 47, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              borderColor: '#d32f2f',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(211, 47, 47, 0.2)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#d32f2f' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#d32f2f'
            }}
          />
        </ListItemButton>

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
            border: '1px solid rgba(25, 118, 210, 0.2)'
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Version 1.0.0
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            © 2024 Manpower Supply
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            background: 'white'
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

