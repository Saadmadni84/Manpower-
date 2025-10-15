import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import { 
  Description as DescriptionIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Build as BuildIcon,
  Business as BusinessIcon,
  Photo as PhotoIcon
} from '@mui/icons-material';
import './RecentActivity.css';

const RecentActivity = ({ activities = [], loading = false }) => {
  
  const getActivityIcon = (type) => {
    const iconMap = {
      'cv': <DescriptionIcon />,
      'enquiry': <EmailIcon />,
      'job': <WorkIcon />,
      'service': <BuildIcon />,
      'client': <BusinessIcon />,
      'gallery': <PhotoIcon />
    };
    return iconMap[type] || <DescriptionIcon />;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      'cv': '#9c27b0',
      'enquiry': '#0288d1',
      'job': '#ed6c02',
      'service': '#1976d2',
      'client': '#2e7d32',
      'gallery': '#d32f2f'
    };
    return colorMap[type] || '#757575';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <Card className="recent-activity-card" elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>Loading activities...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="recent-activity-card" elevation={3} sx={{ borderRadius: '12px' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            📋 Recent Activity
          </Typography>
          <Chip 
            label={`${activities.length} activities`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>

        {activities.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2">No recent activities</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {activities.map((activity, index) => (
              <React.Fragment key={activity.id || index}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{
                    px: 0,
                    py: 1.5,
                    transition: 'background-color 0.2s',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: getActivityColor(activity.type),
                        width: 40,
                        height: 40
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: 'text.primary'
                          }}
                        >
                          {activity.message}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={activity.action || 'Action'} 
                          size="small"
                          sx={{ 
                            height: '20px',
                            fontSize: '0.7rem',
                            bgcolor: `${getActivityColor(activity.type)}15`,
                            color: getActivityColor(activity.type),
                            fontWeight: 600
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                          }}
                        >
                          {formatTimeAgo(activity.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < activities.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            View all activities →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

