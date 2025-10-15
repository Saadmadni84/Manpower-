import React from 'react';
import Card from '../../../components/ui/Card/Card';

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: '📍',
      title: 'Head Office',
      details: 'King Fahd Road, Al Malaz District, Riyadh 11564, Saudi Arabia'
    },
    {
      icon: '📞',
      title: 'Phone',
      details: '+966 11 123 4567'
    },
    {
      icon: '📧',
      title: 'Email',
      details: 'info@saudimanpower.com'
    },
    {
      icon: '🕒',
      title: 'Business Hours',
      details: 'Sunday - Thursday: 8:00 AM - 6:00 PM'
    }
  ];

  return (
    <Card padding="large">
      <h3 style={{ marginBottom: '25px', color: '#2c3e50' }}>Get in Touch</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {contactDetails.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{ fontSize: '1.5rem', marginTop: '2px' }}>
              {item.icon}
            </div>
            <div>
              <h4 style={{ 
                margin: '0 0 5px 0', 
                fontSize: '1rem', 
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                {item.title}
              </h4>
              <p style={{ 
                margin: 0, 
                color: '#666', 
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                {item.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ContactInfo;

