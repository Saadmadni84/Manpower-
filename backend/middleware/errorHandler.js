const { createAuditLog } = require('../models/AuditLog');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error types
const ErrorTypes = {
  VALIDATION_ERROR: 'ValidationError',
  CAST_ERROR: 'CastError',
  DUPLICATE_KEY_ERROR: 'DuplicateKeyError',
  JWT_ERROR: 'JsonWebTokenError',
  JWT_EXPIRED_ERROR: 'TokenExpiredError',
  MULTER_ERROR: 'MulterError',
  CLOUDINARY_ERROR: 'CloudinaryError',
  DATABASE_ERROR: 'DatabaseError',
  API_ERROR: 'ApiError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  NOT_FOUND_ERROR: 'NotFoundError',
  RATE_LIMIT_ERROR: 'RateLimitError'
};

// Handle different types of errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const handleMulterError = (err) => {
  let message = 'File upload error';
  
  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      message = 'File size too large';
      break;
    case 'LIMIT_FILE_COUNT':
      message = 'Too many files';
      break;
    case 'LIMIT_UNEXPECTED_FILE':
      message = 'Unexpected file field';
      break;
    case 'LIMIT_PART_COUNT':
      message = 'Too many parts';
      break;
    case 'LIMIT_FIELD_KEY':
      message = 'Field name too long';
      break;
    case 'LIMIT_FIELD_VALUE':
      message = 'Field value too long';
      break;
    case 'LIMIT_FIELD_COUNT':
      message = 'Too many fields';
      break;
    default:
      message = err.message;
  }
  
  return new AppError(message, 400);
};

const handleCloudinaryError = (err) => {
  const message = `Cloudinary error: ${err.message}`;
  return new AppError(message, 500);
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }
};

// Log error to audit system
const logError = async (err, req) => {
  try {
    if (req.user) {
      await createAuditLog({
        action: 'Error occurred',
        entity: { type: 'Error', id: 'system' },
        operation: 'error',
        user: {
          id: req.user._id,
          email: req.user.personalInfo?.email || 'unknown',
          name: req.user.fullName || 'unknown',
          role: req.user.role || 'unknown'
        },
        request: {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          method: req.method,
          url: req.originalUrl
        },
        status: 'failure',
        error: {
          message: err.message,
          code: err.code || err.name,
          stack: err.stack
        }
      });
    }
  } catch (logError) {
    console.error('Failed to log error to audit system:', logError);
  }
};

// Global error handling middleware
const globalErrorHandler = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  await logError(err, req);

  // Handle different error types
  let error = { ...err };
  error.message = err.message;

  // Mongoose errors
  if (error.name === ErrorTypes.CAST_ERROR) {
    error = handleCastErrorDB(error);
  }
  
  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }
  
  if (error.name === ErrorTypes.VALIDATION_ERROR) {
    error = handleValidationErrorDB(error);
  }

  // JWT errors
  if (error.name === ErrorTypes.JWT_ERROR) {
    error = handleJWTError();
  }
  
  if (error.name === ErrorTypes.JWT_EXPIRED_ERROR) {
    error = handleJWTExpiredError();
  }

  // Multer errors
  if (error.name === ErrorTypes.MULTER_ERROR) {
    error = handleMulterError(error);
  }

  // Cloudinary errors
  if (error.name === ErrorTypes.CLOUDINARY_ERROR) {
    error = handleCloudinaryError(error);
  }

  // Send error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Async error handler wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// 404 handler
const handleNotFound = (req, res, next) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(error);
};

// Rate limit error handler
const handleRateLimitError = (req, res, next) => {
  const error = new AppError('Too many requests, please try again later.', 429);
  next(error);
};

// Database connection error handler
const handleDatabaseError = (err) => {
  console.error('Database connection error:', err);
  process.exit(1);
};

// Unhandled promise rejection handler
const handleUnhandledRejection = (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
};

// Uncaught exception handler
const handleUncaughtException = (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
};

// Validation error handler
const handleValidationError = (errors) => {
  const formattedErrors = errors.map(error => ({
    field: error.path,
    message: error.message
  }));
  
  return new AppError('Validation failed', 400, true, formattedErrors);
};

// API error handler
const handleApiError = (message, statusCode = 500) => {
  return new AppError(message, statusCode);
};

// Authentication error handler
const handleAuthError = (message = 'Authentication failed') => {
  return new AppError(message, 401);
};

// Authorization error handler
const handleAuthorizationError = (message = 'Access denied') => {
  return new AppError(message, 403);
};

// Not found error handler
const handleNotFoundError = (resource = 'Resource') => {
  return new AppError(`${resource} not found`, 404);
};

// Export error handling utilities
module.exports = {
  AppError,
  ErrorTypes,
  globalErrorHandler,
  catchAsync,
  handleNotFound,
  handleRateLimitError,
  handleDatabaseError,
  handleUnhandledRejection,
  handleUncaughtException,
  handleValidationError,
  handleApiError,
  handleAuthError,
  handleAuthorizationError,
  handleNotFoundError,
  logError
};
