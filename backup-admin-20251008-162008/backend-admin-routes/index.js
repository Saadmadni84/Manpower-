const express = require('express');
const router = express.Router();

// Import admin routes
const authRoutes = require('./auth');

// Mount routes
router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Admin API is running'
  });
});

module.exports = router;
