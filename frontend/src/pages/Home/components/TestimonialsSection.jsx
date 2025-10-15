import React from 'react';
import Card from '../../../components/ui/Card/Card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "For over 15 years, they have provided us with exceptional airport operations staff. Their commitment to quality and reliability is outstanding.",
      author: "Ahmed Al-Rashid",
      position: "Operations Director, King Khalid International Airport",
      avatar: "👨‍✈️"
    },
    {
      quote: "Their catering professionals have been instrumental in our success. From corporate events to daily operations, they deliver excellence.",
      author: "Fatima Al-Zahra",
      position: "General Manager, Saudi Catering Group",
      avatar: "👩‍🍳"
    },
    {
      quote: "The manpower solutions provided for our construction projects have been exceptional. Skilled, reliable, and safety-focused professionals.",
      author: "Mohammed Al-Sheikh",
      position: "Project Manager, Saudi Construction Company",
      avatar: "👷‍♂️"
    }
  ];

  return (
    <section id="testimonials" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
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
          radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
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
          Trusted by Leading Companies
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '40px 30px',
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
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: -1
              }}></div>

              <div style={{ fontSize: '4rem', marginBottom: '20px', filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))' }}>
                {testimonial.avatar}
              </div>
              <blockquote style={{
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: '#cbd5e1',
                marginBottom: '25px',
                lineHeight: '1.6',
                position: 'relative'
              }}>
                <span style={{
                  fontSize: '2rem',
                  color: 'rgba(16, 185, 129, 0.5)',
                  position: 'absolute',
                  left: '-20px',
                  top: '-10px'
                }}>"</span>
                {testimonial.quote}
                <span style={{
                  fontSize: '2rem',
                  color: 'rgba(16, 185, 129, 0.5)',
                  position: 'absolute',
                  right: '-20px',
                  bottom: '-15px'
                }}>"</span>
              </blockquote>
              <div>
                <h4 style={{
                  fontSize: '1.2rem',
                  margin: '0 0 5px 0',
                  color: '#f1f5f9',
                  fontWeight: '600'
                }}>
                  {testimonial.author}
                </h4>
                <p style={{
                  color: '#94a3b8',
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {testimonial.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

