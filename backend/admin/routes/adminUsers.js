const express = require('express');
const router = express.Router();
const AdminUserController = require('../controllers/AdminUserController');
const { authenticateAdmin, authorizeAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticateAdmin);

// Get all users (admin and above)
router.get('/', authorizeAdmin(['super_admin', 'admin']), AdminUserController.getAllUsers);

// Get user statistics (admin and above)
router.get('/stats', authorizeAdmin(['super_admin', 'admin']), AdminUserController.getUserStats);

// Get user by ID (admin and above)
router.get('/:id', authorizeAdmin(['super_admin', 'admin']), AdminUserController.getUserById);

// Create new user (super admin only)
router.post('/', authorizeAdmin(['super_admin']), AdminUserController.createUser);

// Update user (super admin only, or users can update themselves)
router.put('/:id', (req, res, next) => {
  // Allow super admins to update anyone, or users to update themselves
  if (req.admin.role === 'super_admin' || req.admin._id.toString() === req.params.id) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Insufficient permissions'
  });
}, AdminUserController.updateUser);

// Delete user (super admin only)
router.delete('/:id', authorizeAdmin(['super_admin']), AdminUserController.deleteUser);

// Change password (super admin only, or users can change their own password)
router.post('/:id/change-password', (req, res, next) => {
  // Allow super admins to change anyone's password, or users to change their own
  if (req.admin.role === 'super_admin' || req.admin._id.toString() === req.params.id) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Insufficient permissions'
  });
}, AdminUserController.changePassword);

// Toggle user status (super admin only)
router.patch('/:id/toggle-status', authorizeAdmin(['super_admin']), AdminUserController.toggleUserStatus);

module.exports = router;
