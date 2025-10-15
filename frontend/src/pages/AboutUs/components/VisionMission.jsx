import React from 'react';
import Card from '../../../components/ui/Card/Card';

const VisionMission = () => {
  return (
    <section style={{
      backgroundColor: '#f8f9fa',
      padding: '80px 0',
      marginBottom: '80px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '20px' }}>
          Our Vision & Mission
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Driving excellence in manpower solutions across Saudi Arabia
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '40px'
      }}>
        <Card padding="large">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '30px' }}>🎯</div>
            <h3 style={{
              fontSize: '1.8rem',
              color: '#2c3e50',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              Our Vision
            </h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              lineHeight: '1.8',
              textAlign: 'left'
            }}>
              To be the leading manpower supply company in Saudi Arabia and the GCC region, 
              recognized for our commitment to excellence, innovation, and the development 
              of skilled workforce solutions that drive economic growth and prosperity.
            </p>
          </div>
        </Card>

        <Card padding="large">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '30px' }}>🚀</div>
            <h3 style={{
              fontSize: '1.8rem',
              color: '#2c3e50',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              Our Mission
            </h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              lineHeight: '1.8',
              textAlign: 'left'
            }}>
              To provide exceptional manpower solutions by connecting skilled professionals 
              with reputable organizations across diverse industries. We are committed to 
              delivering reliable, efficient, and customized workforce services that exceed 
              client expectations while fostering career growth for our employees.
            </p>
          </div>
        </Card>
      </div>

      <div style={{
        marginTop: '50px',
        textAlign: 'center'
      }}>
        <Card padding="large">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '30px' }}>💎</div>
            <h3 style={{
              fontSize: '1.8rem',
              color: '#2c3e50',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              Our Values
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '30px',
              textAlign: 'center'
            }}>
              <div>
                <h4 style={{ color: '#3498db', marginBottom: '10px' }}>Excellence</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Delivering superior quality in all our services</p>
              </div>
              <div>
                <h4 style={{ color: '#3498db', marginBottom: '10px' }}>Integrity</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Maintaining the highest ethical standards</p>
              </div>
              <div>
                <h4 style={{ color: '#3498db', marginBottom: '10px' }}>Innovation</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Embracing technology and modern solutions</p>
              </div>
              <div>
                <h4 style={{ color: '#3498db', marginBottom: '10px' }}>Partnership</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Building lasting relationships with clients</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default VisionMission;
