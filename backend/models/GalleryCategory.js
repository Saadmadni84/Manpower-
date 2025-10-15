const mongoose = require('mongoose');

const galleryCategorySchema = new mongoose.Schema({
  // Basic category information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  description: {
    type: String,
    maxlength: 1000
  },
  
  shortDescription: {
    type: String,
    maxlength: 500
  },
  
  // Category details
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GalleryCategory'
  },
  
  // Visual elements
  icon: {
    url: String,
    publicId: String,
    alt: String
  },
  
  coverImage: {
    url: String,
    publicId: String,
    alt: String
  },
  
  // Category settings
  isPublic: {
    type: Boolean,
    default: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Multi-language support
  translations: {
    en: {
      name: String,
      description: String,
      shortDescription: String
    },
    ar: {
      name: String,
      description: String,
      shortDescription: String
    }
  },
  
  // Status and settings
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  
  sortOrder: {
    type: Number,
    default: 0
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
galleryCategorySchema.index({ name: 1 });
galleryCategorySchema.index({ slug: 1 });
galleryCategorySchema.index({ parentCategory: 1 });
galleryCategorySchema.index({ status: 1 });
galleryCategorySchema.index({ isPublic: 1 });
galleryCategorySchema.index({ isActive: 1 });
galleryCategorySchema.index({ sortOrder: 1 });
galleryCategorySchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug
galleryCategorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = new Date();
  next();
});

// Instance methods
galleryCategorySchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    slug: this.slug,
    description: this.description,
    shortDescription: this.shortDescription,
    parentCategory: this.parentCategory,
    icon: this.icon,
    coverImage: this.coverImage,
    isPublic: this.isPublic,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
galleryCategorySchema.statics.getActiveCategories = function() {
  return this.find({ status: 'active', isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
};

galleryCategorySchema.statics.getPublicCategories = function() {
  return this.find({ status: 'active', isActive: true, isPublic: true }).sort({ sortOrder: 1 });
};

galleryCategorySchema.statics.getParentCategories = function() {
  return this.find({ 
    status: 'active',
    isActive: true,
    parentCategory: { $exists: false }
  }).sort({ sortOrder: 1 });
};

galleryCategorySchema.statics.getSubCategories = function(parentId) {
  return this.find({ 
    status: 'active',
    isActive: true,
    parentCategory: parentId 
  }).sort({ sortOrder: 1 });
};

galleryCategorySchema.statics.getCategoryBySlug = function(slug) {
  return this.findOne({ status: 'active', isActive: true, slug });
};

module.exports = mongoose.model('GalleryCategory', galleryCategorySchema);
