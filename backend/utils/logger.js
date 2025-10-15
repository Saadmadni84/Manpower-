const fs = require('fs');
const path = require('path');
const { ensureDirectoryExists } = require('./helpers');

// Ensure logs directory exists
ensureDirectoryExists('./logs');

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.logFile = process.env.LOG_FILE || './logs/app.log';
    this.errorLogFile = process.env.ERROR_LOG_FILE || './logs/error.log';
    this.accessLogFile = process.env.ACCESS_LOG_FILE || './logs/access.log';
    this.adminLogFile = process.env.ADMIN_LOG_FILE || './logs/admin.log';
    
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  // Get current timestamp
  getTimestamp() {
    return new Date().toISOString();
  }

  // Format log message
  formatMessage(level, message, meta = {}) {
    const timestamp = this.getTimestamp();
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}`;
  }

  // Write to log file
  writeToFile(filename, message) {
    try {
      fs.appendFileSync(filename, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  // Log message
  log(level, message, meta = {}) {
    if (this.levels[level] <= this.levels[this.logLevel]) {
      const formattedMessage = this.formatMessage(level, message, meta);
      console.log(formattedMessage);
      
      // Write to appropriate log file
      if (level === 'error') {
        this.writeToFile(this.errorLogFile, formattedMessage);
      } else {
        this.writeToFile(this.logFile, formattedMessage);
      }
    }
  }

  // Error level logging
  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  // Warning level logging
  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  // Info level logging
  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  // Debug level logging
  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  // Log HTTP requests
  logRequest(req, res, responseTime) {
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`;
    const meta = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous'
    };
    
    this.info(message, meta);
    this.writeToFile(this.accessLogFile, this.formatMessage('info', message, meta));
  }

  // Log admin actions
  logAdminAction(user, action, entity, details = {}) {
    const message = `Admin action: ${action}`;
    const meta = {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      entity,
      details
    };
    
    this.info(message, meta);
    this.writeToFile(this.adminLogFile, this.formatMessage('info', message, meta));
  }

  // Log database operations
  logDatabaseOperation(operation, collection, details = {}) {
    const message = `Database ${operation}: ${collection}`;
    const meta = {
      operation,
      collection,
      details
    };
    
    this.debug(message, meta);
  }

  // Log email operations
  logEmailOperation(operation, recipient, subject, success = true) {
    const message = `Email ${operation}: ${success ? 'success' : 'failed'}`;
    const meta = {
      operation,
      recipient,
      subject,
      success
    };
    
    this.info(message, meta);
  }

  // Log file operations
  logFileOperation(operation, filename, success = true, details = {}) {
    const message = `File ${operation}: ${success ? 'success' : 'failed'}`;
    const meta = {
      operation,
      filename,
      success,
      details
    };
    
    this.info(message, meta);
  }

  // Log security events
  logSecurityEvent(event, details = {}) {
    const message = `Security event: ${event}`;
    const meta = {
      event,
      details
    };
    
    this.warn(message, meta);
  }

  // Log performance metrics
  logPerformance(operation, duration, details = {}) {
    const message = `Performance: ${operation} took ${duration}ms`;
    const meta = {
      operation,
      duration,
      details
    };
    
    this.info(message, meta);
  }

  // Log system events
  logSystemEvent(event, details = {}) {
    const message = `System event: ${event}`;
    const meta = {
      event,
      details
    };
    
    this.info(message, meta);
  }

  // Log API calls
  logAPICall(method, url, statusCode, responseTime, details = {}) {
    const message = `API call: ${method} ${url} ${statusCode} ${responseTime}ms`;
    const meta = {
      method,
      url,
      statusCode,
      responseTime,
      details
    };
    
    this.info(message, meta);
  }

  // Log errors with stack trace
  logError(error, context = {}) {
    const message = `Error: ${error.message}`;
    const meta = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context
    };
    
    this.error(message, meta);
  }

  // Log warnings
  logWarning(warning, context = {}) {
    const message = `Warning: ${warning}`;
    const meta = {
      warning,
      context
    };
    
    this.warn(message, meta);
  }

  // Log info messages
  logInfo(info, context = {}) {
    const message = `Info: ${info}`;
    const meta = {
      info,
      context
    };
    
    this.info(message, meta);
  }

  // Log debug messages
  logDebug(debug, context = {}) {
    const message = `Debug: ${debug}`;
    const meta = {
      debug,
      context
    };
    
    this.debug(message, meta);
  }

  // Create Express middleware for request logging
  createRequestLogger() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.logRequest(req, res, duration);
      });
      
      next();
    };
  }

  // Create Express middleware for error logging
  createErrorLogger() {
    return (error, req, res, next) => {
      this.logError(error, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous'
      });
      
      next(error);
    };
  }

  // Rotate log files (basic implementation)
  rotateLogFiles() {
    const logFiles = [this.logFile, this.errorLogFile, this.accessLogFile, this.adminLogFile];
    
    logFiles.forEach(logFile => {
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        const fileSizeInMB = stats.size / (1024 * 1024);
        
        // Rotate if file is larger than 10MB
        if (fileSizeInMB > 10) {
          const timestamp = new Date().toISOString().split('T')[0];
          const rotatedFile = `${logFile}.${timestamp}`;
          
          try {
            fs.renameSync(logFile, rotatedFile);
            this.info(`Log file rotated: ${logFile} -> ${rotatedFile}`);
          } catch (error) {
            this.error(`Failed to rotate log file: ${logFile}`, { error: error.message });
          }
        }
      }
    });
  }

  // Clean old log files
  cleanOldLogFiles(daysToKeep = 30) {
    const logDir = './logs';
    
    if (!fs.existsSync(logDir)) return;
    
    const files = fs.readdirSync(logDir);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    files.forEach(file => {
      const filePath = path.join(logDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < cutoffDate) {
        try {
          fs.unlinkSync(filePath);
          this.info(`Old log file deleted: ${file}`);
        } catch (error) {
          this.error(`Failed to delete old log file: ${file}`, { error: error.message });
        }
      }
    });
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
