import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  InputBase,
  Divider,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LockReset as LockResetIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import './TopNavbar.css';

const TopNavbar = ({ 
  onMenuToggle, 
  sidebarOpen,
  adminUser, 
  onLogout,
  notifications = [] 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifMenu = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleCloseNotifMenu = () => {
    setAnchorElNotif(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement global search functionality
    }
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    const breadcrumbNameMap = {
      'admin': 'Admin',
      'dashboard': 'Dashboard',
      'content': 'Website Content',
      'services': 'Our Services',
      'clients': 'Clients',
      'contracts': 'Contracts',
      'careers': 'Career & Jobs',
      'gallery': 'Gallery',
      'enquiries': 'Contact Enquiries',
      'settings': 'Settings',
      'home': 'Home Page',
      'about': 'About Us',
      'contact': 'Contact Page'
    };
    
    return (
      <Breadcrumbs 
        aria-label="breadcrumb" 
        sx={{ 
          display: { xs: 'none', md: 'flex' },
          '& .MuiBreadcrumbs-separator': {
            color: 'rgba(0, 0, 0, 0.6)'
          }
        }}
      >
        <Link 
          underline="hover" 
          color="inherit" 
          href="/admin/dashboard"
          sx={{ 
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' }
          }}
        >
          Home
        </Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
          
          return isLast ? (
            <Typography 
              key={name} 
              color="text.primary" 
              sx={{ fontWeight: 600 }}
            >
              {displayName}
            </Typography>
          ) : (
            <Link
              key={name}
              underline="hover"
              color="inherit"
              href={routeTo}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {displayName}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  const formatTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{
        backgroundColor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMenuToggle}
            sx={{ 
              display: { xs: 'flex', lg: 'none' },
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
            }}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              M
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', md: 'block' }
              }}
            >
              Manpower Admin
            </Typography>
          </Box>

          {getBreadcrumbs()}
        </Box>

        {/* Center - Search */}
        <Box 
          component="form" 
          onSubmit={handleSearch}
          sx={{ 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderRadius: '24px',
            px: 2,
            py: 0.5,
            mx: 2,
            flex: 1,
            maxWidth: '400px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            }
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              flex: 1,
              '& input': {
                padding: '4px 0'
              }
            }}
          />
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              display: { xs: 'none', lg: 'block' },
              color: 'text.secondary',
              fontSize: '0.75rem'
            }}
          >
            {formatTime(currentTime)}
          </Typography>

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleOpenNotifMenu}
            sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
          >
            <Badge badgeContent={unreadNotifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorElNotif}
            open={Boolean(anchorElNotif)}
            onClose={handleCloseNotifMenu}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 320,
                maxHeight: 400
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
            </Box>
            <Divider />
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <MenuItem key={index} onClick={handleCloseNotifMenu}>
                  <ListItemText
                    primary={notif.title}
                    secondary={notif.message}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </MenuItem>
              ))
            ) : (
              <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            )}
          </Menu>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {adminUser?.username || 'Admin'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                {adminUser?.role || 'Administrator'}
              </Typography>
            </Box>
            
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            PaperProps={{
              sx: { mt: 1.5, minWidth: 200 }
            }}
          >
            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin/profile'); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin/settings'); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin/change-password'); }}>
              <ListItemIcon>
                <LockResetIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Change Password</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleCloseUserMenu(); onLogout(); }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>
                <Typography color="error">Logout</Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;

