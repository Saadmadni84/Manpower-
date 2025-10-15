const { authenticateAdmin, authorizeAdmin } = require('./auth');

// Middleware to check if user is super admin
const requireSuperAdmin = [
  authenticateAdmin,
  authorizeAdmin(['super_admin'])
];

// Middleware to check if user is at least admin
const requireAdmin = [
  authenticateAdmin,
  authorizeAdmin(['super_admin', 'admin'])
];

// Middleware to check if user can manage specific settings category
const canManageCategory = (category) => {
  return [
    authenticateAdmin,
    (req, res, next) => {
      const admin = req.admin;
      
      // Super admins can manage everything
      if (admin.role === 'super_admin') {
        return next();
      }
      
      // Regular admins can manage most categories except security and users
      if (admin.role === 'admin') {
        const restrictedCategories = ['security', 'api', 'backup'];
        if (restrictedCategories.includes(category)) {
          return res.status(403).json({
            success: false,
            message: `Only super admins can manage ${category} settings.`
          });
        }
        return next();
      }
      
      // Editors cannot manage settings
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to manage settings.'
      });
    }
  ];
};

// Middleware to log settings changes
const logSettingsChange = async (req, res, next) => {
  const originalSend = res.json;
  
  res.json = function(data) {
    // Log the change if it was successful
    if (data && data.success && req.admin) {
      const logData = {
        admin: req.admin._id,
        adminUsername: req.admin.username,
        action: req.method,
        category: req.params.category || req.body.category,
        endpoint: req.originalUrl,
        timestamp: new Date(),
        ip: req.ip || req.connection.remoteAddress
      };
      
      console.log('Settings Change:', logData);
      
      // You can save this to a database if you have an AuditLog model
      // AuditLog.create(logData);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Middleware to validate setting value based on dataType
const validateSettingValue = (req, res, next) => {
  const { value, dataType } = req.body;
  
  if (!value || !dataType) {
    return next();
  }
  
  try {
    switch (dataType) {
      case 'number':
        if (isNaN(Number(value))) {
          return res.status(400).json({
            success: false,
            message: 'Value must be a valid number'
          });
        }
        break;
      
      case 'boolean':
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
          return res.status(400).json({
            success: false,
            message: 'Value must be a boolean'
          });
        }
        break;
      
      case 'array':
        if (!Array.isArray(value)) {
          return res.status(400).json({
            success: false,
            message: 'Value must be an array'
          });
        }
        break;
      
      case 'object':
      case 'json':
        if (typeof value !== 'object') {
          return res.status(400).json({
            success: false,
            message: 'Value must be an object'
          });
        }
        break;
    }
    
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid value format'
    });
  }
};

module.exports = {
  requireSuperAdmin,
  requireAdmin,
  canManageCategory,
  logSettingsChange,
  validateSettingValue
};
