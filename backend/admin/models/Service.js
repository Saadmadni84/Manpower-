const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title_en: {
    type: String,
    required: true,
    trim: true
  },
  title_ar: {
    type: String,
    required: true,
    trim: true
  },
  description_en: {
    type: String,
    required: true
  },
  description_ar: {
    type: String,
    required: true
  },
  short_description_en: {
    type: String,
    maxlength: 200
  },
  short_description_ar: {
    type: String,
    maxlength: 200
  },
  icon: {
    type: String,
    default: '⚡'
  },
  image: {
    type: String,
    default: ''
  },
  is_active: {
    type: Boolean,
    default: true
  },
  display_order: {
    type: Number,
    default: 0
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
serviceSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Index for efficient queries
serviceSchema.index({ is_active: 1, display_order: 1 });

module.exports = mongoose.model('AdminService', serviceSchema);
