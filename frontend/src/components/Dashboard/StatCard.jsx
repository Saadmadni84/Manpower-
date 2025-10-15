import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './StatCard.css';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  bgColor,
  navigateTo,
  trend,
  trendValue 
}) => {
  const navigate = useNavigate();
  const [displayValue, setDisplayValue] = useState(0);

  // Counter animation
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    const duration = 1000; // Animation duration in ms
    const increment = end / (duration / 16); // 60 fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <Card 
      className="stat-card"
      sx={{
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        cursor: navigateTo ? 'pointer' : 'default',
        '&:hover': {
          transform: navigateTo ? 'translateY(-8px)' : 'none',
          boxShadow: navigateTo ? '0 12px 24px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
        }
      }}
      onClick={handleClick}
      elevation={3}
    >
      <CardContent sx={{ position: 'relative', padding: '24px' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="h3" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 700,
                fontSize: '2.5rem',
                mb: 0.5
              }}
            >
              {displayValue.toLocaleString()}
            </Typography>

            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontWeight: 600
                  }}
                >
                  {trend === 'up' && '↑'}
                  {trend === 'down' && '↓'}
                  {trendValue && `${trendValue}%`}
                  {trend !== 'neutral' && (
                    <span style={{ color: 'text.secondary', fontWeight: 400, marginLeft: '4px' }}>
                      vs last month
                    </span>
                  )}
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: bgColor || `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'rotate(10deg) scale(1.1)',
              }
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Decorative gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`,
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StatCard;

