const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footerController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/rolePermission');

/**
 * Public Routes
 */

// Get active footer content
router.get('/content', footerController.getFooterContent);

/**
 * Admin Routes (Protected)
 */

// Get all footer content (admin only)
router.get('/admin/content/all', 
  authenticateToken, 
  checkRole(['admin', 'super_admin']), 
  footerController.getAllFooterContent
);

// Update footer content (admin only)
router.put('/admin/content', 
  authenticateToken, 
  checkRole(['admin', 'super_admin']), 
  footerController.updateFooterContent
);

// Toggle footer active status (admin only)
router.patch('/admin/content/:id/toggle', 
  authenticateToken, 
  checkRole(['admin', 'super_admin']), 
  footerController.toggleFooterActive
);

module.exports = router;

