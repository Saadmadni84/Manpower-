const rateLimit = require('express-rate-limit');
const { ENV_KEYS, getConfig } = require('../config/keys');
const { APP_CONSTANTS } = require('../config/constants');

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: ENV_KEYS.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: ENV_KEYS.RATE_LIMIT_MAX_REQUESTS || 10000, // limit each IP to 10000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: APP_CONSTANTS.RATE_LIMITS.LOGIN.windowMs, // 15 minutes
  max: APP_CONSTANTS.RATE_LIMITS.LOGIN.max, // limit each IP to 5 login requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Contact form rate limiter
const contactFormLimiter = rateLimit({
  windowMs: APP_CONSTANTS.RATE_LIMITS.CONTACT_FORM.windowMs, // 1 minute
  max: APP_CONSTANTS.RATE_LIMITS.CONTACT_FORM.max, // limit each IP to 3 contact form submissions per minute
  message: {
    success: false,
    message: 'Too many contact form submissions from this IP, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many contact form submissions from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Job application rate limiter
const jobApplicationLimiter = rateLimit({
  windowMs: APP_CONSTANTS.RATE_LIMITS.JOB_APPLICATION.windowMs, // 1 minute
  max: APP_CONSTANTS.RATE_LIMITS.JOB_APPLICATION.max, // limit each IP to 2 job applications per minute
  message: {
    success: false,
    message: 'Too many job applications from this IP, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many job applications from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 file uploads per minute
  message: {
    success: false,
    message: 'Too many file uploads from this IP, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many file uploads from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Admin API rate limiter
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 admin requests per windowMs
  message: {
    success: false,
    message: 'Too many admin requests from this IP, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many admin requests from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Public API rate limiter
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 public requests per windowMs
  message: {
    success: false,
    message: 'Too many public requests from this IP, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many public requests from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Search rate limiter
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 search requests per minute
  message: {
    success: false,
    message: 'Too many search requests from this IP, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many search requests from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset requests from this IP, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many password reset requests from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Email verification rate limiter
const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 email verification requests per hour
  message: {
    success: false,
    message: 'Too many email verification requests from this IP, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many email verification requests from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Custom rate limiter factory
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.round(req.rateLimit.resetTime / 1000)
      });
    }
  };
  
  return rateLimit({ ...defaultOptions, ...options });
};

// Dynamic rate limiter based on environment
const dynamicRateLimiter = (req, res, next) => {
  const config = getConfig();
  
  if (config.isDevelopment) {
    // More lenient limits in development
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
      }
    })(req, res, next);
  } else {
    // Stricter limits in production
    return generalLimiter(req, res, next);
  }
};

// Rate limiter for specific endpoints
const endpointRateLimiter = (endpoint, options = {}) => {
  const endpointLimits = {
    '/api/auth/login': loginLimiter,
    '/api/auth/register': rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5, // limit each IP to 5 registrations per hour
      message: {
        success: false,
        message: 'Too many registration attempts from this IP, please try again later.'
      }
    }),
    '/api/contact': contactFormLimiter,
    '/api/jobs/apply': jobApplicationLimiter,
    '/api/upload': uploadLimiter,
    '/api/admin': adminLimiter,
    '/api/public': publicLimiter,
    '/api/search': searchLimiter,
    '/api/auth/password-reset': passwordResetLimiter,
    '/api/auth/verify-email': emailVerificationLimiter
  };
  
  return endpointLimits[endpoint] || generalLimiter;
};

// Rate limiter middleware with custom logic
const smartRateLimiter = (req, res, next) => {
  // Skip rate limiting for certain IPs or users
  if (req.user && req.user.role === 'super_admin') {
    return next();
  }
  
  // Apply different limits based on user role
  if (req.user) {
    const roleLimits = {
      'super_admin': 1000,
      'admin': 500,
      'manager': 200,
      'staff': 100
    };
    
    const maxRequests = roleLimits[req.user.role] || 100;
    
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: maxRequests,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
      }
    })(req, res, next);
  }
  
  // Default rate limiter for anonymous users
  return generalLimiter(req, res, next);
};

// Export all rate limiters
module.exports = {
  generalLimiter,
  loginLimiter,
  contactFormLimiter,
  jobApplicationLimiter,
  uploadLimiter,
  adminLimiter,
  publicLimiter,
  searchLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
  createRateLimiter,
  dynamicRateLimiter,
  endpointRateLimiter,
  smartRateLimiter
};
