const mongoose = require('mongoose');

const jobCategorySchema = new mongoose.Schema({
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
  
  // Category classification
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobCategory'
  },
  
  // Category details
  requirements: [{
    title: String,
    description: String,
    isMandatory: {
      type: Boolean,
      default: false
    }
  }],
  
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  }],
  
  // Salary information
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'SAR'
    },
    period: {
      type: String,
      enum: ['hourly', 'daily', 'monthly', 'yearly'],
      default: 'monthly'
    }
  },
  
  // Experience requirements
  experienceRequired: {
    min: {
      type: Number,
      default: 0
    },
    max: Number,
    unit: {
      type: String,
      enum: ['months', 'years'],
      default: 'years'
    }
  },
  
  // Education requirements
  educationRequired: {
    level: {
      type: String,
      enum: ['none', 'high-school', 'diploma', 'bachelor', 'master', 'phd'],
      default: 'high-school'
    },
    field: String,
    isMandatory: {
      type: Boolean,
      default: false
    }
  },
  
  // Industry association
  industries: [{
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Industry'
    },
    description: String
  }],
  
  // Category statistics
  stats: {
    activeJobs: {
      type: Number,
      default: 0
    },
    totalApplications: {
      type: Number,
      default: 0
    },
    averageSalary: Number,
    employmentRate: {
      type: Number,
      min: 0,
      max: 100,
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
jobCategorySchema.index({ name: 1 });
jobCategorySchema.index({ slug: 1 });
jobCategorySchema.index({ parentCategory: 1 });
jobCategorySchema.index({ status: 1 });
jobCategorySchema.index({ isFeatured: 1 });
jobCategorySchema.index({ sortOrder: 1 });
jobCategorySchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug
jobCategorySchema.pre('save', function(next) {
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
jobCategorySchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    slug: this.slug,
    description: this.description,
    shortDescription: this.shortDescription,
    parentCategory: this.parentCategory,
    requirements: this.requirements,
    skills: this.skills,
    salaryRange: this.salaryRange,
    experienceRequired: this.experienceRequired,
    educationRequired: this.educationRequired,
    industries: this.industries,
    stats: this.stats,
    icon: this.icon,
    image: this.image,
    seo: this.seo,
    isFeatured: this.isFeatured,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

jobCategorySchema.methods.addSkill = function(skill) {
  this.skills.push(skill);
  return this.save();
};

jobCategorySchema.methods.removeSkill = function(skillName) {
  this.skills = this.skills.filter(skill => skill.name !== skillName);
  return this.save();
};

jobCategorySchema.methods.addRequirement = function(requirement) {
  this.requirements.push(requirement);
  return this.save();
};

jobCategorySchema.methods.updateStats = function(stats) {
  this.stats = { ...this.stats, ...stats };
  return this.save();
};

// Static methods
jobCategorySchema.statics.getActiveCategories = function() {
  return this.find({ status: 'active' }).sort({ sortOrder: 1, createdAt: -1 });
};

jobCategorySchema.statics.getFeaturedCategories = function() {
  return this.find({ status: 'active', isFeatured: true }).sort({ sortOrder: 1 });
};

jobCategorySchema.statics.getParentCategories = function() {
  return this.find({ 
    status: 'active',
    parentCategory: { $exists: false }
  }).sort({ sortOrder: 1 });
};

jobCategorySchema.statics.getSubCategories = function(parentId) {
  return this.find({ 
    status: 'active',
    parentCategory: parentId 
  }).sort({ sortOrder: 1 });
};

jobCategorySchema.statics.getCategoryBySlug = function(slug) {
  return this.findOne({ status: 'active', slug });
};

jobCategorySchema.statics.searchCategories = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    status: 'active',
    $or: [
      { name: searchRegex },
      { description: searchRegex }
    ]
  }).sort({ sortOrder: 1 });
};

jobCategorySchema.statics.getCategoriesByIndustry = function(industryId) {
  return this.find({
    status: 'active',
    'industries.industry': industryId
  }).sort({ sortOrder: 1 });
};

jobCategorySchema.statics.getCategoryStats = function() {
  return this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: null,
        totalCategories: { $sum: 1 },
        totalActiveJobs: { $sum: '$stats.activeJobs' },
        totalApplications: { $sum: '$stats.totalApplications' },
        averageEmploymentRate: { $avg: '$stats.employmentRate' }
      }
    }
  ]);
};

module.exports = mongoose.model('JobCategory', jobCategorySchema);
