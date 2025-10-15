#!/usr/bin/env node

/**
 * Manpower Company Backend Server
 * 
 * This is the main entry point for the Manpower Supply Company backend API.
 * The server provides endpoints for both public and admin functionality.
 * 
 * Features:
 * - Company information management
 * - Job postings and applications
 * - Contact form handling
 * - Gallery management
 * - Admin panel with authentication
 * - File uploads (Cloudinary integration)
 * - Email notifications
 * - Multi-language support
 * - Rate limiting and security
 * 
 * Environment Variables:
 * - NODE_ENV: Environment (development/production)
 * - PORT: Server port (default: 5000)
 * - MONGODB_URI: MongoDB connection string
 * - JWT_SECRET: JWT signing secret
 * - EMAIL_USER: SMTP email username
 * - EMAIL_PASSWORD: SMTP email password
 * - CLOUDINARY_CLOUD_NAME: Cloudinary cloud name
 * - CLOUDINARY_API_KEY: Cloudinary API key
 * - CLOUDINARY_API_SECRET: Cloudinary API secret
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

// Load environment variables
require('dotenv').config();

// Import application
const app = require('./app');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle SIGTERM signal (for Docker containers)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
console.log('Starting Manpower Company Backend Server...');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Port: ${process.env.PORT || 5000}`);
console.log(`API Version: ${process.env.API_VERSION || 'v1'}`);

// The app.start() method is called in app.js
// This file serves as the entry point for the Node.js process
