const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// Import configurations
const { ENV_KEYS, getConfig } = require('./config/keys');
const { configureCloudinary } = require('./config/cloudinary');
const { connectDatabase, checkDatabaseHealth } = require('./config/database');

// Import middleware
const { globalErrorHandler, handleNotFound } = require('./middleware/errorHandler');
const { dynamicCors, corsErrorHandler } = require('./middleware/cors');
const { generalLimiter } = require('./middleware/rateLimiter');
const { languageMiddleware } = require('./middleware/language');
const logger = require('./utils/logger');

// Import routes
const routes = require('./routes');

class Application {
  constructor() {
    this.app = express();
    this.config = getConfig();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false
    }));

    // CORS middleware
    this.app.use(dynamicCors);
    this.app.use(corsErrorHandler);

    // Rate limiting
    this.app.use(generalLimiter);

    // Compression middleware
    if (this.config.enableCompression) {
      this.app.use(compression());
    }

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Cookie parser
    this.app.use(cookieParser());

    // Session middleware
    this.app.use(session({
      secret: ENV_KEYS.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: ENV_KEYS.MONGODB_URI,
        touchAfter: 24 * 3600 // lazy session update
      }),
      cookie: {
        secure: this.config.isProduction,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Logging middleware
    if (this.config.isDevelopment) {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Request logging
    this.app.use(logger.createRequestLogger());

    // Language detection middleware
    this.app.use(languageMiddleware);

    // Trust proxy (for accurate IP addresses)
    this.app.set('trust proxy', 1);

    // Static files
    this.app.use('/uploads', express.static('uploads'));

    // Health check middleware
    this.app.use('/health', async (req, res) => {
      try {
        const dbHealth = await checkDatabaseHealth();
        const serverHealth = {
          success: true,
          message: 'Server is running',
          timestamp: new Date().toISOString(),
          environment: ENV_KEYS.NODE_ENV,
          version: ENV_KEYS.API_VERSION,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          database: dbHealth
        };
        
        res.json(serverHealth);
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Health check failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  setupRoutes() {
    // API routes
    this.app.use('/api', routes);

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Manpower Company API',
        version: ENV_KEYS.API_VERSION,
        environment: ENV_KEYS.NODE_ENV,
        endpoints: {
          public: `/api/${ENV_KEYS.API_VERSION}`,
          admin: `/api/admin/${ENV_KEYS.API_VERSION}`,
          health: '/api/health'
        },
        documentation: 'https://docs.manpowercompany.com'
      });
    });
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use(handleNotFound);

    // Global error handler
    this.app.use(globalErrorHandler);

    // Unhandled promise rejection handler
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Promise Rejection:', { error: err.message, stack: err.stack });
      process.exit(1);
    });

    // Uncaught exception handler
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', { error: err.message, stack: err.stack });
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      this.shutdown();
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received. Shutting down gracefully...');
      this.shutdown();
    });
  }

  async connectDatabase() {
    try {
      await connectDatabase();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', { error: error.message });
      process.exit(1);
    }
  }

  async configureCloudinary() {
    try {
      configureCloudinary();
      logger.info('Cloudinary configured successfully');
    } catch (error) {
      logger.error('Cloudinary configuration failed:', { error: error.message });
    }
  }

  async start() {
    try {
      // Connect to database
      await this.connectDatabase();

      // Configure Cloudinary
      await this.configureCloudinary();

      // Start server
      const port = ENV_KEYS.PORT || 5000;
      const server = this.app.listen(port, () => {
        logger.info(`Server is running on port ${port}`, {
          environment: ENV_KEYS.NODE_ENV,
          port,
          apiVersion: ENV_KEYS.API_VERSION
        });
      });

      // Store server instance for graceful shutdown
      this.server = server;

      // Log startup information
      logger.info('Application started successfully', {
        environment: ENV_KEYS.NODE_ENV,
        port,
        database: ENV_KEYS.MONGODB_URI.split('@')[1] || 'local',
        cloudinary: ENV_KEYS.CLOUDINARY_CLOUD_NAME || 'not configured'
      });

    } catch (error) {
      logger.error('Failed to start application:', { error: error.message, stack: error.stack });
      process.exit(1);
    }
  }

  async shutdown() {
    try {
      logger.info('Starting graceful shutdown...');

      // Close server
      if (this.server) {
        this.server.close(() => {
          logger.info('HTTP server closed');
        });
      }

      // Close database connection
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        logger.info('Database connection closed');
      }

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', { error: error.message });
      process.exit(1);
    }
  }
}

// Create and start application
const app = new Application();
app.start();

module.exports = app;
