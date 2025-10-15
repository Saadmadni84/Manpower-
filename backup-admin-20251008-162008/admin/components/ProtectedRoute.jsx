import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import secureSession from '../utils/SecureSession';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const authenticated = secureSession.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Check permissions if required
          if (requiredPermissions.length > 0) {
            const hasAllPermissions = requiredPermissions.every(permission => 
              secureSession.hasPermission(permission)
            );
            setHasPermission(hasAllPermissions);
          }

          // Log page access
          secureSession.logActivity('page_access', {
            path: location.pathname,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setHasPermission(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname, requiredPermissions]);

  // Show loading while checking authentication
  if (isChecking) {
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
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px auto'
          }}></div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1e293b', 
            margin: '0 0 8px 0' 
          }}>
            Verifying Access
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#64748b', 
            margin: 0 
          }}>
            Please wait while we check your permissions...
          </p>
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
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Show access denied if no permission
  if (!hasPermission) {
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
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '500px',
          width: '90%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            margin: '0 auto 20px auto'
          }}>
            🚫
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1e293b', 
            margin: '0 0 12px 0' 
          }}>
            Access Denied
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#64748b', 
            margin: '0 0 24px 0',
            lineHeight: '1.6'
          }}>
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: '12px 24px',
                background: '#f1f5f9',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
