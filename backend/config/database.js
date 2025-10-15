const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Enhanced MongoDB Database Connection Configuration
 * 
 * Features:
 * - Connection pooling for performance
 * - Automatic reconnection with exponential backoff
 * - Comprehensive error handling
 * - Support for both local MongoDB and MongoDB Atlas
 * - Connection health monitoring
 * - Graceful shutdown handling
 * - SSL/TLS encryption for production
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

// Connection state tracking
let isConnected = false;
let connectionRetries = 0;
const maxRetries = 5;
const retryDelay = 5000; // 5 seconds

// Database configuration
const getDatabaseConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manpower_db';
  
  // Enhanced connection options
  const options = {
    // Connection Pool Settings
    maxPoolSize: isProduction ? 20 : 10, // Maximum number of connections in the pool
    minPoolSize: isProduction ? 5 : 2,   // Minimum number of connections in the pool
    maxIdleTimeMS: 30000,                // Close connections after 30 seconds of inactivity
    
    // Timeout Settings
    serverSelectionTimeoutMS: 5000,      // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000,              // Close sockets after 45 seconds of inactivity
    connectTimeoutMS: 10000,             // Give up initial connection after 10 seconds
    
    // Buffer Settings
    bufferCommands: false,               // Disable mongoose buffering
    
    // Write Concern
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 5000
    },
    
    // Read Preference
    readPreference: isProduction ? 'secondaryPreferred' : 'primary',
    
    // Compression
    compressors: ['zlib'],
    
    // SSL/TLS (for MongoDB Atlas and production)
    ...(isProduction && mongoURI.includes('mongodb+srv://') && {
      ssl: true,
      sslValidate: true,
      authSource: 'admin'
    })
  };

  return { mongoURI, options };
};

// Connection event handlers
const setupConnectionHandlers = () => {
  // Connection successful
  mongoose.connection.on('connected', () => {
    isConnected = true;
    connectionRetries = 0;
    logger.info('MongoDB connected successfully', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    });
  });

  // Connection error
  mongoose.connection.on('error', (err) => {
    isConnected = false;
    logger.error('MongoDB connection error:', {
      error: err.message,
      code: err.code,
      stack: err.stack
    });
  });

  // Connection disconnected
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('MongoDB disconnected');
  });

  // Connection reconnected
  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    logger.info('MongoDB reconnected successfully');
  });

  // Connection timeout
  mongoose.connection.on('timeout', () => {
    logger.error('MongoDB connection timeout');
  });

  // Connection close
  mongoose.connection.on('close', () => {
    isConnected = false;
    logger.info('MongoDB connection closed');
  });
};

// Retry connection with exponential backoff
const retryConnection = async (mongoURI, options, attempt = 1) => {
  if (attempt > maxRetries) {
    throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts`);
  }

  try {
    const delay = retryDelay * Math.pow(2, attempt - 1);
    logger.info(`Attempting to connect to MongoDB (attempt ${attempt}/${maxRetries})...`);
    
    if (attempt > 1) {
      logger.info(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const conn = await mongoose.connect(mongoURI, options);
    return conn;
  } catch (error) {
    logger.error(`MongoDB connection attempt ${attempt} failed:`, {
      error: error.message,
      code: error.code
    });
    
    if (attempt === maxRetries) {
      throw error;
    }
    
    return retryConnection(mongoURI, options, attempt + 1);
  }
};

// Health check function
const checkDatabaseHealth = async () => {
  try {
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return {
        status: 'disconnected',
        message: 'Database is not connected',
        readyState: mongoose.connection.readyState
      };
    }

    // Ping the database
    await mongoose.connection.db.admin().ping();
    
    return {
      status: 'connected',
      message: 'Database is healthy',
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Database health check failed',
      error: error.message
    };
  }
};

// Main connection function
const connectDatabase = async () => {
  try {
    // Setup connection event handlers
    setupConnectionHandlers();
    
    // Get database configuration
    const { mongoURI, options } = getDatabaseConfig();
    
    logger.info('Connecting to MongoDB...', {
      uri: mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Hide credentials in logs
      environment: process.env.NODE_ENV || 'development'
    });

    // Attempt connection with retry logic
    const conn = await retryConnection(mongoURI, options);
    
    logger.info('MongoDB connected successfully', {
      host: conn.connection.host,
      port: conn.connection.port,
      name: conn.connection.name,
      version: conn.connection.version
    });

    // Setup graceful shutdown handlers
    setupGracefulShutdown();
    
    return conn;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // In development, continue without database for testing
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Continuing without database connection for development...');
      logger.warn('To fix this, please install MongoDB or use MongoDB Atlas');
      
      // Return a mock connection for development
      return {
        connection: {
          host: 'localhost (mock)',
          readyState: 0
        }
      };
    }
    
    // In production, exit the process
    throw error;
  }
};

// Setup graceful shutdown
const setupGracefulShutdown = () => {
  const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Closing MongoDB connection...`);
    
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed gracefully');
      }
      process.exit(0);
    } catch (error) {
      logger.error('Error closing MongoDB connection:', { error: error.message });
      process.exit(1);
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
};

// Export functions and connection state
module.exports = {
  connectDatabase,
  checkDatabaseHealth,
  isConnected: () => isConnected,
  getConnectionState: () => mongoose.connection.readyState
};
