const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  // Basic language information
  code: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 5
  },
  
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  nativeName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // Language details
  direction: {
    type: String,
    enum: ['ltr', 'rtl'],
    default: 'ltr'
  },
  
  flag: {
    url: String,
    publicId: String,
    alt: String
  },
  
  // Language settings
  isActive: {
    type: Boolean,
    default: true
  },
  
  isDefault: {
    type: Boolean,
    default: false
  },
  
  // Language statistics
  stats: {
    translatedPages: {
      type: Number,
      default: 0
    },
    translatedContent: {
      type: Number,
      default: 0
    },
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Created and updated by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
languageSchema.index({ code: 1 });
languageSchema.index({ isActive: 1 });
languageSchema.index({ isDefault: 1 });
languageSchema.index({ createdAt: -1 });

// Pre-save middleware
languageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
languageSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    code: this.code,
    name: this.name,
    nativeName: this.nativeName,
    direction: this.direction,
    flag: this.flag,
    isActive: this.isActive,
    isDefault: this.isDefault,
    stats: this.stats,
    createdAt: this.createdAt
  };
};

// Static methods
languageSchema.statics.getActiveLanguages = function() {
  return this.find({ isActive: true }).sort({ isDefault: -1, name: 1 });
};

languageSchema.statics.getDefaultLanguage = function() {
  return this.findOne({ isActive: true, isDefault: true });
};

languageSchema.statics.getLanguageByCode = function(code) {
  return this.findOne({ code: code.toLowerCase(), isActive: true });
};

module.exports = mongoose.model('Language', languageSchema);
