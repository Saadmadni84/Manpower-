import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SecureAdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    rememberMe: false 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(null);

  // Check for existing lockout
  useEffect(() => {
    const lockData = localStorage.getItem('adminLockout');
    if (lockData) {
      const { timestamp, attempts } = JSON.parse(lockData);
      const now = Date.now();
      const lockDuration = 15 * 60 * 1000; // 15 minutes
      
      if (now - timestamp < lockDuration) {
        setIsLocked(true);
        setAttempts(attempts);
        setLockTime(new Date(timestamp + lockDuration));
      } else {
        localStorage.removeItem('adminLockout');
      }
    }
  }, []);

  // CSRF Token generation
  const generateCSRFToken = () => {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('csrfToken', token);
    return token;
  };

  // Secure password validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Account temporarily locked. Please try again later.');
      return;
    }

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate secure authentication
      const csrfToken = generateCSRFToken();
      
      // Mock authentication - In real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials (In real app, this would be server-side validation)
      if (formData.username === 'admin' && formData.password === 'Admin123!') {
        // Successful login
        const sessionData = {
          user: {
            id: 1,
            username: formData.username,
            email: 'admin@company.com',
            role: 'admin',
            name: 'Administrator',
            lastLogin: new Date().toISOString()
          },
          sessionId: Math.random().toString(36).substring(2, 15),
          csrfToken,
          loginTime: Date.now(),
          rememberMe: formData.rememberMe
        };

        // Store session data
        if (formData.rememberMe) {
          localStorage.setItem('adminSession', JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
        }

        // Clear any lockout data
        localStorage.removeItem('adminLockout');
        
        // Redirect to dashboard
        navigate('/admin/dashboard');
      } else {
        // Failed login
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          // Lock account for 15 minutes
          const lockData = {
            timestamp: Date.now(),
            attempts: newAttempts
          };
          localStorage.setItem('adminLockout', JSON.stringify(lockData));
          setIsLocked(true);
          setLockTime(new Date(Date.now() + 15 * 60 * 1000));
          setError('Too many failed attempts. Account locked for 15 minutes.');
        } else {
          setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const formatTimeRemaining = () => {
    if (!lockTime) return '';
    const now = new Date();
    const diff = lockTime - now;
    if (diff <= 0) {
      setIsLocked(false);
      setLockTime(null);
      localStorage.removeItem('adminLockout');
      return '';
    }
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '450px',
        width: '100%',
        position: 'relative'
      }}>
        {/* Company Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            color: 'white',
            marginBottom: '16px',
            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)'
          }}>
            👷
          </div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1e293b', 
            margin: '0 0 8px 0' 
          }}>
            Admin Portal
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#64748b', 
            margin: 0 
          }}>
            Saudi Manpower Supply Company
          </p>
        </div>

        {/* Security Notice */}
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#92400e'
        }}>
          🔒 <strong>Secure Access:</strong> This is a protected area. All activities are logged and monitored.
        </div>

        {/* Lockout Notice */}
        {isLocked && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', marginBottom: '4px' }}>
              Account Temporarily Locked
            </div>
            <div style={{ fontSize: '12px', color: '#991b1b' }}>
              Try again in: {formatTimeRemaining()}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #fecaca'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Username or Email
            </label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username or email" 
              disabled={isLocked}
              required
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px',
                fontSize: '14px',
                color: '#1e293b',
                background: isLocked ? '#f9fafb' : 'white',
                transition: 'all 0.3s ease'
              }} 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Password
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password" 
              disabled={isLocked}
              required
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px',
                fontSize: '14px',
                color: '#1e293b',
                background: isLocked ? '#f9fafb' : 'white',
                transition: 'all 0.3s ease'
              }} 
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              color: '#475569' 
            }}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLocked}
                style={{ 
                  width: '18px', 
                  height: '18px',
                  accentColor: '#2563eb'
                }}
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading || isLocked}
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: loading || isLocked ? '#94a3b8' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || isLocked ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading || isLocked ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Signing In...
              </span>
            ) : (
              '🔐 Sign In Securely'
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px', 
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0' }}>
            Default Credentials for Testing:
          </p>
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontFamily: 'monospace' }}>
            Username: admin | Password: Admin123!
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '16px 0 0 0' }}>
            © 2025 Saudi Manpower Supply Company. All rights reserved.
          </p>
        </div>

        {/* CSS Animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default SecureAdminLogin;
