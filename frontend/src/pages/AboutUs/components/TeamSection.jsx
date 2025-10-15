import React from 'react';
import Card from '../../../components/ui/Card/Card';

const TeamSection = () => {
  const leadership = [
    {
      name: 'Ahmed Al-Sheikh',
      position: 'Chief Executive Officer',
      experience: '20+ years in manpower industry',
      image: '👨‍💼',
      description: 'Leading the company with vision and strategic direction for over 15 years.'
    },
    {
      name: 'Fatima Al-Rashid',
      position: 'Operations Director',
      experience: '18+ years in operations management',
      image: '👩‍💼',
      description: 'Overseeing daily operations across all four Saudi cities with excellence.'
    },
    {
      name: 'Mohammed Al-Zahra',
      position: 'HR Director',
      experience: '15+ years in human resources',
      image: '👨‍🏫',
      description: 'Managing our 10,000+ workforce with expertise and dedication.'
    },
    {
      name: 'Sarah Al-Mansouri',
      position: 'Business Development Manager',
      experience: '12+ years in business development',
      image: '👩‍💻',
      description: 'Driving growth and expanding our client base across major industries.'
    }
  ];

  return (
    <section>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '20px' }}>
          Leadership Team
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Meet the experienced professionals leading our mission
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '50px'
      }}>
        {leadership.map((member, index) => (
          <Card key={index} hover padding="large">
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                {member.image}
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                color: '#2c3e50',
                marginBottom: '10px',
                fontWeight: '600'
              }}>
                {member.name}
              </h3>
              <h4 style={{
                fontSize: '1rem',
                color: '#3498db',
                marginBottom: '10px',
                fontWeight: '500'
              }}>
                {member.position}
              </h4>
              <p style={{
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '15px',
                fontStyle: 'italic'
              }}>
                {member.experience}
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: '#555',
                lineHeight: '1.5'
              }}>
                {member.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <Card padding="large">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏢</div>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              marginBottom: '15px',
              fontWeight: '600'
            }}>
              Our Organization
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '30px',
              textAlign: 'center'
            }}>
              <div>
                <h4 style={{ color: '#3498db', marginBottom: '10px', fontSize: '2rem' }}>10,000+</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Skilled Professionals</p>
              </div>
              <div>
                <h4 style={{ color: '#3498db', marginBottom: '10px', fontSize: '2rem' }}>4</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Saudi Cities</p>
              </div>
              <div>
                <h4 style={{ color: '#3498db', marginBottom: '10px', fontSize: '2rem' }}>6+</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Major Industries</p>
              </div>
              <div>
                <h4 style={{ color: '#3498db', marginBottom: '10px', fontSize: '2rem' }}>25+</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Years Experience</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default TeamSection;
