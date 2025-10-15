export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VALIDATE: '/auth/validate',
    REFRESH: '/auth/refresh'
  },
  JOBS: {
    BASE: '/jobs',
    SEARCH: '/jobs/search',
    APPLY: (id) => `/jobs/${id}/apply`,
    APPLICATIONS: (id) => `/jobs/${id}/applications`
  },
  CLIENTS: {
    BASE: '/clients',
    LOGO: (id) => `/clients/${id}/logo`
  },
  CONTACT: {
    BASE: '/contact',
    MESSAGES: '/contact/messages',
    INFO: '/contact/info'
  },
  GALLERY: {
    BASE: '/gallery',
    CATEGORIES: '/gallery/categories'
  },
  CONTENT: {
    PAGES: '/content/pages',
    SETTINGS: '/content/settings',
    SEO: (id) => `/content/seo/${id}`
  }
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  CLIENTS: '/clients',
  CAREERS: '/careers',
  GALLERY: '/gallery',
  CONTRACTS: '/contracts',
  CONTACT: '/contact',
  ADMIN: {
    BASE: '/admin',
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    JOBS: '/admin/jobs',
    CLIENTS: '/admin/clients',
    GALLERY: '/admin/gallery',
    SETTINGS: '/admin/settings'
  }
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

export const JOB_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  INTERVIEWED: 'interviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
};

