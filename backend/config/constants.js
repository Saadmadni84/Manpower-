// Application constants
const APP_CONSTANTS = {
  // Company Information
  COMPANY: {
    NAME: 'Manpower Supply Company',
    ESTABLISHED_YEAR: 1998, // 25+ years as mentioned in brief
    TOTAL_EMPLOYEES: 10000,
    LOCATIONS: ['Jeddah', 'Riyadh', 'Dammam', 'Madina'],
    PHONE: '+966-XX-XXXXXXX',
    EMAIL: 'info@manpowercompany.com',
    ADDRESS: 'Saudi Arabia'
  },

  // Industries served
  INDUSTRIES: [
    'Airport Operations',
    'Corporate Offices',
    'Catering Services',
    'Inventory & Logistics',
    'Construction',
    'Facility Management',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing'
  ],

  // Job categories
  JOB_CATEGORIES: [
    'Administrative',
    'Technical',
    'Operations',
    'Management',
    'Support Staff',
    'Specialized Services'
  ],

  // Gallery categories
  GALLERY_CATEGORIES: [
    'Company Events',
    'Work Sites',
    'Team Photos',
    'Awards & Achievements',
    'Training Programs',
    'Client Visits'
  ],

  // File upload limits
  FILE_LIMITS: {
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    CV_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    DOCUMENT_MAX_SIZE: 20 * 1024 * 1024, // 20MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_CV_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Admin roles and permissions
  ADMIN_ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    STAFF: 'staff'
  },

  ADMIN_PERMISSIONS: {
    // Content management
    MANAGE_COMPANY_INFO: 'manage_company_info',
    MANAGE_SERVICES: 'manage_services',
    MANAGE_CLIENTS: 'manage_clients',
    MANAGE_CONTRACTS: 'manage_contracts',
    MANAGE_GALLERY: 'manage_gallery',
    
    // Job management
    MANAGE_JOBS: 'manage_jobs',
    VIEW_APPLICATIONS: 'view_applications',
    MANAGE_APPLICATIONS: 'manage_applications',
    
    // System management
    MANAGE_USERS: 'manage_users',
    MANAGE_SETTINGS: 'manage_settings',
    VIEW_ANALYTICS: 'view_analytics',
    MANAGE_BACKUPS: 'manage_backups'
  },

  // Status constants
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DRAFT: 'draft',
    PUBLISHED: 'published'
  },

  // Application status
  APPLICATION_STATUS: {
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    SHORTLISTED: 'shortlisted',
    INTERVIEW_SCHEDULED: 'interview_scheduled',
    INTERVIEWED: 'interviewed',
    SELECTED: 'selected',
    REJECTED: 'rejected',
    ON_HOLD: 'on_hold'
  },

  // Contact inquiry types
  INQUIRY_TYPES: [
    'General Inquiry',
    'Service Request',
    'Partnership Inquiry',
    'Job Application',
    'Complaint',
    'Feedback'
  ],

  // Languages supported
  LANGUAGES: {
    ENGLISH: 'en',
    ARABIC: 'ar'
  },

  // Email templates
  EMAIL_TEMPLATES: {
    CONTACT_FORM: 'contactForm',
    JOB_APPLICATION: 'jobApplication',
    ADMIN_NOTIFICATION: 'adminNotification',
    WELCOME: 'welcome',
    PASSWORD_RESET: 'passwordReset'
  },

  // Rate limiting
  RATE_LIMITS: {
    LOGIN: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
    CONTACT_FORM: { windowMs: 60 * 1000, max: 3 }, // 3 submissions per minute
    JOB_APPLICATION: { windowMs: 60 * 1000, max: 2 }, // 2 applications per minute
    API: { windowMs: 15 * 60 * 1000, max: 100 } // 100 requests per 15 minutes
  },

  // Database backup settings
  BACKUP: {
    SCHEDULE: '0 2 * * *', // Daily at 2 AM
    RETENTION_DAYS: 30,
    MAX_BACKUPS: 10
  },

  // Logging levels
  LOG_LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
  },

  // API response messages
  MESSAGES: {
    SUCCESS: {
      CREATED: 'Resource created successfully',
      UPDATED: 'Resource updated successfully',
      DELETED: 'Resource deleted successfully',
      RETRIEVED: 'Resource retrieved successfully'
    },
    ERROR: {
      NOT_FOUND: 'Resource not found',
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'Access forbidden',
      VALIDATION_ERROR: 'Validation error',
      SERVER_ERROR: 'Internal server error',
      DUPLICATE_ENTRY: 'Duplicate entry found'
    }
  }
};

// Helper functions
const getDefaultAdminPermissions = (role) => {
  switch (role) {
    case APP_CONSTANTS.ADMIN_ROLES.SUPER_ADMIN:
      return Object.values(APP_CONSTANTS.ADMIN_PERMISSIONS);
    case APP_CONSTANTS.ADMIN_ROLES.ADMIN:
      return Object.values(APP_CONSTANTS.ADMIN_PERMISSIONS).filter(p => p !== APP_CONSTANTS.ADMIN_PERMISSIONS.MANAGE_USERS);
    case APP_CONSTANTS.ADMIN_ROLES.MANAGER:
      return [
        APP_CONSTANTS.ADMIN_PERMISSIONS.MANAGE_SERVICES,
        APP_CONSTANTS.ADMIN_PERMISSIONS.MANAGE_CLIENTS,
        APP_CONSTANTS.ADMIN_PERMISSIONS.MANAGE_JOBS,
        APP_CONSTANTS.ADMIN_PERMISSIONS.VIEW_APPLICATIONS,
        APP_CONSTANTS.ADMIN_PERMISSIONS.MANAGE_GALLERY
      ];
    case APP_CONSTANTS.ADMIN_ROLES.STAFF:
      return [
        APP_CONSTANTS.ADMIN_PERMISSIONS.VIEW_APPLICATIONS,
        APP_CONSTANTS.ADMIN_PERMISSIONS.MANAGE_GALLERY
      ];
    default:
      return [];
  }
};

const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.mimetype);
};

const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

module.exports = {
  APP_CONSTANTS,
  getDefaultAdminPermissions,
  validateFileType,
  validateFileSize
};
