#!/usr/bin/env node

/**
 * Environment Setup Script
 * 
 * This script helps set up the environment variables for the Manpower Company backend.
 * It provides interactive prompts to configure database, email, and other settings.
 * 
 * Usage:
 * node scripts/setup-environment.js
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Default configuration
const defaultConfig = {
  // Server Configuration
  NODE_ENV: 'development',
  PORT: '5000',
  HOST: 'localhost',
  
  // Database Configuration
  MONGODB_URI: 'mongodb://localhost:27017/manpower_db',
  MONGODB_TEST_URI: 'mongodb://localhost:27017/manpower_test_db',
  
  // JWT Configuration
  JWT_SECRET: '',
  JWT_EXPIRE: '24h',
  JWT_REFRESH_EXPIRE: '7d',
  
  // Email Configuration
  EMAIL_SERVICE: 'gmail',
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_PORT: '587',
  EMAIL_USER: '',
  EMAIL_PASSWORD: '',
  EMAIL_FROM: '',
  
  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: '',
  CLOUDINARY_API_KEY: '',
  CLOUDINARY_API_SECRET: '',
  
  // Company Information
  COMPANY_NAME: 'Manpower Supply Company',
  COMPANY_EMAIL: 'info@manpowercompany.com',
  COMPANY_PHONE: '+966-12-123-4567',
  COMPANY_ADDRESS: 'Saudi Arabia',
  
  // Admin Configuration
  ADMIN_EMAIL: 'admin@manpowercompany.com',
  ADMIN_PASSWORD: '',
  ADMIN_NAME: 'System Administrator',
  
  // Security Configuration
  BCRYPT_ROUNDS: '12',
  SESSION_SECRET: '',
  
  // CORS Configuration
  CORS_ORIGIN: 'http://localhost:3000',
  CORS_CREDENTIALS: 'true',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100',
  
  // API Configuration
  API_VERSION: 'v1',
  API_PREFIX: '/api',
  
  // Frontend URL
  FRONTEND_URL: 'http://localhost:3000'
};

// Generate random strings for secrets
const generateSecret = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Main setup function
async function setupEnvironment() {
  try {
    log('\n🚀 Manpower Company Backend - Environment Setup', 'cyan');
    log('================================================', 'cyan');
    log('\nThis script will help you configure your environment variables.\n', 'yellow');
    
    const config = { ...defaultConfig };
    
    // Server Configuration
    log('📡 SERVER CONFIGURATION', 'blue');
    log('----------------------', 'blue');
    
    const nodeEnv = await question(`Environment (development/production) [${defaultConfig.NODE_ENV}]: `);
    config.NODE_ENV = nodeEnv || defaultConfig.NODE_ENV;
    
    const port = await question(`Server Port [${defaultConfig.PORT}]: `);
    config.PORT = port || defaultConfig.PORT;
    
    // Database Configuration
    log('\n🗄️  DATABASE CONFIGURATION', 'blue');
    log('-------------------------', 'blue');
    
    const dbChoice = await question('Database setup:\n1. Local MongoDB\n2. MongoDB Atlas\nChoose (1/2) [1]: ');
    
    if (dbChoice === '2') {
      log('\n📋 MongoDB Atlas Setup:', 'yellow');
      log('1. Go to https://cloud.mongodb.com/');
      log('2. Create a free account and cluster');
      log('3. Create a database user');
      log('4. Add your IP to network access');
      log('5. Get the connection string\n');
      
      const atlasUri = await question('MongoDB Atlas Connection String: ');
      if (atlasUri) {
        config.MONGODB_URI = atlasUri;
        config.MONGODB_TEST_URI = atlasUri.replace('/manpower_db', '/manpower_test_db');
      }
    } else {
      log('\n📋 Local MongoDB Setup:', 'yellow');
      log('Make sure MongoDB is installed and running on your system.');
      log('Default connection: mongodb://localhost:27017/manpower_db\n');
      
      const localUri = await question(`Local MongoDB URI [${defaultConfig.MONGODB_URI}]: `);
      config.MONGODB_URI = localUri || defaultConfig.MONGODB_URI;
      config.MONGODB_TEST_URI = config.MONGODB_URI.replace('/manpower_db', '/manpower_test_db');
    }
    
    // Security Configuration
    log('\n🔐 SECURITY CONFIGURATION', 'blue');
    log('-------------------------', 'blue');
    
    const jwtSecret = await question(`JWT Secret (leave empty to generate) [auto-generate]: `);
    config.JWT_SECRET = jwtSecret || generateSecret(64);
    
    const sessionSecret = await question(`Session Secret (leave empty to generate) [auto-generate]: `);
    config.SESSION_SECRET = sessionSecret || generateSecret(32);
    
    // Email Configuration
    log('\n📧 EMAIL CONFIGURATION', 'blue');
    log('----------------------', 'blue');
    log('Configure SMTP settings for sending emails.\n');
    
    const emailService = await question(`Email Service (gmail/outlook/custom) [${defaultConfig.EMAIL_SERVICE}]: `);
    config.EMAIL_SERVICE = emailService || defaultConfig.EMAIL_SERVICE;
    
    if (emailService === 'custom') {
      const emailHost = await question('SMTP Host: ');
      const emailPort = await question('SMTP Port [587]: ');
      config.EMAIL_HOST = emailHost;
      config.EMAIL_PORT = emailPort || '587';
    }
    
    const emailUser = await question('Email Username: ');
    if (emailUser && validateEmail(emailUser)) {
      config.EMAIL_USER = emailUser;
      config.EMAIL_FROM = emailUser;
    } else if (emailUser) {
      log('⚠️  Invalid email format. Please enter a valid email address.', 'yellow');
    }
    
    const emailPassword = await question('Email Password/App Password: ');
    if (emailPassword) {
      config.EMAIL_PASSWORD = emailPassword;
    }
    
    // Cloudinary Configuration
    log('\n☁️  CLOUDINARY CONFIGURATION', 'blue');
    log('----------------------------', 'blue');
    log('Configure Cloudinary for image uploads.\n');
    
    const cloudinaryName = await question('Cloudinary Cloud Name: ');
    if (cloudinaryName) {
      config.CLOUDINARY_CLOUD_NAME = cloudinaryName;
    }
    
    const cloudinaryKey = await question('Cloudinary API Key: ');
    if (cloudinaryKey) {
      config.CLOUDINARY_API_KEY = cloudinaryKey;
    }
    
    const cloudinarySecret = await question('Cloudinary API Secret: ');
    if (cloudinarySecret) {
      config.CLOUDINARY_API_SECRET = cloudinarySecret;
    }
    
    // Admin Configuration
    log('\n👤 ADMIN CONFIGURATION', 'blue');
    log('---------------------', 'blue');
    
    const adminEmail = await question(`Admin Email [${defaultConfig.ADMIN_EMAIL}]: `);
    if (adminEmail && validateEmail(adminEmail)) {
      config.ADMIN_EMAIL = adminEmail;
    } else if (adminEmail) {
      log('⚠️  Invalid email format. Using default.', 'yellow');
    }
    
    const adminPassword = await question('Admin Password (min 8 characters): ');
    if (adminPassword && adminPassword.length >= 8) {
      config.ADMIN_PASSWORD = adminPassword;
    } else if (adminPassword) {
      log('⚠️  Password too short. Using default.', 'yellow');
      config.ADMIN_PASSWORD = 'admin123';
    } else {
      config.ADMIN_PASSWORD = 'admin123';
    }
    
    // Company Configuration
    log('\n🏢 COMPANY CONFIGURATION', 'blue');
    log('------------------------', 'blue');
    
    const companyName = await question(`Company Name [${defaultConfig.COMPANY_NAME}]: `);
    if (companyName) {
      config.COMPANY_NAME = companyName;
    }
    
    const companyEmail = await question(`Company Email [${defaultConfig.COMPANY_EMAIL}]: `);
    if (companyEmail && validateEmail(companyEmail)) {
      config.COMPANY_EMAIL = companyEmail;
    } else if (companyEmail) {
      log('⚠️  Invalid email format. Using default.', 'yellow');
    }
    
    const companyPhone = await question(`Company Phone [${defaultConfig.COMPANY_PHONE}]: `);
    if (companyPhone) {
      config.COMPANY_PHONE = companyPhone;
    }
    
    // CORS Configuration
    log('\n🌐 CORS CONFIGURATION', 'blue');
    log('--------------------', 'blue');
    
    const corsOrigin = await question(`Frontend URL [${defaultConfig.CORS_ORIGIN}]: `);
    if (corsOrigin && validateUrl(corsOrigin)) {
      config.CORS_ORIGIN = corsOrigin;
      config.FRONTEND_URL = corsOrigin;
    } else if (corsOrigin) {
      log('⚠️  Invalid URL format. Using default.', 'yellow');
    }
    
    // Generate .env file
    log('\n📝 GENERATING .env FILE', 'blue');
    log('------------------------', 'blue');
    
    const envContent = `# ==============================================
# MANPOWER COMPANY BACKEND - ENVIRONMENT CONFIG
# Generated on: ${new Date().toISOString()}
# ==============================================

# ==============================================
# SERVER CONFIGURATION
# ==============================================
NODE_ENV=${config.NODE_ENV}
PORT=${config.PORT}
HOST=${config.HOST}

# ==============================================
# DATABASE CONFIGURATION
# ==============================================
MONGODB_URI=${config.MONGODB_URI}
MONGODB_TEST_URI=${config.MONGODB_TEST_URI}

# ==============================================
# JWT CONFIGURATION
# ==============================================
JWT_SECRET=${config.JWT_SECRET}
JWT_EXPIRE=${config.JWT_EXPIRE}
JWT_REFRESH_EXPIRE=${config.JWT_REFRESH_EXPIRE}

# ==============================================
# EMAIL CONFIGURATION
# ==============================================
EMAIL_SERVICE=${config.EMAIL_SERVICE}
EMAIL_HOST=${config.EMAIL_HOST}
EMAIL_PORT=${config.EMAIL_PORT}
EMAIL_USER=${config.EMAIL_USER}
EMAIL_PASSWORD=${config.EMAIL_PASSWORD}
EMAIL_FROM=${config.EMAIL_FROM}

# ==============================================
# CLOUDINARY CONFIGURATION
# ==============================================
CLOUDINARY_CLOUD_NAME=${config.CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${config.CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${config.CLOUDINARY_API_SECRET}

# ==============================================
# COMPANY INFORMATION
# ==============================================
COMPANY_NAME=${config.COMPANY_NAME}
COMPANY_EMAIL=${config.COMPANY_EMAIL}
COMPANY_PHONE=${config.COMPANY_PHONE}
COMPANY_ADDRESS=${config.COMPANY_ADDRESS}

# ==============================================
# ADMIN CONFIGURATION
# ==============================================
ADMIN_EMAIL=${config.ADMIN_EMAIL}
ADMIN_PASSWORD=${config.ADMIN_PASSWORD}
ADMIN_NAME=${config.ADMIN_NAME}

# ==============================================
# SECURITY CONFIGURATION
# ==============================================
BCRYPT_ROUNDS=${config.BCRYPT_ROUNDS}
SESSION_SECRET=${config.SESSION_SECRET}

# ==============================================
# CORS CONFIGURATION
# ==============================================
CORS_ORIGIN=${config.CORS_ORIGIN}
CORS_CREDENTIALS=${config.CORS_CREDENTIALS}

# ==============================================
# RATE LIMITING
# ==============================================
RATE_LIMIT_WINDOW_MS=${config.RATE_LIMIT_WINDOW_MS}
RATE_LIMIT_MAX_REQUESTS=${config.RATE_LIMIT_MAX_REQUESTS}

# ==============================================
# FILE UPLOAD CONFIGURATION
# ==============================================
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# ==============================================
# LOGGING CONFIGURATION
# ==============================================
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# ==============================================
# BACKUP CONFIGURATION
# ==============================================
BACKUP_PATH=./backups
BACKUP_RETENTION_DAYS=30

# ==============================================
# API CONFIGURATION
# ==============================================
API_VERSION=${config.API_VERSION}
API_PREFIX=${config.API_PREFIX}

# ==============================================
# FRONTEND URL
# ==============================================
FRONTEND_URL=${config.FRONTEND_URL}

# ==============================================
# SOCIAL MEDIA LINKS (OPTIONAL)
# ==============================================
FACEBOOK_URL=
TWITTER_URL=
LINKEDIN_URL=
INSTAGRAM_URL=

# ==============================================
# GOOGLE MAPS API (FOR CONTACT PAGE)
# ==============================================
GOOGLE_MAPS_API_KEY=

# ==============================================
# ANALYTICS (OPTIONAL)
# ==============================================
GOOGLE_ANALYTICS_ID=

# ==============================================
# SMS SERVICE (OPTIONAL)
# ==============================================
SMS_API_KEY=
SMS_SENDER_ID=

# ==============================================
# PAYMENT GATEWAY (FOR FUTURE USE)
# ==============================================
PAYMENT_GATEWAY_KEY=
PAYMENT_GATEWAY_SECRET=

# ==============================================
# REDIS (FOR CACHING AND SESSIONS)
# ==============================================
REDIS_URL=
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ==============================================
# SSL CONFIGURATION
# ==============================================
SSL_KEY=
SSL_CERT=

# ==============================================
# MONITORING AND HEALTH CHECKS
# ==============================================
HEALTH_CHECK_INTERVAL=30000
MONITORING_ENABLED=false
`;

    // Write .env file
    fs.writeFileSync('.env', envContent);
    
    log('\n✅ Environment configuration completed successfully!', 'green');
    log('\n📋 SUMMARY:', 'cyan');
    log('----------', 'cyan');
    log(`Environment: ${config.NODE_ENV}`, 'yellow');
    log(`Port: ${config.PORT}`, 'yellow');
    log(`Database: ${config.MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'}`, 'yellow');
    log(`Email: ${config.EMAIL_USER || 'Not configured'}`, 'yellow');
    log(`Cloudinary: ${config.CLOUDINARY_CLOUD_NAME || 'Not configured'}`, 'yellow');
    log(`Admin Email: ${config.ADMIN_EMAIL}`, 'yellow');
    log(`Company: ${config.COMPANY_NAME}`, 'yellow');
    
    log('\n🚀 NEXT STEPS:', 'cyan');
    log('-------------', 'cyan');
    log('1. Install dependencies: npm install', 'green');
    log('2. Seed the database: npm run seed', 'green');
    log('3. Start the server: npm start', 'green');
    log('4. Test health endpoint: curl http://localhost:5000/health', 'green');
    
    log('\n📖 For detailed setup instructions, see: MONGODB_SETUP.md', 'blue');
    
  } catch (error) {
    log(`\n❌ Error during setup: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupEnvironment();
}

module.exports = setupEnvironment;
