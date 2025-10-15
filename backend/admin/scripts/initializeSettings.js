const mongoose = require('mongoose');
const Settings = require('../models/Settings');

// Database configuration
const ADMIN_DB_URI = process.env.ADMIN_DB_URI || 'mongodb://localhost:27017/manpower_admin';

// Default settings configuration
const defaultSettings = {
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
    { key: 'support_email', value: '', dataType: 'string', description: 'Support email address' },
    { key: 'sales_email', value: '', dataType: 'string', description: 'Sales email address' },
    { key: 'company_description_en', value: '', dataType: 'string', description: 'Company description (English)' },
    { key: 'company_description_ar', value: '', dataType: 'string', description: 'Company description (Arabic)' },
    { key: 'physical_address_en', value: '', dataType: 'string', description: 'Physical address (English)' },
    { key: 'physical_address_ar', value: '', dataType: 'string', description: 'Physical address (Arabic)' },
    { key: 'website_url', value: '', dataType: 'string', description: 'Website URL' },
    { key: 'linkedin_url', value: '', dataType: 'string', description: 'LinkedIn profile URL' },
    { key: 'twitter_url', value: '', dataType: 'string', description: 'Twitter profile URL' },
    { key: 'facebook_url', value: '', dataType: 'string', description: 'Facebook page URL' },
    { key: 'instagram_url', value: '', dataType: 'string', description: 'Instagram profile URL' }
  ],
  email: [
    { key: 'smtp_host', value: '', dataType: 'string', description: 'SMTP server host' },
    { key: 'smtp_port', value: 587, dataType: 'number', description: 'SMTP port' },
    { key: 'smtp_username', value: '', dataType: 'string', description: 'SMTP username' },
    { key: 'smtp_password', value: '', dataType: 'string', description: 'SMTP password', isEncrypted: true },
    { key: 'encryption_type', value: 'TLS', dataType: 'string', description: 'Encryption type (None/SSL/TLS)' },
    { key: 'from_name', value: 'Manpower Company', dataType: 'string', description: 'From name for emails' },
    { key: 'from_email', value: '', dataType: 'string', description: 'From email address' },
    { key: 'enable_notifications', value: true, dataType: 'boolean', description: 'Enable email notifications' },
    { key: 'notify_new_inquiry', value: true, dataType: 'boolean', description: 'Notify on new contact inquiry' },
    { key: 'notify_new_application', value: true, dataType: 'boolean', description: 'Notify on new job application' }
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
    { key: 'enable_2fa', value: false, dataType: 'boolean', description: 'Enable two-factor authentication' },
    { key: 'log_login_attempts', value: true, dataType: 'boolean', description: 'Log all login attempts' },
    { key: 'log_admin_activities', value: true, dataType: 'boolean', description: 'Log admin activities' }
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
    { key: 'api_rate_limit', value: 60, dataType: 'number', description: 'API rate limit per minute' },
    { key: 'google_analytics_id', value: '', dataType: 'string', description: 'Google Analytics ID' },
    { key: 'google_tag_manager_id', value: '', dataType: 'string', description: 'Google Tag Manager ID' },
    { key: 'facebook_pixel_id', value: '', dataType: 'string', description: 'Facebook Pixel ID' },
    { key: 'recaptcha_site_key', value: '', dataType: 'string', description: 'reCAPTCHA site key' },
    { key: 'recaptcha_secret_key', value: '', dataType: 'string', description: 'reCAPTCHA secret key', isEncrypted: true }
  ],
  website: [
    { key: 'meta_title_en', value: 'Manpower Supply Company', dataType: 'string', description: 'Default meta title (EN)' },
    { key: 'meta_title_ar', value: 'شركة توريد العمالة', dataType: 'string', description: 'Default meta title (AR)' },
    { key: 'meta_description_en', value: '', dataType: 'string', description: 'Default meta description (EN)' },
    { key: 'meta_description_ar', value: '', dataType: 'string', description: 'Default meta description (AR)' },
    { key: 'meta_keywords_en', value: '', dataType: 'string', description: 'Default meta keywords (EN)' },
    { key: 'meta_keywords_ar', value: '', dataType: 'string', description: 'Default meta keywords (AR)' },
    { key: 'enable_contact_form', value: true, dataType: 'boolean', description: 'Enable contact form' },
    { key: 'enable_recaptcha', value: false, dataType: 'boolean', description: 'Enable reCAPTCHA' },
    { key: 'enable_schema_markup', value: true, dataType: 'boolean', description: 'Enable Schema.org markup' },
    { key: 'google_search_console_code', value: '', dataType: 'string', description: 'Google Search Console verification' },
    { key: 'bing_webmaster_code', value: '', dataType: 'string', description: 'Bing Webmaster verification' },
    { key: 'og_image_url', value: '', dataType: 'string', description: 'Open Graph default image' }
  ]
};

// Initialize settings
async function initializeSettings() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(ADMIN_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to database');

    console.log('\n📝 Initializing default settings...\n');

    let totalCreated = 0;
    let totalUpdated = 0;

    for (const [category, settings] of Object.entries(defaultSettings)) {
      console.log(`\n📂 Processing category: ${category}`);
      
      for (const setting of settings) {
        const existing = await Settings.findOne({
          category,
          key: setting.key
        });

        if (existing) {
          console.log(`  ⏭️  Skipping ${setting.key} (already exists)`);
          totalUpdated++;
        } else {
          await Settings.create({
            category,
            key: setting.key,
            value: setting.value,
            dataType: setting.dataType,
            description: setting.description,
            isEncrypted: setting.isEncrypted || false
          });
          console.log(`  ✅ Created ${setting.key}`);
          totalCreated++;
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Settings Initialization Complete!');
    console.log('='.repeat(60));
    console.log(`📊 Total settings created: ${totalCreated}`);
    console.log(`📊 Total settings skipped: ${totalUpdated}`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error initializing settings:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the initialization
if (require.main === module) {
  initializeSettings();
}

module.exports = initializeSettings;
