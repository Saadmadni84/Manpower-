import React from 'react';
import { Card, CardContent, CardActions, IconButton, Chip, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import './ServiceCard.css';

const ServiceCard = ({ 
  service, 
  currentLanguage, 
  onEdit, 
  onDelete, 
  onDuplicate,
  isDragging,
  dragHandleProps 
}) => {
  const title = service.title_en || service.title?.[currentLanguage] || 'Untitled';
  const description = service.short_description_en || service.shortDescription?.[currentLanguage] || '';
  
  const getCategoryColor = (category) => {
    const colors = {
      airport: '#1976d2',
      corporate: '#2e7d32',
      catering: '#ed6c02',
      logistics: '#9c27b0',
      construction: '#d32f2f',
      facility: '#0288d1'
    };
    return colors[category] || '#757575';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      airport: 'Airport Operations',
      corporate: 'Corporate Offices',
      catering: 'Catering Services',
      logistics: 'Logistics',
      construction: 'Construction',
      facility: 'Facility Management'
    };
    return labels[category] || category;
  };

  return (
    <Card 
      className={`service-card ${isDragging ? 'dragging' : ''}`}
      elevation={isDragging ? 8 : 2}
    >
      <div className="card-drag-handle" {...dragHandleProps}>
        <DragIndicatorIcon />
      </div>
      
      <div className="card-header">
        <div className="service-icon" style={{ background: getCategoryColor(service.category) }}>
          {service.icon || '⚡'}
        </div>
        
        <div className="service-badges">
          <Chip 
            label={service.is_active ? 'Active' : 'Inactive'}
            size="small"
            color={service.is_active ? 'success' : 'default'}
            className="status-chip"
          />
        </div>
      </div>

      <CardContent className="card-content">
        <h3 className="service-title">{title}</h3>
        
        {service.category && (
          <Chip 
            label={getCategoryLabel(service.category)}
            size="small"
            style={{ 
              background: getCategoryColor(service.category),
              color: 'white',
              marginBottom: '8px'
            }}
          />
        )}
        
        <p className="service-description">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        
        <div className="service-meta">
          <span className="display-order">Order: {service.display_order || 0}</span>
        </div>
      </CardContent>

      <CardActions className="card-actions">
        <Tooltip title="Edit Service">
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => onEdit(service)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Duplicate Service">
          <IconButton 
            size="small" 
            color="default"
            onClick={() => onDuplicate(service)}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Delete Service">
          <IconButton 
            size="small" 
            color="error"
            onClick={() => onDelete(service)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;
