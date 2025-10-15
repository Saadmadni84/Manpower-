import React from 'react';

const StatsSection = () => {
  const stats = [
    { number: '10,000+', label: 'Active Employees' },
    { number: '25+', label: 'Years of Excellence' },
    { number: '6+', label: 'Major Industries' },
    { number: '4', label: 'Saudi Cities' }
  ];

  return (
    <section id="stats" style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      padding: '80px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)
        `,
        zIndex: 1
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '50px', 
          fontSize: '2.5rem',
          color: '#f1f5f9',
          fontWeight: '700',
          textShadow: '0 0 20px rgba(241, 245, 249, 0.3)'
        }}>
          Our Success in Numbers
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            }}>
              {/* Glow Effect */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: -1
              }}></div>
              
              <h3 style={{
                fontSize: '3.5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: '0 0 15px 0',
                fontWeight: '800',
                textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
              }}>
                {stat.number}
              </h3>
              <p style={{
                fontSize: '1.2rem',
                color: '#cbd5e1',
                margin: 0,
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

