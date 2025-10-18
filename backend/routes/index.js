const express = require('express');
const router = express.Router();

// Import route modules
const newAdminRoutes = require('../admin/routes/admin');
const publicRoutes = require('./public');
const contentRoutes = require('./content');
const footerRoutes = require('./footer');

// API version prefix
const API_VERSION = process.env.API_VERSION || 'v1';

// Use route modules
router.use(`/admin`, newAdminRoutes);
router.use(`/${API_VERSION}`, publicRoutes);
router.use(`/admin/content`, contentRoutes);
router.use('/footer', footerRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: API_VERSION
  });
});

// Root route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Manpower Company API',
    version: API_VERSION,
    endpoints: {
      public: `/${API_VERSION}`,
      admin: `/admin/${API_VERSION}`,
      health: '/health'
    }
  });
});

module.exports = router;
