const Settings = require('../models/Settings');
const AdminUser = require('../models/AdminUser');
const { testEmailConfig, sendAdminNotification } = require('../utils/emailConfig');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Get all settings
 */
const getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.find().populate('updatedBy', 'username email');
    
    // Group by category
    const groupedSettings = {};
    settings.forEach(setting => {
      if (!groupedSettings[setting.category]) {
        groupedSettings[setting.category] = [];
      }
      groupedSettings[setting.category].push(setting.toSafeJSON());
    });
    
    res.json({
      success: true,
      data: groupedSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

/**
 * Get settings by category
 */
const getSettingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const decrypt = req.query.decrypt === 'true';
    
    // Only decrypt if user is super admin
    const shouldDecrypt = decrypt && req.admin.role === 'super_admin';
    
    const settings = await Settings.getByCategory(category, shouldDecrypt);
    
    res.json({
      success: true,
      category,
      data: settings.map(s => shouldDecrypt ? s : (s.toSafeJSON ? s.toSafeJSON() : s))
    });
  } catch (error) {
    console.error('Error fetching category settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

/**
 * Update settings for a category
 */
const updateCategorySettings = async (req, res) => {
  try {
    const { category } = req.params;
    const { settings } = req.body;
    
    if (!Array.isArray(settings)) {
      return res.status(400).json({
        success: false,
        message: 'Settings must be an array'
      });
    }
    
    // Update each setting
    const updatePromises = settings.map(async (setting) => {
      return Settings.setSetting(
        category,
        setting.key,
        setting.value,
        {
          dataType: setting.dataType,
          description: setting.description,
          isEncrypted: setting.isEncrypted,
          updatedBy: req.admin._id
        }
      );
    });
    
    await Promise.all(updatePromises);
    
    // Fetch updated settings
    const updatedSettings = await Settings.getByCategory(category);
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

/**
 * Update a single setting
 */
const updateSetting = async (req, res) => {
  try {
    const { category, key } = req.params;
    const { value, dataType, description, isEncrypted } = req.body;
    
    const setting = await Settings.setSetting(
      category,
      key,
      value,
      {
        dataType: dataType || 'string',
        description: description || '',
        isEncrypted: isEncrypted || false,
        updatedBy: req.admin._id
      }
    );
    
    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting.toSafeJSON()
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating setting',
      error: error.message
    });
  }
};

/**
 * Delete a setting
 */
const deleteSetting = async (req, res) => {
  try {
    const { category, key } = req.params;
    
    await Settings.deleteSetting(category, key);
    
    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting setting',
      error: error.message
    });
  }
};

/**
 * Test email configuration
 */
const testEmail = async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        message: 'Test email address is required'
      });
    }
    
    const result = await testEmailConfig(testEmail);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error testing email:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing email configuration',
      error: error.message
    });
  }
};

/**
 * Get system information
 */
const getSystemInfo = async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../../assets/uploads');
    
    // Get directory size
    const getDirSize = async (dirPath) => {
      try {
        let size = 0;
        const files = await fs.readdir(dirPath);
        
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stats = await fs.stat(filePath);
          
          if (stats.isDirectory()) {
            size += await getDirSize(filePath);
          } else {
            size += stats.size;
          }
        }
        
        return size;
      } catch (error) {
        return 0;
      }
    };
    
    const uploadsSize = await getDirSize(uploadsDir);
    
    // Get database info
    const mongoose = require('mongoose');
    const dbStats = await mongoose.connection.db.stats();
    
    const systemInfo = {
      server: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        nodeVersion: process.version,
        uptime: process.uptime(),
        processUptime: process.uptime()
      },
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        processMemory: process.memoryUsage()
      },
      cpu: {
        model: os.cpus()[0]?.model || 'Unknown',
        cores: os.cpus().length,
        loadAverage: os.loadavg()
      },
      database: {
        connected: mongoose.connection.readyState === 1,
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        size: dbStats.dataSize,
        collections: dbStats.collections,
        indexes: dbStats.indexes
      },
      storage: {
        uploadsSize: uploadsSize,
        uploadsSizeMB: (uploadsSize / (1024 * 1024)).toFixed(2)
      }
    };
    
    res.json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    console.error('Error fetching system info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system information',
      error: error.message
    });
  }
};

/**
 * Create backup
 */
