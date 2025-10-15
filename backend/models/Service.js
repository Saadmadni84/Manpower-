const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  // Basic service information
  title: {
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
    required: true,
    maxlength: 2000
  },
  
  shortDescription: {
    type: String,
    maxlength: 500
  },
  
  // Service details
  features: [{
    title: String,
    description: String,
    icon: String
  }],
  
  benefits: [String],
  
  requirements: [String],
  
  // Service category and classification
  category: {
    type: String,
    required: true,
    trim: true
  },
  
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry',
    required: true
  },
  
  tags: [String],
  
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
  
  gallery: [{
    url: String,
    publicId: String,
    alt: String,
    caption: String
  }],
  
  // Service specifications
  serviceType: {
    type: String,
    enum: ['temporary', 'permanent', 'contract', 'project-based'],
    default: 'contract'
  },
  
  duration: {
    type: String,
    enum: ['short-term', 'long-term', 'flexible'],
    default: 'flexible'
  },
  
  location: {
    type: String,
    default: 'All locations'
  },
  
  // Pricing information (optional)
  pricing: {
    startingFrom: Number,
    currency: {
      type: String,
      default: 'SAR'
    },
    pricingModel: {
      type: String,
      enum: ['hourly', 'daily', 'monthly', 'project-based'],
      default: 'monthly'
    }
  },
  
  // Service statistics
  stats: {
    employeesDeployed: {
      type: Number,
      default: 0
    },
    activeContracts: {
      type: Number,
      default: 0
    },
    clientSatisfaction: {
      type: Number,
      min: 0,
      max: 100,
      default: 95
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 98
    }
  },
  
  // Multi-language support
  translations: {
    en: {
      title: String,
      description: String,
      shortDescription: String,
      features: [{
        title: String,
        description: String,
        icon: String
      }],
      benefits: [String],
      requirements: [String]
    },
    ar: {
      title: String,
      description: String,
      shortDescription: String,
      features: [{
        title: String,
        description: String,
        icon: String
      }],
      benefits: [String],
      requirements: [String]
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
serviceSchema.index({ title: 1 });
serviceSchema.index({ slug: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ industry: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ sortOrder: 1 });
serviceSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug
serviceSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = new Date();
  next();
});

// Instance methods
serviceSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    title: this.title,
    slug: this.slug,
    description: this.description,
    shortDescription: this.shortDescription,
    features: this.features,
    benefits: this.benefits,
    requirements: this.requirements,
    category: this.category,
    industry: this.industry,
    tags: this.tags,
    icon: this.icon,
    image: this.image,
    gallery: this.gallery,
    serviceType: this.serviceType,
    duration: this.duration,
    location: this.location,
    pricing: this.pricing,
    stats: this.stats,
    seo: this.seo,
    isFeatured: this.isFeatured,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
serviceSchema.statics.getActiveServices = function() {
  return this.find({ status: 'active' }).sort({ sortOrder: 1, createdAt: -1 });
};

serviceSchema.statics.getFeaturedServices = function() {
  return this.find({ status: 'active', isFeatured: true }).sort({ sortOrder: 1 });
};

serviceSchema.statics.getServicesByCategory = function(category) {
  return this.find({ status: 'active', category }).sort({ sortOrder: 1 });
};

serviceSchema.statics.getServicesByIndustry = function(industryId) {
  return this.find({ status: 'active', industry: industryId }).sort({ sortOrder: 1 });
};

serviceSchema.statics.getServiceBySlug = function(slug) {
  return this.findOne({ status: 'active', slug });
};

serviceSchema.statics.searchServices = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    status: 'active',
    $or: [
      { title: searchRegex },
      { description: searchRegex },
      { tags: { $in: [searchRegex] } }
    ]
  }).sort({ sortOrder: 1 });
};

module.exports = mongoose.model('Service', serviceSchema);
