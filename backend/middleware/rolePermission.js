const { APP_CONSTANTS } = require('../config/constants');

// Role-based permission checking middleware
const checkRolePermission = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const roleHierarchy = {
      'super_admin': 4,
      'admin': 3,
      'manager': 2,
      'staff': 1
    };

    const userRoleLevel = roleHierarchy[req.user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return res.status(403).json({
        success: false,
        message: `Role '${requiredRole}' or higher is required`
      });
    }

    next();
  };
};

// Permission checking middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' is required`
      });
    }

    next();
  };
};

// Multiple permissions middleware (user must have at least one)
const checkAnyPermission = (...permissions) => {
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
      return res.status(403).json({
        success: false,
        message: `At least one of the following permissions is required: ${permissions.join(', ')}`
      });
    }

    next();
  };
};

// All permissions middleware (user must have all)
const checkAllPermissions = (...permissions) => {
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
      return res.status(403).json({
        success: false,
        message: `All of the following permissions are required: ${permissions.join(', ')}`
      });
    }

    next();
  };
};

// Resource ownership middleware
const checkResourceOwnership = (resourceField = 'createdBy') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admins can access all resources
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Admins can access all resources
    if (req.user.role === 'admin') {
      return next();
    }

    // Managers can access resources they created or are assigned to
    if (req.user.role === 'manager') {
      // Check if user owns the resource
      if (req.resource && req.resource[resourceField] && 
          req.resource[resourceField].toString() === req.user._id.toString()) {
        return next();
      }
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access resources you created'
      });
    }

    // Staff can only access their own resources
    if (req.resource && req.resource[resourceField] && 
        req.resource[resourceField].toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources'
    });
  };
};

// Department-based access control
const checkDepartmentAccess = (allowedDepartments) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admins and admins can access all departments
    if (['super_admin', 'admin'].includes(req.user.role)) {
      return next();
    }

    // Check if user's department is in allowed departments
    if (req.user.profile.department && 
        allowedDepartments.includes(req.user.profile.department)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. Insufficient department permissions'
    });
  };
};

// Time-based access control
const checkTimeAccess = (allowedHours = { start: 8, end: 18 }) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admins and admins have 24/7 access
    if (['super_admin', 'admin'].includes(req.user.role)) {
      return next();
    }

    const currentHour = new Date().getHours();
    
    if (currentHour >= allowedHours.start && currentHour <= allowedHours.end) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. System is only accessible between ${allowedHours.start}:00 and ${allowedHours.end}:00`
    });
  };
};

// IP-based access control
const checkIPAccess = (allowedIPs = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admins have access from anywhere
    if (req.user.role === 'super_admin') {
      return next();
    }

    // If no IP restrictions, allow access
    if (allowedIPs.length === 0) {
      return next();
    }

    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.includes(clientIP)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. IP address not allowed'
    });
  };
};

// Operation-specific permissions
const checkOperationPermission = (operation, resourceType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const operationPermissions = {
      'create': `${resourceType}_create`,
      'read': `${resourceType}_read`,
      'update': `${resourceType}_update`,
      'delete': `${resourceType}_delete`,
      'export': `${resourceType}_export`,
      'import': `${resourceType}_import`
    };

    const requiredPermission = operationPermissions[operation];
    
    if (!requiredPermission || !req.user.hasPermission(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Permission required for ${operation} operation on ${resourceType}`
      });
    }

    next();
  };
};

// Conditional permission checking
const checkConditionalPermission = (condition, permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if condition is met
    const conditionMet = typeof condition === 'function' ? 
      condition(req) : condition;

    if (conditionMet && !req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' is required for this operation`
      });
    }

    next();
  };
};

// Export all middleware functions
module.exports = {
  checkRolePermission,
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  checkResourceOwnership,
  checkDepartmentAccess,
  checkTimeAccess,
  checkIPAccess,
  checkOperationPermission,
  checkConditionalPermission
};
