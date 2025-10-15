const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  // Basic image information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  description: {
    type: String,
    maxlength: 1000
  },
  
  // Image details
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GalleryCategory',
    required: true
  },
  
  // Image file information
  image: {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    filename: String,
    originalName: String,
    size: Number,
    mimetype: String,
    width: Number,
    height: Number,
    format: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Thumbnail information
  thumbnail: {
    url: String,
    publicId: String,
    width: Number,
    height: Number
  },
  
  // Image metadata
  metadata: {
    camera: String,
    lens: String,
    settings: {
      aperture: String,
      shutterSpeed: String,
      iso: String,
      focalLength: String
    },
    location: {
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    tags: [String],
    keywords: [String]
  },
  
  // Image settings
  settings: {
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    allowDownload: {
      type: Boolean,
      default: false
    },
    showInGallery: {
      type: Boolean,
      default: true
    }
  },
  
  // SEO and meta information
  seo: {
    alt: String,
    caption: String,
    credit: String,
    metaTitle: String,
    metaDescription: String
  },
  
  // Multi-language support
  translations: {
    en: {
      title: String,
      description: String,
      caption: String
    },
    ar: {
      title: String,
      description: String,
      caption: String
    }
  },
  
  // Status and settings
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'active'
  },
  
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // View statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
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
galleryImageSchema.index({ title: 1 });
galleryImageSchema.index({ category: 1 });
galleryImageSchema.index({ status: 1 });
galleryImageSchema.index({ 'settings.isFeatured': 1 });
galleryImageSchema.index({ 'settings.isPublic': 1 });
galleryImageSchema.index({ 'settings.showInGallery': 1 });
galleryImageSchema.index({ sortOrder: 1 });
galleryImageSchema.index({ createdAt: -1 });

// Text index for search functionality
galleryImageSchema.index({
  title: 'text',
  description: 'text',
  'metadata.tags': 'text',
  'metadata.keywords': 'text'
});

// Pre-save middleware
galleryImageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
galleryImageSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    category: this.category,
    image: {
      url: this.image.url,
      width: this.image.width,
      height: this.image.height,
      format: this.image.format
    },
    thumbnail: this.thumbnail,
    metadata: {
      location: this.metadata.location,
      tags: this.metadata.tags
    },
    settings: this.settings,
    seo: {
      alt: this.seo.alt,
      caption: this.seo.caption,
      credit: this.seo.credit
    },
    stats: this.stats,
    createdAt: this.createdAt
  };
};

galleryImageSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

galleryImageSchema.methods.incrementDownloads = function() {
  this.stats.downloads += 1;
  return this.save();
};

galleryImageSchema.methods.incrementLikes = function() {
  this.stats.likes += 1;
  return this.save();
};

galleryImageSchema.methods.updateMetadata = function(metadata) {
  this.metadata = { ...this.metadata, ...metadata };
  return this.save();
};

// Static methods
galleryImageSchema.statics.getActiveImages = function() {
  return this.find({ 
    status: 'active',
    'settings.showInGallery': true 
  }).sort({ sortOrder: 1, createdAt: -1 });
};

galleryImageSchema.statics.getFeaturedImages = function() {
  return this.find({ 
    status: 'active',
    'settings.isFeatured': true,
    'settings.showInGallery': true 
  }).sort({ sortOrder: 1, createdAt: -1 });
};

galleryImageSchema.statics.getImagesByCategory = function(categoryId) {
  return this.find({ 
    status: 'active',
    category: categoryId,
    'settings.showInGallery': true 
  }).sort({ sortOrder: 1, createdAt: -1 });
};

galleryImageSchema.statics.getPublicImages = function() {
  return this.find({ 
    status: 'active',
    'settings.isPublic': true,
    'settings.showInGallery': true 
  }).sort({ sortOrder: 1, createdAt: -1 });
};

galleryImageSchema.statics.searchImages = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    status: 'active',
    'settings.showInGallery': true,
    $or: [
      { title: searchRegex },
      { description: searchRegex },
      { 'metadata.tags': { $in: [searchRegex] } },
      { 'metadata.keywords': { $in: [searchRegex] } }
    ]
  }).sort({ sortOrder: 1, createdAt: -1 });
};

galleryImageSchema.statics.getRecentImages = function(limit = 10) {
  return this.find({ 
    status: 'active',
    'settings.showInGallery': true 
  }).sort({ createdAt: -1 }).limit(limit);
};

galleryImageSchema.statics.getMostViewedImages = function(limit = 10) {
  return this.find({ 
    status: 'active',
    'settings.showInGallery': true 
  }).sort({ 'stats.views': -1 }).limit(limit);
};

galleryImageSchema.statics.getGalleryStats = function() {
  return this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: null,
        totalImages: { $sum: 1 },
        totalViews: { $sum: '$stats.views' },
        totalDownloads: { $sum: '$stats.downloads' },
        totalLikes: { $sum: '$stats.likes' },
        averageViews: { $avg: '$stats.views' }
      }
    }
  ]);
};

galleryImageSchema.statics.getImagesByDateRange = function(startDate, endDate) {
  return this.find({
    status: 'active',
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
