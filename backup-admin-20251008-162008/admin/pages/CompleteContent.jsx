import React, { useState } from 'react';

const CompleteContent = () => {
  const [content, setContent] = useState({
    aboutUs: {
      title: 'About Saudi Manpower Supply Company',
      description: 'We are a leading manpower supply company with over 25 years of experience in providing skilled and unskilled labor to various industries across Saudi Arabia.',
      vision: 'To be the most trusted and reliable manpower supply partner in the Middle East.',
      mission: 'To provide exceptional workforce solutions while maintaining the highest standards of service and professionalism.',
      stats: {
        yearsExperience: 25,
        totalEmployees: 10000,
        activeClients: 45,
        completedProjects: 500
      }
    },
    contactInfo: {
      phone: '+966 11 123 4567',
      email: 'info@saudimanpower.com',
      address: 'King Fahd Road, Riyadh, Saudi Arabia',
      workingHours: 'Sunday - Thursday: 8:00 AM - 6:00 PM'
    }
  });

  const [activeSection, setActiveSection] = useState('about');

  const handleInputChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const saveChanges = () => {
    // In a real app, this would save to the backend
    alert('Content saved successfully!');
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>Website Content Management</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Edit and manage your website content</p>
        </div>
        <button
          onClick={saveChanges}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}
        >
          💾 Save Changes
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '2px solid #e2e8f0',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px 0' }}>Content Sections</h3>
          {[
            { id: 'about', title: 'About Us', icon: '📝' },
            { id: 'contact', title: 'Contact Info', icon: '📞' },
            { id: 'stats', title: 'Statistics', icon: '📊' }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '8px',
                border: 'none',
                background: activeSection === section.id ? '#eff6ff' : 'transparent',
                color: activeSection === section.id ? '#2563eb' : '#64748b',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '18px' }}>{section.icon}</span>
              {section.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1 }}>
          {activeSection === 'about' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '2px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px 0' }}>About Us Content</h3>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Company Title
                </label>
                <input
                  type="text"
                  value={content.aboutUs.title}
                  onChange={(e) => handleInputChange('aboutUs', 'title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#1e293b'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Description
                </label>
                <textarea
                  value={content.aboutUs.description}
                  onChange={(e) => handleInputChange('aboutUs', 'description', e.target.value)}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Vision Statement
                </label>
                <textarea
                  value={content.aboutUs.vision}
                  onChange={(e) => handleInputChange('aboutUs', 'vision', e.target.value)}
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Mission Statement
                </label>
                <textarea
                  value={content.aboutUs.mission}
                  onChange={(e) => handleInputChange('aboutUs', 'mission', e.target.value)}
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '2px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px 0' }}>Contact Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={content.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1e293b'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={content.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1e293b'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Office Address
                  </label>
                  <input
                    type="text"
                    value={content.contactInfo.address}
                    onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1e293b'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={content.contactInfo.workingHours}
                    onChange={(e) => handleInputChange('contactInfo', 'workingHours', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1e293b'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'stats' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '2px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px 0' }}>Company Statistics</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={content.aboutUs.stats.yearsExperience}
                    onChange={(e) => handleNestedChange('aboutUs', 'stats', 'yearsExperience', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1e293b'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Total Employees
                  </label>
                  <input
                    type="number"
                    value={content.aboutUs.stats.totalEmployees}
                    onChange={(e) => handleNestedChange('aboutUs', 'stats', 'totalEmployees', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1e293b'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Active Clients
                  </label>
                  <input
                    type="number"
                    value={content.aboutUs.stats.activeClients}
                    onChange={(e) => handleNestedChange('aboutUs', 'stats', 'activeClients', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1e293b'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Completed Projects
                  </label>
                  <input
                    type="number"
                    value={content.aboutUs.stats.completedProjects}
                    onChange={(e) => handleNestedChange('aboutUs', 'stats', 'completedProjects', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1e293b'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteContent;
