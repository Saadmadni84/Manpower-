const jwt = require('jsonwebtoken');
const { verifyToken, extractTokenFromHeader, isTokenBlacklisted } = require('../config/jwt');
const AdminUser = require('../admin/models/AdminUser');
const { createAuditLog } = require('../models/AuditLog');

// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked'
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists and is active
    const user = await AdminUser.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Check if account is locked
    if (user.isAccountLocked && user.isAccountLocked()) {
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Update last active time
    user.activity.lastActive = new Date();
    await user.save();

    // Add user to request object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token && !isTokenBlacklisted(token)) {
      const decoded = verifyToken(token);
      const user = await AdminUser.findById(decoded.userId).select('-password');
      
      if (user && user.status === 'active') {
        req.user = user;
        req.token = token;
      }
    }
  } catch (error) {
    // Ignore authentication errors for optional auth
    console.log('Optional auth error (ignored):', error.message);
  }
  
  next();
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      // Log unauthorized access attempt
      createAuditLog({
        action: 'Unauthorized access attempt',
        entity: { type: 'AdminUser', id: req.user._id.toString() },
        operation: 'read',
        user: {
          id: req.user._id,
          email: req.user.personalInfo.email,
          name: req.user.fullName,
          role: req.user.role
        },
        request: {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          method: req.method,
          url: req.originalUrl
        },
        status: 'failure',
        error: {
          message: `Insufficient permissions. Required roles: ${roles.join(', ')}`
        }
      });

      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Permission-based authorization middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.hasPermission(permission)) {
      // Log unauthorized access attempt
      createAuditLog({
        action: 'Unauthorized access attempt',
        entity: { type: 'AdminUser', id: req.user._id.toString() },
        operation: 'read',
        user: {
          id: req.user._id,
          email: req.user.personalInfo.email,
          name: req.user.fullName,
          role: req.user.role
        },
        request: {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          method: req.method,
          url: req.originalUrl
        },
        status: 'failure',
        error: {
          message: `Insufficient permissions. Required permission: ${permission}`
        }
      });

      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' is required`
      });
    }

    next();
  };
};

// Multiple permissions middleware (user must have at least one)
const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const hasPermission = permissions.some(permission => 
      req.user.hasPermission(permission)
    );

    if (!hasPermission) {
      // Log unauthorized access attempt
      createAuditLog({
        action: 'Unauthorized access attempt',
        entity: { type: 'AdminUser', id: req.user._id.toString() },
        operation: 'read',
        user: {
          id: req.user._id,
          email: req.user.personalInfo.email,
          name: req.user.fullName,
          role: req.user.role
        },
        request: {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          method: req.method,
          url: req.originalUrl
        },
        status: 'failure',
        error: {
          message: `Insufficient permissions. Required one of: ${permissions.join(', ')}`
        }
      });

      return res.status(403).json({
        success: false,
        message: `At least one of the following permissions is required: ${permissions.join(', ')}`
      });
    }

    next();
  };
};

// All permissions middleware (user must have all)
const requireAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const hasAllPermissions = permissions.every(permission => 
      req.user.hasPermission(permission)
    );

    if (!hasAllPermissions) {
      // Log unauthorized access attempt
      createAuditLog({
        action: 'Unauthorized access attempt',
        entity: { type: 'AdminUser', id: req.user._id.toString() },
        operation: 'read',
        user: {
          id: req.user._id,
          email: req.user.personalInfo.email,
          name: req.user.fullName,
          role: req.user.role
        },
        request: {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          method: req.method,
          url: req.originalUrl
        },
        status: 'failure',
        error: {
          message: `Insufficient permissions. Required all of: ${permissions.join(', ')}`
        }
      });

      return res.status(403).json({
        success: false,
        message: `All of the following permissions are required: ${permissions.join(', ')}`
      });
    }

    next();
  };
};

// Super admin only middleware
const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'super_admin') {
    // Log unauthorized access attempt
    createAuditLog({
      action: 'Unauthorized access attempt',
      entity: { type: 'AdminUser', id: req.user._id.toString() },
      operation: 'read',
      user: {
        id: req.user._id,
        email: req.user.personalInfo.email,
        name: req.user.fullName,
        role: req.user.role
      },
      request: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method,
        url: req.originalUrl
      },
      status: 'failure',
      error: {
        message: 'Super admin access required'
      }
    });

    return res.status(403).json({
      success: false,
      message: 'Super admin access required'
    });
  }

  next();
};

// Admin or above middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const adminRoles = ['super_admin', 'admin'];
  if (!adminRoles.includes(req.user.role)) {
    // Log unauthorized access attempt
    createAuditLog({
      action: 'Unauthorized access attempt',
      entity: { type: 'AdminUser', id: req.user._id.toString() },
      operation: 'read',
      user: {
        id: req.user._id,
        email: req.user.personalInfo.email,
        name: req.user.fullName,
        role: req.user.role
      },
      request: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method,
        url: req.originalUrl
      },
      status: 'failure',
      error: {
        message: 'Admin access required'
      }
    });

    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  authorize,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireSuperAdmin,
  requireAdmin
};
