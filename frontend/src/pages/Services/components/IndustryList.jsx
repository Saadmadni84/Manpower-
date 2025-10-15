import React from 'react';
import Card from '../../../components/ui/Card/Card';

const IndustryList = () => {
  const industries = [
    {
      name: 'Aviation & Airlines',
      description: 'Complete airport operations support including ground handling, passenger services, and cargo operations.',
      clients: ['Saudi Airlines', 'King Khalid Airport', 'King Fahd Airport'],
      icon: '✈️'
    },
    {
      name: 'Hospitality & Tourism',
      description: 'Professional staff for hotels, restaurants, resorts, and tourism facilities across Saudi Arabia.',
      clients: ['Marriott Hotels', 'Hilton Group', 'Saudi Tourism Authority'],
      icon: '🏨'
    },
    {
      name: 'Healthcare',
      description: 'Support staff for hospitals, clinics, and healthcare facilities including administrative and maintenance personnel.',
      clients: ['King Fahd Hospital', 'King Khalid Hospital', 'Saudi Health Ministry'],
      icon: '🏥'
    },
    {
      name: 'Education',
      description: 'Administrative and support staff for universities, schools, and educational institutions.',
      clients: ['King Saud University', 'King Abdulaziz University', 'Ministry of Education'],
      icon: '🎓'
    },
    {
      name: 'Retail & Commerce',
      description: 'Retail staff, customer service representatives, and logistics personnel for shopping centers and retail chains.',
      clients: ['Alshaya Group', 'Landmark Group', 'Saudi Retail Chains'],
      icon: '🛍️'
    },
    {
      name: 'Manufacturing',
      description: 'Production staff, quality control personnel, and maintenance workers for manufacturing facilities.',
      clients: ['SABIC', 'Aramco', 'Saudi Industrial Companies'],
      icon: '🏭'
    }
  ];

  return (
    <section>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '20px' }}>
          Industry Expertise
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Serving diverse industries with specialized workforce solutions
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {industries.map((industry, index) => (
          <Card key={index} hover padding="large">
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
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
                {industry.icon}
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                color: '#2c3e50',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                {industry.name}
              </h3>
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                fontSize: '0.95rem',
                marginBottom: '25px'
              }}>
                {industry.description}
              </p>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '1rem',
                color: '#3498db',
                marginBottom: '15px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Key Clients:
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {industry.clients.map((client, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#f8f9fa',
                    color: '#2c3e50',
                    padding: '8px 15px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    border: '1px solid #e9ecef',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    {client}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{
        marginTop: '60px',
        textAlign: 'center'
      }}>
        <Card padding="large">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤝</div>
            <h3 style={{
              fontSize: '1.8rem',
              color: '#2c3e50',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              Partner With Us
            </h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 30px auto'
            }}>
              Ready to experience the difference that 25+ years of expertise can make? 
              Contact us today to discuss your manpower requirements and discover how 
              we can support your business growth.
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}>
                Request Quote
              </button>
              <button style={{
                backgroundColor: 'transparent',
                color: '#3498db',
                border: '2px solid #3498db',
                padding: '12px 30px',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Contact Us
              </button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default IndustryList;
