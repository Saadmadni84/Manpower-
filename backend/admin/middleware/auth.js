const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.adminToken;

    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = verifyToken(token);
    console.log('Auth middleware - Decoded token:', decoded);
    
    const admin = await AdminUser.findById(decoded.userId).select('-password_hash');
    console.log('Auth middleware - Admin found:', admin ? { id: admin._id, username: admin.username, is_active: admin.is_active } : 'Not found');
    
    if (!admin || !admin.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or inactive user.' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Role-based authorization
const authorizeAdmin = (roles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    if (roles.length && !roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions.' 
      });
    }

    next();
  };
};

// Rate limiting for login attempts
const loginAttempts = new Map();

const rateLimitLogin = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  
  const now = Date.now();
  const timeWindow = 15 * 60 * 1000; // 15 minutes
  
  // Reset if outside time window
  if (now - attempts.lastAttempt > timeWindow) {
    attempts.count = 0;
  }
  
  // Check if too many attempts
  if (attempts.count >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again in 15 minutes.',
      retryAfter: Math.ceil((attempts.lastAttempt + timeWindow - now) / 1000)
    });
  }
  
  req.loginAttempts = attempts;
  next();
};

const recordLoginAttempt = (req, success = false) => {
  const ip = req.ip || req.connection.remoteAddress;
  const attempts = req.loginAttempts || { count: 0, lastAttempt: 0 };
  
  if (success) {
    attempts.count = 0;
  } else {
    attempts.count++;
    attempts.lastAttempt = Date.now();
  }
  
  loginAttempts.set(ip, attempts);
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateAdmin,
  authorizeAdmin,
  rateLimitLogin,
  recordLoginAttempt
};
