import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      console.log('🔐 AdminLogin - Response:', { 
        success: data.success, 
        hasToken: !!data.data?.token,
        hasAdmin: !!data.data?.admin 
      });

      if (data.success) {
        console.log('✅ AdminLogin - Login successful!');
        console.log('📝 AdminLogin - Saving token:', data.data.token.substring(0, 20) + '...');
        
        // Store token
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
        
        console.log('✅ AdminLogin - Token saved to localStorage');
        console.log('✅ AdminLogin - Verifying:', localStorage.getItem('adminToken') ? 'Token exists!' : 'Token NOT found!');
        
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        console.log('🚀 AdminLogin - Navigating to dashboard...');
        // Navigate to dashboard
        navigate('/admin/dashboard');
      } else {
        console.error('❌ AdminLogin - Login failed:', data.message);
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  return (
    <div className="admin-login-container">
      {/* Background Elements */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      {/* Main Login Card */}
      <div className="admin-login-card">
        {/* Header Section */}
        <div className="admin-login-header">
          <div className="company-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
              </svg>
            </div>
            <div className="company-info">
              <h2>Saudi Manpower</h2>
              <p>Leading Workforce Solutions</p>
            </div>
          </div>
          <div className="admin-badge">
            <span className="badge-icon">👑</span>
            <span>Admin Portal</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="welcome-section">
          <h3>Welcome Back</h3>
          <p>Sign in to access your admin dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">
              <span className="label-icon">👤</span>
              Username or Email
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                required
                disabled={loading}
              />
              <div className="input-border"></div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <div className="input-border"></div>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span className="custom-checkbox"></span>
              <span className="checkbox-text">Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span className="button-icon">→</span>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Website Button */}
        <div className="back-to-website-section">
          <button 
            type="button" 
            className="back-to-website-button"
            onClick={() => window.location.href = '/'}
            disabled={loading}
          >
            <span className="back-icon">←</span>
            <span>Back to Website</span>
          </button>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <div className="footer-content">
            <div className="security-badge">
              <span className="security-icon">🛡️</span>
              <span>Secure Login</span>
            </div>
            <p>© 2025 Saudi Manpower. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
