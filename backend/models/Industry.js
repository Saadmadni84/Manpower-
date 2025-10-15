const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  // Basic industry information
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
  
  // Industry classification
  category: {
    type: String,
    required: true,
    trim: true
  },
  
  parentIndustry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry'
  },
  
  // Industry details
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    description: String
  }],
  
  requirements: [{
    title: String,
    description: String,
    isMandatory: {
      type: Boolean,
      default: false
    }
  }],
  
  // Industry statistics
  stats: {
    activeContracts: {
      type: Number,
      default: 0
    },
    employeesDeployed: {
      type: Number,
      default: 0
    },
    clientsServed: {
      type: Number,
      default: 0
    },
    yearsOfExperience: {
      type: Number,
      default: 0
    }
  },
  
  // Visual elements
  icon: {
    url: String,
    publicId: String,
    alt: String
  },
  
  image: {
    url: String,
    publicId: String,
    alt: String
  },
  
  // Industry highlights and achievements
  highlights: [{
    title: String,
    description: String,
    year: Number,
    image: {
      url: String,
      publicId: String
    }
  }],
  
  // Certifications and compliance
  certifications: [{
    name: String,
    description: String,
    issuingBody: String,
    validityPeriod: String,
    isRequired: {
      type: Boolean,
      default: false
    }
  }],
  
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
  
  // SEO and meta information
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    ogTitle: String,
    ogDescription: String,
    ogImage: String
  },
  
  // Status and settings
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  
  isFeatured: {
    type: Boolean,
    default: false
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
industrySchema.index({ name: 1 });
industrySchema.index({ slug: 1 });
industrySchema.index({ category: 1 });
industrySchema.index({ parentIndustry: 1 });
industrySchema.index({ status: 1 });
industrySchema.index({ isFeatured: 1 });
industrySchema.index({ sortOrder: 1 });
industrySchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug
industrySchema.pre('save', function(next) {
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
industrySchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    slug: this.slug,
    description: this.description,
    shortDescription: this.shortDescription,
    category: this.category,
    parentIndustry: this.parentIndustry,
    services: this.services,
    requirements: this.requirements,
    stats: this.stats,
    icon: this.icon,
    image: this.image,
    highlights: this.highlights,
    certifications: this.certifications,
    seo: this.seo,
    isFeatured: this.isFeatured,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

industrySchema.methods.addService = function(serviceId, description) {
  this.services.push({
    service: serviceId,
    description
  });
  return this.save();
};

industrySchema.methods.removeService = function(serviceId) {
  this.services = this.services.filter(service => 
    service.service.toString() !== serviceId.toString()
  );
  return this.save();
};

industrySchema.methods.addHighlight = function(highlight) {
  this.highlights.push({
    ...highlight,
    year: highlight.year || new Date().getFullYear()
  });
  return this.save();
};

industrySchema.methods.updateStats = function(stats) {
  this.stats = { ...this.stats, ...stats };
  return this.save();
};

// Static methods
industrySchema.statics.getActiveIndustries = function() {
  return this.find({ status: 'active' }).sort({ sortOrder: 1, createdAt: -1 });
};

industrySchema.statics.getFeaturedIndustries = function() {
  return this.find({ status: 'active', isFeatured: true }).sort({ sortOrder: 1 });
};

industrySchema.statics.getIndustriesByCategory = function(category) {
  return this.find({ status: 'active', category }).sort({ sortOrder: 1 });
};

industrySchema.statics.getIndustryBySlug = function(slug) {
  return this.findOne({ status: 'active', slug });
};

industrySchema.statics.getParentIndustries = function() {
  return this.find({ 
    status: 'active',
    parentIndustry: { $exists: false }
  }).sort({ sortOrder: 1 });
};

industrySchema.statics.getSubIndustries = function(parentId) {
  return this.find({ 
    status: 'active',
    parentIndustry: parentId 
  }).sort({ sortOrder: 1 });
};

industrySchema.statics.searchIndustries = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    status: 'active',
    $or: [
      { name: searchRegex },
      { description: searchRegex },
      { category: searchRegex }
    ]
  }).sort({ sortOrder: 1 });
};

industrySchema.statics.getIndustryStats = function() {
  return this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: null,
        totalIndustries: { $sum: 1 },
        totalActiveContracts: { $sum: '$stats.activeContracts' },
        totalEmployeesDeployed: { $sum: '$stats.employeesDeployed' },
        totalClientsServed: { $sum: '$stats.clientsServed' }
      }
    }
  ]);
};

module.exports = mongoose.model('Industry', industrySchema);
