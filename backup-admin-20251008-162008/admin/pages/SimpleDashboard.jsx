import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/admin-login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          <h1 style={{ color: '#1e293b', margin: 0 }}>Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: '#dbeafe',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#1e40af', margin: '0 0 10px 0' }}>Total Services</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af' }}>8</div>
          </div>
          
          <div style={{
            background: '#d1fae5',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#059669', margin: '0 0 10px 0' }}>Active Clients</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669' }}>45</div>
          </div>
          
          <div style={{
            background: '#fef3c7',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#d97706', margin: '0 0 10px 0' }}>Job Postings</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>23</div>
          </div>
          
          <div style={{
            background: '#fce7f3',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#be185d', margin: '0 0 10px 0' }}>Applications</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#be185d' }}>156</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <h2>Welcome to the Admin Dashboard!</h2>
          <p>Your admin system is working perfectly. You can now manage:</p>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '20px auto' }}>
            <li>Website Content</li>
            <li>Services Management</li>
            <li>Client Portfolio</li>
            <li>Job Postings & Applications</li>
            <li>Gallery Management</li>
            <li>Contact Enquiries</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
