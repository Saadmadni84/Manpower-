// Environment keys management
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const ENV_KEYS = {
  // Server configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001,
  HOST: process.env.HOST || 'localhost',

  // Database configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manpower_db',
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/manpower_test_db',

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',

  // Email configuration
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER,

  // Cloudinary configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Company information
  COMPANY_NAME: process.env.COMPANY_NAME || 'Manpower Supply Company',
  COMPANY_EMAIL: process.env.COMPANY_EMAIL || 'info@manpowercompany.com',
  COMPANY_PHONE: process.env.COMPANY_PHONE || '+966-XX-XXXXXXX',
  COMPANY_ADDRESS: process.env.COMPANY_ADDRESS || 'Saudi Arabia',

  // Admin configuration
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@manpowercompany.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  ADMIN_NAME: process.env.ADMIN_NAME || 'System Administrator',

  // Security configuration
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-key',
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true' || true,

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

  // File upload configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

  // Logging configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || './logs/app.log',

  // Backup configuration
  BACKUP_PATH: process.env.BACKUP_PATH || './backups',
  BACKUP_RETENTION_DAYS: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,

  // API configuration
  API_VERSION: process.env.API_VERSION || 'v1',
  API_PREFIX: process.env.API_PREFIX || '/api',

  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Social media links (optional)
  FACEBOOK_URL: process.env.FACEBOOK_URL,
  TWITTER_URL: process.env.TWITTER_URL,
  LINKEDIN_URL: process.env.LINKEDIN_URL,
  INSTAGRAM_URL: process.env.INSTAGRAM_URL,

  // Google Maps API (for contact page)
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,

  // Analytics (optional)
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,

  // SMS service (optional)
  SMS_API_KEY: process.env.SMS_API_KEY,
  SMS_SENDER_ID: process.env.SMS_SENDER_ID,

  // Payment gateway (for future use)
  PAYMENT_GATEWAY_KEY: process.env.PAYMENT_GATEWAY_KEY,
  PAYMENT_GATEWAY_SECRET: process.env.PAYMENT_GATEWAY_SECRET,

  // Redis (for caching and sessions)
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // SSL configuration
  SSL_KEY: process.env.SSL_KEY,
  SSL_CERT: process.env.SSL_CERT,

  // Monitoring and health checks
  HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000, // 30 seconds
  MONITORING_ENABLED: process.env.MONITORING_ENABLED === 'true' || false
};

// Validation function to check required environment variables
const validateRequiredKeys = () => {
  const requiredKeys = [
    'MONGODB_URI',
    'JWT_SECRET',
    'EMAIL_USER',
    'EMAIL_PASSWORD'
  ];

  const missingKeys = requiredKeys.filter(key => !ENV_KEYS[key]);

  if (missingKeys.length > 0) {
    console.warn('Warning: Missing required environment variables:', missingKeys);
    console.warn('Please check your .env file');
  }

  return missingKeys.length === 0;
};

// Development vs Production configuration
const getConfig = () => {
  const isDevelopment = ENV_KEYS.NODE_ENV === 'development';
  const isProduction = ENV_KEYS.NODE_ENV === 'production';
  const isTest = ENV_KEYS.NODE_ENV === 'test';

  return {
    isDevelopment,
    isProduction,
    isTest,
    database: isTest ? ENV_KEYS.MONGODB_TEST_URI : ENV_KEYS.MONGODB_URI,
    corsOrigin: isDevelopment ? '*' : ENV_KEYS.CORS_ORIGIN,
    logLevel: isDevelopment ? 'debug' : ENV_KEYS.LOG_LEVEL,
    enableCaching: isProduction,
    enableCompression: isProduction,
    enableSecurity: isProduction
  };
};

// Helper functions
const getRequiredKeys = () => {
  return Object.keys(ENV_KEYS).filter(key => ENV_KEYS[key] === undefined || ENV_KEYS[key] === '');
};

const isKeySet = (key) => {
  return ENV_KEYS[key] !== undefined && ENV_KEYS[key] !== '';
};

const getKey = (key, defaultValue = null) => {
  return ENV_KEYS[key] || defaultValue;
};

module.exports = {
  ENV_KEYS,
  validateRequiredKeys,
  getConfig,
  getRequiredKeys,
  isKeySet,
  getKey
};
