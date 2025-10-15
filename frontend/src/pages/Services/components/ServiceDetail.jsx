import React from 'react';
import Card from '../../../components/ui/Card/Card';

const ServiceDetail = () => {
  const serviceDetails = [
    {
      title: 'Airport Operations Excellence',
      description: 'We provide comprehensive airport operations support including ground handling, passenger services, cargo operations, and security services.',
      stats: [
        { label: 'Airports Served', value: '15+' },
        { label: 'Ground Staff', value: '2,500+' },
        { label: 'Years Experience', value: '20+' }
      ],
      icon: '✈️'
    },
    {
      title: 'Corporate Solutions',
      description: 'Our corporate office staffing includes administrative professionals, executive assistants, and specialized support staff.',
      stats: [
        { label: 'Corporate Clients', value: '200+' },
        { label: 'Office Staff', value: '1,800+' },
        { label: 'Cities Covered', value: '4' }
      ],
      icon: '🏢'
    },
    {
      title: 'Catering & Hospitality',
      description: 'Professional catering staff for hotels, restaurants, corporate events, and special occasions across Saudi Arabia.',
      stats: [
        { label: 'Hotels Served', value: '150+' },
        { label: 'Chefs & Staff', value: '3,200+' },
        { label: 'Events Catered', value: '10,000+' }
      ],
      icon: '🍽️'
    }
  ];

  return (
    <section style={{
      backgroundColor: '#f8f9fa',
      padding: '80px 0',
      marginBottom: '80px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '20px' }}>
          Service Excellence
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Delivering exceptional results through specialized expertise and dedicated workforce
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '40px'
      }}>
        {serviceDetails.map((service, index) => (
          <Card key={index} padding="large">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                {service.icon}
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                color: '#2c3e50',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                {service.title}
              </h3>
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                {service.description}
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              textAlign: 'center'
            }}>
              {service.stats.map((stat, idx) => (
                <div key={idx} style={{
                  padding: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    color: '#3498db',
                    fontWeight: '700',
                    marginBottom: '5px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    fontWeight: '500'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ServiceDetail;
