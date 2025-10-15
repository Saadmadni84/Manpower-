import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{marginBottom: '20px'}}>
              <circle cx="40" cy="40" r="40" fill="#10b981" opacity="0.1"/>
              <circle cx="40" cy="40" r="32" fill="#10b981" opacity="0.2"/>
              <path d="M50 30L37.5 42.5L30 35" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1>Check Your Email</h1>
            <p>We've sent password reset instructions to {email}</p>
          </div>

          <div className="alert" style={{background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d'}}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
            <div>
              <strong>Email sent successfully!</strong>
              <p>Please check your inbox and follow the instructions.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin-login')}
            className="btn-primary"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"/>
            </svg>
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{marginBottom: '20px'}}>
            <rect width="60" height="60" rx="12" fill="#f59e0b" opacity="0.1"/>
            <path d="M30 15C21.716 15 15 21.716 15 30c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15z" fill="#f59e0b" opacity="0.2"/>
            <path d="M30 25v10M30 40v.01" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <h1>Forgot Password?</h1>
          <p>No worries, we'll send you reset instructions</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
            </svg>
            <div>
              <strong>{error}</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{marginBottom: '16px'}}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <span>Send Reset Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin-login')}
            className="link-button"
            style={{width: '100%', textAlign: 'center'}}
            disabled={loading}
          >
            Back to Login
          </button>
        </form>
      </div>

      <button className="btn-back-home" onClick={() => navigate('/')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
        <span>Back to Website</span>
      </button>
    </div>
  );
};

export default ForgotPassword;
