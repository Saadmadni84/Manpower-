const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  // Multilingual Title
  title: {
    en: { type: String, required: true },
    ar: { type: String }
  },
  
  // Multilingual Description
  description: {
    en: { type: String },
    ar: { type: String }
  },
  
  // Image Information
  image: { type: String, required: true }, // main image path/URL
  thumbnail: { type: String }, // thumbnail path/URL
  originalFilename: { type: String, required: true },
  
  // Cloudinary Integration
  cloudinaryId: { type: String }, // Cloudinary public ID
  cloudinaryUrl: { type: String }, // Cloudinary secure URL
  thumbnailCloudinaryId: { type: String },
  thumbnailCloudinaryUrl: { type: String },
  
  // Image Metadata
  fileSize: { type: Number }, // in bytes
  dimensions: {
    width: { type: Number },
    height: { type: Number }
  },
  mimeType: { type: String },
  
  // Categorization
  category: { 
    type: String, 
    enum: ['company_events', 'projects', 'team_photos', 'facilities', 'achievements', 'training', 'awards', 'client_visits', 'other'],
    required: true,
    default: 'other'
  },
  
  // Tags and Keywords
  tags: [String],
  keywords: [String], // for search
  
  // Display Settings
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  displayOnHomepage: { type: Boolean, default: false },
  
  // Date Information
  photoDate: { type: Date }, // when photo was taken
  eventName: { type: String }, // event/project name
  location: { type: String }, // where photo was taken
  
  // SEO
  altText: {
    en: { type: String },
    ar: { type: String }
  },
  
  // Analytics
  stats: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
  },
  
  // Metadata
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
gallerySchema.index({ category: 1, isActive: 1, displayOrder: 1 });
gallerySchema.index({ isFeatured: 1, isActive: 1 });
gallerySchema.index({ displayOnHomepage: 1, isActive: 1 });
gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ photoDate: -1 });

// Text index for search
gallerySchema.index({
  'title.en': 'text',
  'title.ar': 'text',
  'description.en': 'text',
  'description.ar': 'text',
  tags: 'text',
  keywords: 'text',
  eventName: 'text'
});

// Instance methods
gallerySchema.methods.incrementViews = async function() {
  this.stats.views += 1;
  return this.save();
};

gallerySchema.methods.incrementDownloads = async function() {
  this.stats.downloads += 1;
  return this.save();
};

// Static methods
gallerySchema.statics.getActiveImages = function(filters = {}) {
  return this.find({ 
    isActive: true,
    ...filters
  }).sort({ displayOrder: 1, createdAt: -1 });
};

gallerySchema.statics.getFeaturedImages = function() {
  return this.find({ 
    isActive: true,
    isFeatured: true
  }).sort({ displayOrder: 1, createdAt: -1 });
};

gallerySchema.statics.getHomepageImages = function() {
  return this.find({ 
    isActive: true,
    displayOnHomepage: true
  }).sort({ displayOrder: 1, createdAt: -1 });
};

gallerySchema.statics.getByCategory = function(category) {
  return this.find({ 
    isActive: true,
    category
  }).sort({ displayOrder: 1, createdAt: -1 });
};

gallerySchema.statics.searchImages = function(query) {
  return this.find({
    $text: { $search: query },
    isActive: true
  }).sort({ score: { $meta: 'textScore' } });
};

gallerySchema.statics.getGalleryStats = async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalImages: { $sum: 1 },
        totalViews: { $sum: '$stats.views' },
        totalDownloads: { $sum: '$stats.downloads' },
        totalSize: { $sum: '$fileSize' },
        featuredCount: { 
          $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } 
        }
      }
    }
  ]);
  
  const categoryStats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    ...stats[0],
    categoryCounts: categoryStats
  };
};

module.exports = mongoose.model('Gallery', gallerySchema);
