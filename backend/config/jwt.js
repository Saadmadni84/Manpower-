const jwt = require('jsonwebtoken');

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRE || '24h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  algorithm: 'HS256'
};

// Generate JWT token
const generateToken = (payload, expiresIn = JWT_CONFIG.expiresIn) => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn,
    algorithm: JWT_CONFIG.algorithm
  });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.refreshExpiresIn,
    algorithm: JWT_CONFIG.algorithm
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret, {
      algorithms: [JWT_CONFIG.algorithm]
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Decode JWT token without verification (for debugging)
const decodeToken = (token) => {
  return jwt.decode(token);
};

// Generate token pair (access + refresh)
const generateTokenPair = (payload) => {
  const accessToken = generateToken(payload);
  const refreshToken = generateRefreshToken({ userId: payload.userId });
  
  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_CONFIG.expiresIn
  };
};

// Extract token from Authorization header
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

// Admin-specific token generation
const generateAdminToken = (adminData) => {
  const payload = {
    userId: adminData._id,
    email: adminData.email,
    role: adminData.role || 'admin',
    permissions: adminData.permissions || [],
    isAdmin: true
  };
  
  return generateTokenPair(payload);
};

// Regular user token generation (for future use)
const generateUserToken = (userData) => {
  const payload = {
    userId: userData._id,
    email: userData.email,
    role: userData.role || 'user',
    isAdmin: false
  };
  
  return generateTokenPair(payload);
};

// Token blacklist (for logout functionality)
const tokenBlacklist = new Set();

// Add token to blacklist
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

// Check if token is blacklisted
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

// Clear expired tokens from blacklist (can be called periodically)
const clearExpiredTokens = () => {
  // This is a simple implementation
  // In production, you might want to use Redis or database for blacklist
  for (const token of tokenBlacklist) {
    try {
      jwt.verify(token, JWT_CONFIG.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        tokenBlacklist.delete(token);
      }
    }
  }
};

module.exports = {
  JWT_CONFIG,
  generateToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateTokenPair,
  extractTokenFromHeader,
  generateAdminToken,
  generateUserToken,
  blacklistToken,
  isTokenBlacklisted,
  clearExpiredTokens
};
