import React from 'react';
import Card from '../../../components/ui/Card/Card';

const OfficeLocations = () => {
  const locations = [
    {
      name: 'Riyadh Head Office',
      address: 'King Fahd Road, Al Malaz District',
      phone: '+966 11 123 4567'
    },
    {
      name: 'Jeddah Branch',
      address: 'Prince Sultan Road, Al Hamra District',
      phone: '+966 12 345 6789'
    },
    {
      name: 'Dammam Branch',
      address: 'King Khalid Street, Al Faisaliyah',
      phone: '+966 13 456 7890'
    },
    {
      name: 'Madina Branch',
      address: 'Prince Mohammed bin Abdulaziz Road',
      phone: '+966 14 567 8901'
    }
  ];

  return (
    <Card padding="large">
      <h3 style={{ marginBottom: '25px', color: '#2c3e50' }}>Our Locations</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {locations.map((location, index) => (
          <div key={index} style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '1rem', 
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              {location.name}
            </h4>
            <p style={{ 
              margin: '0 0 5px 0', 
              color: '#666', 
              fontSize: '0.9rem'
            }}>
              📍 {location.address}
            </p>
            <p style={{ 
              margin: 0, 
              color: '#666', 
              fontSize: '0.9rem'
            }}>
              📞 {location.phone}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OfficeLocations;

