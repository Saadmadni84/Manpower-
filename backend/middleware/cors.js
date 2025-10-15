const cors = require('cors');
const { ENV_KEYS, getConfig } = require('../config/keys');

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const config = getConfig();
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (config.isDevelopment) {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    const allowedOrigins = [
      ENV_KEYS.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://manpowercompany.com',
      'https://www.manpowercompany.com'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  credentials: ENV_KEYS.CORS_CREDENTIALS || true,
  
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-HTTP-Method-Override',
    'X-Forwarded-For',
    'X-Real-IP',
    'Cache-Control',
    'Pragma'
  ],
  
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page',
    'X-Rate-Limit-Limit',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset'
  ],
  
  optionsSuccessStatus: 200,
  
  maxAge: 86400 // 24 hours
};

// CORS middleware for development
const corsDev = cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-HTTP-Method-Override',
    'X-Forwarded-For',
    'X-Real-IP',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page'
  ],
  optionsSuccessStatus: 200
});

// CORS middleware for production
const corsProd = cors(corsOptions);

// API-specific CORS configuration
const apiCorsOptions = {
  ...corsOptions,
  origin: (origin, callback) => {
    const config = getConfig();
    
    if (!origin) return callback(null, true);
    
    if (config.isDevelopment) {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      ENV_KEYS.FRONTEND_URL,
      'https://manpowercompany.com',
      'https://www.manpowercompany.com'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('API access not allowed by CORS'));
    }
  }
};

// Admin panel CORS configuration
const adminCorsOptions = {
  ...corsOptions,
  origin: (origin, callback) => {
    const config = getConfig();
    
    if (!origin) return callback(null, true);
    
    if (config.isDevelopment) {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      ENV_KEYS.FRONTEND_URL,
      'https://admin.manpowercompany.com',
      'https://www.manpowercompany.com/admin'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Admin access not allowed by CORS'));
    }
  }
};

// Public API CORS configuration
const publicCorsOptions = {
  origin: (origin, callback) => {
    const config = getConfig();
    
    if (!origin) return callback(null, true);
    
    if (config.isDevelopment) {
      return callback(null, true);
    }
    
    // Allow all origins for public API
    callback(null, true);
  },
  
  credentials: false,
  
  methods: ['GET', 'POST', 'OPTIONS'],
  
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page'
  ],
  
  optionsSuccessStatus: 200,
  
  maxAge: 86400 // 24 hours
};

// File upload CORS configuration
const uploadCorsOptions = {
  ...corsOptions,
  origin: (origin, callback) => {
    const config = getConfig();
    
    if (!origin) return callback(null, true);
    
    if (config.isDevelopment) {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      ENV_KEYS.FRONTEND_URL,
      'https://manpowercompany.com',
      'https://www.manpowercompany.com'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('File upload not allowed by CORS'));
    }
  }
};

// CORS error handler
const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      success: false,
      message: 'Access denied by CORS policy'
    });
  } else {
    next(err);
  }
};

// Preflight request handler
const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    res.status(200).end();
  } else {
    next();
  }
};

// Dynamic CORS middleware based on environment
const dynamicCors = (req, res, next) => {
  const config = getConfig();
  
  if (config.isDevelopment) {
    return corsDev(req, res, next);
  } else {
    return corsProd(req, res, next);
  }
};

// CORS middleware factory
const createCorsMiddleware = (options = {}) => {
  const defaultOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization'
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'X-Current-Page',
      'X-Per-Page'
    ],
    optionsSuccessStatus: 200
  };
  
  const corsOptions = { ...defaultOptions, ...options };
  return cors(corsOptions);
};

// Export CORS configurations and middleware
module.exports = {
  corsOptions,
  corsDev,
  corsProd,
  apiCorsOptions,
  adminCorsOptions,
  publicCorsOptions,
  uploadCorsOptions,
  corsErrorHandler,
  handlePreflight,
  dynamicCors,
  createCorsMiddleware
};