const createBackup = async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}`);
    
    // Create backup directory if it doesn't exist
    await fs.mkdir(backupDir, { recursive: true });
    await fs.mkdir(backupPath, { recursive: true });
    
    // Backup database
    const dbName = process.env.ADMIN_DB_NAME || 'manpower_admin';
    const dbBackupPath = path.join(backupPath, 'database');
    
    try {
      await execPromise(`mongodump --db ${dbName} --out ${dbBackupPath}`);
    } catch (error) {
      console.error('MongoDB backup error:', error);
    }
    
    // Copy uploads folder
    const uploadsDir = path.join(__dirname, '../../assets/uploads');
    const uploadsBackupPath = path.join(backupPath, 'uploads');
    
    try {
      await execPromise(`cp -r ${uploadsDir} ${uploadsBackupPath}`);
    } catch (error) {
      console.error('Uploads backup error:', error);
    }
    
    // Get backup size
    const getSize = async (dirPath) => {
      try {
        const { stdout } = await execPromise(`du -sb ${dirPath}`);
        return parseInt(stdout.split('\t')[0]);
      } catch (error) {
        return 0;
      }
    };
    
    const backupSize = await getSize(backupPath);
    
    res.json({
      success: true,
      message: 'Backup created successfully',
      data: {
        backupPath,
        timestamp,
        size: backupSize,
        sizeMB: (backupSize / (1024 * 1024)).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating backup',
      error: error.message
    });
  }
};

/**
 * Get backup history
 */
const getBackupHistory = async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    
    // Create directory if it doesn't exist
    try {
      await fs.mkdir(backupDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
    
    const files = await fs.readdir(backupDir);
    const backups = [];
    
    for (const file of files) {
      const filePath = path.join(backupDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        backups.push({
          name: file,
          path: filePath,
          date: stats.mtime,
          size: stats.size,
          sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
        });
      }
    }
    
    // Sort by date (newest first)
    backups.sort((a, b) => b.date - a.date);
    
    res.json({
      success: true,
      data: backups
    });
  } catch (error) {
    console.error('Error fetching backup history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching backup history',
      error: error.message
    });
  }
};

/**
 * Reset category settings to defaults
 */
const resetCategorySettings = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Delete all settings in category
    await Settings.deleteMany({ category });
    
    // Initialize default settings
    await initializeDefaultSettings(category);
    
    // Fetch new settings
    const settings = await Settings.getByCategory(category);
    
    res.json({
      success: true,
      message: 'Settings reset to defaults successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting settings',
      error: error.message
    });
  }
};

/**
 * Initialize default settings for a category
 */
const initializeDefaultSettings = async (category) => {
  const defaults = getDefaultSettings();
  
  if (defaults[category]) {
    const settings = defaults[category];
    await Settings.bulkUpdate(category, settings, null);
  }
};

/**
 * Get default settings configuration
 */
const getDefaultSettings = () => {
  return {
    general: [
      { key: 'company_name_en', value: 'Manpower Supply Company', dataType: 'string', description: 'Company name in English' },
      { key: 'company_name_ar', value: 'شركة توريد العمالة', dataType: 'string', description: 'Company name in Arabic' },
      { key: 'registration_number', value: '', dataType: 'string', description: 'Company registration number' },
      { key: 'tax_number', value: '', dataType: 'string', description: 'Tax/VAT ID' },
      { key: 'founded_year', value: 2000, dataType: 'number', description: 'Company founded year' },
      { key: 'default_language', value: 'en', dataType: 'string', description: 'Default language' },
      { key: 'default_currency', value: 'SAR', dataType: 'string', description: 'Default currency' },
      { key: 'date_format', value: 'DD/MM/YYYY', dataType: 'string', description: 'Date format' },
      { key: 'timezone', value: 'Asia/Riyadh', dataType: 'string', description: 'System timezone' },
      { key: 'primary_phone', value: '', dataType: 'string', description: 'Primary phone number' },
      { key: 'primary_email', value: '', dataType: 'string', description: 'Primary email address' },
      { key: 'support_email', value: '', dataType: 'string', description: 'Support email address' }
    ],
    email: [
      { key: 'smtp_host', value: '', dataType: 'string', description: 'SMTP server host' },
      { key: 'smtp_port', value: 587, dataType: 'number', description: 'SMTP port' },
      { key: 'smtp_username', value: '', dataType: 'string', description: 'SMTP username' },
      { key: 'smtp_password', value: '', dataType: 'string', description: 'SMTP password', isEncrypted: true },
      { key: 'encryption_type', value: 'TLS', dataType: 'string', description: 'Encryption type (None/SSL/TLS)' },
      { key: 'from_name', value: 'Manpower Company', dataType: 'string', description: 'From name for emails' },
      { key: 'from_email', value: '', dataType: 'string', description: 'From email address' }
    ],
    security: [
      { key: 'min_password_length', value: 8, dataType: 'number', description: 'Minimum password length' },
      { key: 'require_uppercase', value: true, dataType: 'boolean', description: 'Require uppercase letters' },
      { key: 'require_numbers', value: true, dataType: 'boolean', description: 'Require numbers' },
      { key: 'require_special_chars', value: true, dataType: 'boolean', description: 'Require special characters' },
      { key: 'password_expiry_days', value: 90, dataType: 'number', description: 'Password expiry in days (0 = never)' },
      { key: 'account_lockout_attempts', value: 5, dataType: 'number', description: 'Failed login attempts before lockout' },
      { key: 'lockout_duration_minutes', value: 30, dataType: 'number', description: 'Account lockout duration in minutes' },
      { key: 'session_timeout_minutes', value: 60, dataType: 'number', description: 'Session timeout in minutes' },
      { key: 'enable_2fa', value: false, dataType: 'boolean', description: 'Enable two-factor authentication' }
    ],
    system: [
      { key: 'cache_duration_minutes', value: 60, dataType: 'number', description: 'Cache duration in minutes' },
      { key: 'max_file_size_mb', value: 10, dataType: 'number', description: 'Maximum file upload size in MB' },
      { key: 'enable_image_compression', value: true, dataType: 'boolean', description: 'Enable image compression' },
      { key: 'compression_quality', value: 80, dataType: 'number', description: 'Image compression quality (0-100)' },
      { key: 'api_rate_limit', value: 100, dataType: 'number', description: 'API requests per minute' },
      { key: 'maintenance_mode', value: false, dataType: 'boolean', description: 'Enable maintenance mode' }
    ],
    backup: [
      { key: 'enable_auto_backup', value: true, dataType: 'boolean', description: 'Enable automated backups' },
      { key: 'backup_frequency', value: 'daily', dataType: 'string', description: 'Backup frequency (daily/weekly/monthly)' },
      { key: 'backup_retention_days', value: 30, dataType: 'number', description: 'Backup retention in days' },
      { key: 'include_uploads', value: true, dataType: 'boolean', description: 'Include file uploads in backup' }
    ],
    language: [
      { key: 'system_language', value: 'en', dataType: 'string', description: 'System default language' },
      { key: 'enable_rtl', value: true, dataType: 'boolean', description: 'Enable RTL support' },
      { key: 'auto_detect_language', value: true, dataType: 'boolean', description: 'Auto-detect user language' }
    ],
    api: [
      { key: 'enable_public_api', value: false, dataType: 'boolean', description: 'Enable public API access' },
      { key: 'api_rate_limit', value: 60, dataType: 'number', description: 'API rate limit per minute' }
    ],
    website: [
      { key: 'meta_title_en', value: 'Manpower Supply Company', dataType: 'string', description: 'Default meta title (EN)' },
      { key: 'meta_title_ar', value: 'شركة توريد العمالة', dataType: 'string', description: 'Default meta title (AR)' },
      { key: 'enable_contact_form', value: true, dataType: 'boolean', description: 'Enable contact form' },
      { key: 'enable_recaptcha', value: false, dataType: 'boolean', description: 'Enable reCAPTCHA' }
    ]
  };
};

/**
 * Initialize all default settings
 */
const initializeAllSettings = async (req, res) => {
  try {
    const categories = ['general', 'email', 'security', 'system', 'backup', 'language', 'api', 'website'];
    
    for (const category of categories) {
      await initializeDefaultSettings(category);
    }
    
    res.json({
      success: true,
      message: 'All default settings initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing settings',
      error: error.message
    });
  }
};

module.exports = {
  getAllSettings,
  getSettingsByCategory,
  updateCategorySettings,
  updateSetting,
  deleteSetting,
  testEmail,
  getSystemInfo,
  createBackup,
  getBackupHistory,
  resetCategorySettings,
  initializeAllSettings
};
