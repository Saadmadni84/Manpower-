const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['about', 'home', 'contact', 'services', 'careers', 'gallery']
  },
  content_key: {
    type: String,
    required: true,
    trim: true
  },
  content_value_en: {
    type: String,
    required: true
  },
  content_value_ar: {
    type: String,
    required: true
  },
  data_type: {
    type: String,
    enum: ['text', 'html', 'number', 'image', 'json'],
    default: 'text'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
siteContentSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Index for efficient queries
siteContentSchema.index({ section: 1, content_key: 1 });

module.exports = mongoose.model('SiteContent', siteContentSchema);
