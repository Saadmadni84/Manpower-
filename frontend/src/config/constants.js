export const APP_CONFIG = {
  NAME: 'Manpower Company',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional manpower services - connecting talent with opportunity',
  AUTHOR: 'Manpower Company Team',
  SUPPORT_EMAIL: 'support@manpower.com'
};

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  LANGUAGE: 'language',
  THEME: 'theme',
  CART_ITEMS: 'cartItems'
};

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  },
  EMAIL: {
    MAX_LENGTH: 254
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  }
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
};

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss'
};

export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  POSITIONS: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
    TOP_CENTER: 'top-center',
    BOTTOM_CENTER: 'bottom-center'
  }
};

export const LANGUAGE_CONFIG = {
  DEFAULT: 'en',
  SUPPORTED: ['en', 'ar'],
  FALLBACK: 'en'
};

export const THEME_CONFIG = {
  DEFAULT: 'light',
  OPTIONS: ['light', 'dark'],
  PERSIST_KEY: 'theme'
};

