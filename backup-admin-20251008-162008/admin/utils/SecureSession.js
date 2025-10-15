// Secure Session Management Utility
class SecureSession {
  constructor() {
    this.sessionKey = 'adminSession';
    this.csrfKey = 'csrfToken';
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.rememberTimeout = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  // Generate secure session ID
  generateSessionId() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Generate CSRF token
  generateCSRFToken() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Hash password (client-side for demo, should be server-side in production)
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'saudi_manpower_salt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Create secure session
  createSession(userData, rememberMe = false) {
    const sessionId = this.generateSessionId();
    const csrfToken = this.generateCSRFToken();
    const now = Date.now();
    
    const session = {
      sessionId,
      csrfToken,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        permissions: userData.permissions || ['read', 'write', 'delete']
      },
      loginTime: now,
      lastActivity: now,
      rememberMe,
      expiresAt: rememberMe ? now + this.rememberTimeout : now + this.sessionTimeout,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    // Store session
    if (rememberMe) {
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    } else {
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    }

    // Store CSRF token separately
    sessionStorage.setItem(this.csrfKey, csrfToken);

    return session;
  }

  // Get current session
  getSession() {
    try {
      let sessionData = sessionStorage.getItem(this.sessionKey) || localStorage.getItem(this.sessionKey);
      
      if (!sessionData) {
        return null;
      }

      const session = JSON.parse(sessionData);
      const now = Date.now();

      // Check if session is expired
      if (now > session.expiresAt) {
        this.destroySession();
        return null;
      }

      // Update last activity
      session.lastActivity = now;
      this.updateSession(session);

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      this.destroySession();
      return null;
    }
  }

  // Update session
  updateSession(session) {
    try {
      if (session.rememberMe) {
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
      } else {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  // Validate CSRF token
  validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem(this.csrfKey);
    return storedToken === token;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const session = this.getSession();
    return session !== null && session.user && session.user.role === 'admin';
  }

  // Check user permissions
  hasPermission(permission) {
    const session = this.getSession();
    if (!session || !session.user) {
      return false;
    }
    return session.user.permissions.includes(permission);
  }

  // Get current user
  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  }

  // Get CSRF token
  getCSRFToken() {
    return sessionStorage.getItem(this.csrfKey);
  }

  // Log activity
  logActivity(action, details = {}) {
    const session = this.getSession();
    if (!session) return;

    const activity = {
      timestamp: new Date().toISOString(),
      action,
      details,
      sessionId: session.sessionId,
      userId: session.user.id
    };

    // Store in session history (keep last 50 activities)
    if (!session.activities) {
      session.activities = [];
    }
    
    session.activities.unshift(activity);
    if (session.activities.length > 50) {
      session.activities = session.activities.slice(0, 50);
    }

    this.updateSession(session);
  }

  // Destroy session
  destroySession() {
    try {
      sessionStorage.removeItem(this.sessionKey);
      localStorage.removeItem(this.sessionKey);
      sessionStorage.removeItem(this.csrfKey);
      
      // Clear any lockout data
      localStorage.removeItem('adminLockout');
      
      // Log logout activity
      console.log('Admin session destroyed');
    } catch (error) {
      console.error('Error destroying session:', error);
    }
  }

  // Extend session
  extendSession() {
    const session = this.getSession();
    if (session) {
      const now = Date.now();
      session.lastActivity = now;
      session.expiresAt = session.rememberMe ? 
        now + this.rememberTimeout : 
        now + this.sessionTimeout;
      this.updateSession(session);
    }
  }

  // Get client IP (mock implementation)
  getClientIP() {
    // In a real application, this would be provided by the server
    return '127.0.0.1';
  }

  // Security checks
  performSecurityChecks() {
    const session = this.getSession();
    if (!session) return false;

    // Check if user agent changed
    if (session.userAgent !== navigator.userAgent) {
      console.warn('User agent mismatch detected');
      this.destroySession();
      return false;
    }

    // Check session age
    const now = Date.now();
    const sessionAge = now - session.loginTime;
    const maxSessionAge = 8 * 60 * 60 * 1000; // 8 hours

    if (sessionAge > maxSessionAge) {
      console.warn('Session too old');
      this.destroySession();
      return false;
    }

    return true;
  }

  // Auto-extend session on activity
  setupAutoExtension() {
    // Extend session every 5 minutes of activity
    setInterval(() => {
      if (this.isAuthenticated()) {
        this.extendSession();
      }
    }, 5 * 60 * 1000);

    // Perform security checks every minute
    setInterval(() => {
      this.performSecurityChecks();
    }, 60 * 1000);
  }
}

// Create singleton instance
const secureSession = new SecureSession();

// Setup auto-extension when module loads
if (typeof window !== 'undefined') {
  secureSession.setupAutoExtension();
}

export default secureSession;
