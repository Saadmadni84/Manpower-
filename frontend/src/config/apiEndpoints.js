export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  // Public API endpoints
  PUBLIC: {
    // Company
    COMPANY: `${API_BASE_URL}/v1/company`,
    
    // Jobs
    JOBS: `${API_BASE_URL}/v1/jobs`,
    JOBS_SEARCH: `${API_BASE_URL}/v1/jobs/search`,
    JOBS_APPLY: (id) => `${API_BASE_URL}/v1/jobs/${id}/apply`,
    JOBS_CATEGORIES: `${API_BASE_URL}/v1/jobs/categories`,
    JOBS_LOCATIONS: `${API_BASE_URL}/v1/jobs/locations`,
    
    // Services
    SERVICES: `${API_BASE_URL}/v1/services`,
    
    // Clients
    CLIENTS: `${API_BASE_URL}/v1/clients`,
    
    // Gallery
    GALLERY: `${API_BASE_URL}/v1/gallery/images`,
    GALLERY_CATEGORIES: `${API_BASE_URL}/v1/gallery/categories`,
    
    // Contact
    CONTACT: `${API_BASE_URL}/v1/contact`,
    
    // Health
    HEALTH: `${API_BASE_URL}/health`
  },

  // Admin API endpoints
  ADMIN: {
    // Authentication
    AUTH: {
      LOGIN: `${API_BASE_URL}/admin/v1/auth/login`,
      LOGOUT: `${API_BASE_URL}/admin/v1/auth/logout`,
      REFRESH: `${API_BASE_URL}/admin/v1/auth/refresh`,
      PROFILE: `${API_BASE_URL}/admin/v1/auth/profile`,
      VALIDATE: `${API_BASE_URL}/admin/v1/auth/validate`
    },

    // Dashboard
    DASHBOARD: {
      STATS: `${API_BASE_URL}/admin/v1/dashboard/stats`,
      ANALYTICS: `${API_BASE_URL}/admin/v1/dashboard/analytics`,
      RECENT_ACTIVITY: `${API_BASE_URL}/admin/v1/dashboard/recent-activity`,
      PERFORMANCE: `${API_BASE_URL}/admin/v1/dashboard/performance`,
      SYSTEM_HEALTH: `${API_BASE_URL}/admin/v1/dashboard/system-health`
    },

    // Company Management
    COMPANY: {
      BASE: `${API_BASE_URL}/admin/v1/company`,
      UPDATE: `${API_BASE_URL}/admin/v1/company`,
      LOGO: `${API_BASE_URL}/admin/v1/company/logo`
    },

    // Services Management
    SERVICES: {
      BASE: `${API_BASE_URL}/admin/v1/services`,
      CREATE: `${API_BASE_URL}/admin/v1/services`,
      UPDATE: (id) => `${API_BASE_URL}/admin/v1/services/${id}`,
      DELETE: (id) => `${API_BASE_URL}/admin/v1/services/${id}`
    },

    // Clients Management
    CLIENTS: {
      BASE: `${API_BASE_URL}/admin/v1/clients`,
      CREATE: `${API_BASE_URL}/admin/v1/clients`,
      UPDATE: (id) => `${API_BASE_URL}/admin/v1/clients/${id}`,
      DELETE: (id) => `${API_BASE_URL}/admin/v1/clients/${id}`
    },

    // Jobs Management
    JOBS: {
      BASE: `${API_BASE_URL}/admin/v1/jobs/postings`,
      CREATE: `${API_BASE_URL}/admin/v1/jobs/postings`,
      UPDATE: (id) => `${API_BASE_URL}/admin/v1/jobs/postings/${id}`,
      DELETE: (id) => `${API_BASE_URL}/admin/v1/jobs/postings/${id}`,
      APPLICATIONS: `${API_BASE_URL}/admin/v1/jobs/applications`,
      APPLICATION_UPDATE: (id) => `${API_BASE_URL}/admin/v1/jobs/applications/${id}/status`,
      STATISTICS: `${API_BASE_URL}/admin/v1/jobs/statistics`
    },

    // Gallery Management
    GALLERY: {
      BASE: `${API_BASE_URL}/admin/v1/gallery`,
      UPLOAD: `${API_BASE_URL}/admin/v1/gallery/upload`,
      DELETE: (id) => `${API_BASE_URL}/admin/v1/gallery/${id}`
    },

    // Contact Management
    CONTACTS: {
      BASE: `${API_BASE_URL}/admin/v1/contacts`,
      MESSAGES: `${API_BASE_URL}/admin/v1/contacts/messages`,
      REPLY: (id) => `${API_BASE_URL}/admin/v1/contacts/messages/${id}/reply`
    },

    // Users Management
    USERS: {
      BASE: `${API_BASE_URL}/admin/v1/users`,
      CREATE: `${API_BASE_URL}/admin/v1/users`,
      UPDATE: (id) => `${API_BASE_URL}/admin/v1/users/${id}`,
      DELETE: (id) => `${API_BASE_URL}/admin/v1/users/${id}`
    },

    // File Management
    FILES: {
      UPLOAD: `${API_BASE_URL}/admin/v1/files/upload`,
      DELETE: (id) => `${API_BASE_URL}/admin/v1/files/${id}`
    },

    // Settings
    SETTINGS: {
      BASE: `${API_BASE_URL}/admin/v1/settings`,
      UPDATE: `${API_BASE_URL}/admin/v1/settings`
    }
  }
};

export const buildUrl = (endpoint, params = {}) => {
  let url = endpoint;
  
  // Replace path parameters
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url = url.replace(`{${key}}`, params[key]);
    }
  });
  
  return url;
};

export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      if (Array.isArray(params[key])) {
        params[key].forEach(value => searchParams.append(key, value));
      } else {
        searchParams.append(key, params[key]);
      }
    }
  });
  
  return searchParams.toString();
};

