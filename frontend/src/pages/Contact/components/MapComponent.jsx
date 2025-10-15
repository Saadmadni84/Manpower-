import React from 'react';
import Card from '../../../components/ui/Card/Card';

const MapComponent = () => {
  return (
    <Card padding="none">
      <div style={{
        height: '400px',
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        border: '2px dashed #ccc',
        position: 'relative'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🗺️</div>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            Interactive Map<br />
            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              (Map integration would go here)
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MapComponent;

