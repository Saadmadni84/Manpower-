const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/SettingsController');
const { 
  requireSuperAdmin, 
  requireAdmin, 
  canManageCategory,
  logSettingsChange,
  validateSettingValue
} = require('../middleware/settingsAuth');

// Get all settings (admin only)
router.get('/', requireAdmin, settingsController.getAllSettings);

// Initialize default settings (super admin only)
router.post('/initialize', requireSuperAdmin, settingsController.initializeAllSettings);

// Get settings by category
router.get('/:category', requireAdmin, settingsController.getSettingsByCategory);

// Update settings for a category
router.put(
  '/:category',
  logSettingsChange,
  canManageCategory,
  validateSettingValue,
  settingsController.updateCategorySettings
);

// Update a single setting
router.put(
  '/:category/:key',
  logSettingsChange,
  canManageCategory,
  validateSettingValue,
  settingsController.updateSetting
);

// Delete a setting (super admin only)
router.delete('/:category/:key', requireSuperAdmin, settingsController.deleteSetting);

// Reset category to defaults (super admin only)
router.post('/reset/:category', requireSuperAdmin, settingsController.resetCategorySettings);

// Test email configuration
router.post('/test-email', requireAdmin, settingsController.testEmail);

// Get system information
router.get('/system/info', requireAdmin, settingsController.getSystemInfo);

// Backup management
router.post('/backup/create', requireSuperAdmin, settingsController.createBackup);
router.get('/backup/history', requireAdmin, settingsController.getBackupHistory);

module.exports = router;
