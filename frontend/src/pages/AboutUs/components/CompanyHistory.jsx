import React from 'react';
import Card from '../../../components/ui/Card/Card';

const CompanyHistory = () => {
  const milestones = [
    {
      year: '1999',
      title: 'Company Founded',
      description: 'Started as a small manpower agency in Riyadh with a vision to provide quality workforce solutions.',
      icon: '🏢'
    },
    {
      year: '2005',
      title: 'Regional Expansion',
      description: 'Expanded operations to Jeddah and Dammam, establishing our presence across major Saudi cities.',
      icon: '🌍'
    },
    {
      year: '2010',
      title: '10,000+ Employees',
      description: 'Reached the milestone of 10,000+ active employees serving various industries across Saudi Arabia.',
      icon: '👥'
    },
    {
      year: '2015',
      title: 'Industry Leadership',
      description: 'Became the leading manpower supplier for airport operations and corporate offices in Saudi Arabia.',
      icon: '🏆'
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched digital platforms for efficient recruitment and employee management systems.',
      icon: '💻'
    },
    {
      year: '2024',
      title: '25 Years of Excellence',
      description: 'Celebrating 25 years of providing exceptional manpower solutions with continued growth and innovation.',
      icon: '🎉'
    }
  ];

  return (
    <section style={{ marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '20px' }}>
          Our Journey
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          From a small startup to becoming Saudi Arabia's trusted manpower partner
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {milestones.map((milestone, index) => (
          <Card key={index} hover padding="large">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                {milestone.icon}
              </div>
              <h3 style={{
                fontSize: '2rem',
                color: '#3498db',
                marginBottom: '15px',
                fontWeight: '700'
              }}>
                {milestone.year}
              </h3>
              <h4 style={{
                fontSize: '1.3rem',
                marginBottom: '15px',
                color: '#2c3e50',
                fontWeight: '600'
              }}>
                {milestone.title}
              </h4>
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                {milestone.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CompanyHistory;
