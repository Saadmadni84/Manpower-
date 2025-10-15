import React from 'react';

const SocialLinks = () => {
  const socialPlatforms = [
    { name: 'Facebook', url: '#', icon: '📘' },
    { name: 'Twitter', url: '#', icon: '🐦' },
    { name: 'LinkedIn', url: '#', icon: '💼' },
    { name: 'Instagram', url: '#', icon: '📷' },
  ];

  return (
    <div style={{ display: 'flex', gap: '15px' }}>
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: '#34495e',
            borderRadius: '50%',
            textDecoration: 'none',
            fontSize: '18px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#3498db';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#34495e';
            e.target.style.transform = 'translateY(0)';
          }}
          title={platform.name}
        >
          {platform.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;

