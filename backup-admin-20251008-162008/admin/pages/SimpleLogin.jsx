import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    // Mock successful login
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: formData.email,
      role: 'admin',
      name: 'Admin User'
    }));
    
    // Navigate to dashboard
    navigate('/admin/dashboard');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Admin Login
        </h1>
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '14px'
              }} 
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '14px'
              }} 
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          © 2025 Manpower Supply Company
        </p>
      </div>
    </div>
  );
};

export default SimpleLogin;
