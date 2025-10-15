const mongoose = require('mongoose');
const crypto = require('crypto');

const settingsSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true,
    enum: ['general', 'email', 'security', 'system', 'backup', 'api', 'language', 'website']
  },
  key: { 
    type: String, 
    required: true,
    trim: true
  },
  value: mongoose.Schema.Types.Mixed, // Can store any type
  dataType: { 
    type: String, 
    enum: ['string', 'number', 'boolean', 'array', 'object', 'json'],
    required: true 
  },
  description: {
    type: String,
    default: ''
  },
  isEncrypted: { 
    type: Boolean, 
    default: false 
  },
  isPublic: {
    type: Boolean,
    default: false // Most settings are private by default
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AdminUser' 
  }
}, { 
  timestamps: true 
});

// Compound index for faster lookups
settingsSchema.index({ category: 1, key: 1 }, { unique: true });

// Encryption key (should be stored in environment variable)
const ENCRYPTION_KEY = process.env.SETTINGS_ENCRYPTION_KEY || '12345678901234567890123456789012';
const ALGORITHM = 'aes-256-cbc';

// Method to encrypt sensitive data
settingsSchema.methods.encryptValue = function(value) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Method to decrypt sensitive data
settingsSchema.methods.decryptValue = function(encryptedValue) {
  try {
    const parts = encryptedValue.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Pre-save hook to encrypt sensitive values
settingsSchema.pre('save', function(next) {
  if (this.isModified('value') && this.isEncrypted && typeof this.value === 'string' && !this.value.includes(':')) {
    this.value = this.encryptValue(this.value);
  }
  next();
});

// Static method to get settings by category
settingsSchema.statics.getByCategory = async function(category, decrypt = false) {
  const settings = await this.find({ category });
  
  if (decrypt) {
    return settings.map(setting => {
      if (setting.isEncrypted && setting.value) {
        return {
          ...setting.toObject(),
          value: setting.decryptValue(setting.value)
        };
      }
      return setting.toObject();
    });
  }
  
  return settings;
};

// Static method to get a single setting
settingsSchema.statics.getSetting = async function(category, key, decrypt = false) {
  const setting = await this.findOne({ category, key });
  
  if (!setting) return null;
  
  if (decrypt && setting.isEncrypted && setting.value) {
    return {
      ...setting.toObject(),
      value: setting.decryptValue(setting.value)
    };
  }
  
  return setting;
};

// Static method to update or create a setting
settingsSchema.statics.setSetting = async function(category, key, value, options = {}) {
  const { dataType, description, isEncrypted, updatedBy } = options;
  
  return this.findOneAndUpdate(
    { category, key },
    { 
      value, 
      dataType: dataType || 'string',
      description: description || '',
      isEncrypted: isEncrypted || false,
      updatedBy
    },
    { 
      new: true, 
      upsert: true,
      runValidators: true
    }
  );
};

// Static method to bulk update settings
settingsSchema.statics.bulkUpdate = async function(category, settings, updatedBy) {
  const operations = settings.map(setting => ({
    updateOne: {
      filter: { category, key: setting.key },
      update: { 
        $set: { 
          value: setting.value,
          dataType: setting.dataType || 'string',
          description: setting.description || '',
          isEncrypted: setting.isEncrypted || false,
          updatedBy
        }
      },
      upsert: true
    }
  }));
  
  return this.bulkWrite(operations);
};

// Static method to delete a setting
settingsSchema.statics.deleteSetting = async function(category, key) {
  return this.deleteOne({ category, key });
};

// Method to convert to safe public JSON (hide encrypted values)
settingsSchema.methods.toSafeJSON = function() {
  const obj = this.toObject();
  if (this.isEncrypted) {
    obj.value = '********';
  }
  return obj;
};

module.exports = mongoose.model('Settings', settingsSchema);
