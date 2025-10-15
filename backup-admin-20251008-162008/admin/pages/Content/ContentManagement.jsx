import React, { useState } from 'react';
import '../../styles/management.css';
import './ContentManagement.css';

const ContentManagement = () => {
  const [content, setContent] = useState({
    aboutUs: 'Leading manpower supply company in Saudi Arabia since 1998...',
    vision: 'To be the most trusted partner in workforce solutions.',
    mission: 'Providing quality manpower services across Saudi Arabia.',
    yearsOfExperience: '25+',
    totalEmployees: '10,000+',
    activeClients: '500+',
    companiesServed: '1000+',
    contactEmail: 'info@company.com',
    contactPhone: '+966 12 345 6789',
    address: 'Riyadh, Saudi Arabia'
  });

  const [editing, setEditing] = useState(null);

  const handleSave = (field) => {
    // Save logic here
    setEditing(null);
    alert('Content updated successfully!');
  };

  const sections = [
    { key: 'aboutUs', title: 'About Us', type: 'textarea' },
    { key: 'vision', title: 'Vision', type: 'textarea' },
    { key: 'mission', title: 'Mission', type: 'textarea' },
    { key: 'yearsOfExperience', title: 'Years of Experience', type: 'text' },
    { key: 'totalEmployees', title: 'Total Employees', type: 'text' },
    { key: 'activeClients', title: 'Active Clients', type: 'text' },
    { key: 'companiesServed', title: 'Companies Served', type: 'text' }
  ];

  return (
    <div className="content-management">
      <div className="page-header">
        <div>
          <h2>Website Content Management</h2>
          <p>Edit homepage and company information</p>
        </div>
      </div>

      <div className="content-sections">
        {sections.map(section => (
          <div key={section.key} className="content-card">
            <div className="content-card-header">
              <h3>{section.title}</h3>
              <button 
                className="btn-primary"
                onClick={() => editing === section.key ? handleSave(section.key) : setEditing(section.key)}
              >
                {editing === section.key ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="content-card-body">
              {editing === section.key ? (
                section.type === 'textarea' ? (
                  <textarea
                    value={content[section.key]}
                    onChange={e => setContent({...content, [section.key]: e.target.value})}
                    rows="5"
                  />
                ) : (
                  <input
                    type="text"
                    value={content[section.key]}
                    onChange={e => setContent({...content, [section.key]: e.target.value})}
                  />
                )
              ) : (
                <p>{content[section.key]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h3>Contact Information</h3>
        </div>
        <div className="contact-info-grid">
          <div className="info-item">
            <label>Email</label>
            <p>{content.contactEmail}</p>
          </div>
          <div className="info-item">
            <label>Phone</label>
            <p>{content.contactPhone}</p>
          </div>
          <div className="info-item">
            <label>Address</label>
            <p>{content.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
