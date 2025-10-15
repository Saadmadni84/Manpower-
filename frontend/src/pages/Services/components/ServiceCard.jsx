import React from 'react';
import Card from '../../../components/ui/Card/Card';

const ServiceCard = () => {
  const services = [
    {
      title: 'Airport Operations',
      icon: '✈️',
      description: 'Professional ground staff, security personnel, baggage handlers, and operational support for major airports across Saudi Arabia.',
      features: ['Ground Staff', 'Security Personnel', 'Baggage Handling', 'Customer Service']
    },
    {
      title: 'Corporate Offices',
      icon: '🏢',
      description: 'Skilled administrative staff, receptionists, office support professionals, and executive assistants for corporate environments.',
      features: ['Administrative Staff', 'Receptionists', 'Executive Assistants', 'Office Support']
    },
    {
      title: 'Catering Services',
      icon: '🍽️',
      description: 'Experienced chefs, kitchen staff, service personnel, and event coordinators for restaurants, hotels, and corporate events.',
      features: ['Professional Chefs', 'Kitchen Staff', 'Service Personnel', 'Event Coordinators']
    },
    {
      title: 'Inventory & Logistics',
      icon: '📦',
      description: 'Warehouse staff, logistics coordinators, inventory management professionals, and supply chain specialists.',
      features: ['Warehouse Staff', 'Logistics Coordinators', 'Inventory Management', 'Supply Chain']
    },
    {
      title: 'Construction',
      icon: '🏗️',
      description: 'Skilled construction workers, supervisors, safety personnel, and project coordinators for major construction projects.',
      features: ['Construction Workers', 'Site Supervisors', 'Safety Personnel', 'Project Coordinators']
    },
    {
      title: 'Facility Management',
      icon: '🔧',
      description: 'Maintenance staff, cleaners, security guards, and facility management professionals for commercial and residential buildings.',
      features: ['Maintenance Staff', 'Cleaning Services', 'Security Guards', 'Facility Management']
    }
  ];

  return (
    <section style={{ marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '20px' }}>
          Our Core Services
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Specialized manpower solutions tailored to each industry's unique requirements
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {services.map((service, index) => (
          <Card key={index} hover padding="large">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                {service.icon}
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                color: '#2c3e50',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                {service.title}
              </h3>
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                {service.description}
              </p>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '1rem',
                color: '#3498db',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                Key Positions:
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {service.features.map((feature, idx) => (
                  <span key={idx} style={{
                    backgroundColor: '#f8f9fa',
                    color: '#2c3e50',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    border: '1px solid #e9ecef'
                  }}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ServiceCard;
