const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  // Basic job information
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
    maxlength: 5000
  },
  
  shortDescription: {
    type: String,
    maxlength: 500
  },
  
  // Job classification
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobCategory',
    required: true
  },
  
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry',
    required: true
  },
  
  // Job details
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'temporary', 'freelance'],
    default: 'full-time'
  },
  
  employmentType: {
    type: String,
    enum: ['permanent', 'contract', 'project-based', 'seasonal'],
    default: 'contract'
  },
  
  // Location information
  location: {
    city: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    isRemote: {
      type: Boolean,
      default: false
    }
  },
  
  // Salary information
  salary: {
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
    },
    isNegotiable: {
      type: Boolean,
      default: true
    },
    benefits: [String]
  },
  
  // Experience requirements
  experience: {
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
  education: {
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
  
  // Skills and requirements
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
  
  requirements: [String],
  
  responsibilities: [String],
  
  qualifications: [String],
  
  // Application information
  applicationDeadline: {
    type: Date,
    required: true
  },
  
  startDate: {
    type: Date,
    required: true
  },
  
  numberOfPositions: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  
  // Job status
  status: {
    type: String,
    enum: ['draft', 'published', 'closed', 'cancelled', 'filled'],
    default: 'draft'
  },
  
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Application statistics
  stats: {
    totalApplications: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    },
    interviewed: {
      type: Number,
      default: 0
    },
    selected: {
      type: Number,
      default: 0
    }
  },
  
  // Client information (if job is for a specific client)
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  
  // Contact information
  contact: {
    name: String,
    email: String,
    phone: String,
    department: String
  },
  
  // Multi-language support
  translations: {
    en: {
      title: String,
      description: String,
      shortDescription: String,
      requirements: [String],
      responsibilities: [String],
      qualifications: [String]
    },
    ar: {
      title: String,
      description: String,
      shortDescription: String,
      requirements: [String],
      responsibilities: [String],
      qualifications: [String]
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
jobPostingSchema.index({ title: 1 });
jobPostingSchema.index({ slug: 1 });
jobPostingSchema.index({ category: 1 });
jobPostingSchema.index({ industry: 1 });
jobPostingSchema.index({ status: 1 });
jobPostingSchema.index({ 'location.city': 1 });
jobPostingSchema.index({ 'location.region': 1 });
jobPostingSchema.index({ applicationDeadline: 1 });
jobPostingSchema.index({ startDate: 1 });
jobPostingSchema.index({ isUrgent: 1 });
jobPostingSchema.index({ isFeatured: 1 });
jobPostingSchema.index({ createdAt: -1 });

// Text index for search functionality
jobPostingSchema.index({
  title: 'text',
  description: 'text',
  requirements: 'text',
  responsibilities: 'text',
  qualifications: 'text'
});

// Pre-save middleware to generate slug
jobPostingSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Auto-close job if deadline has passed
  if (this.applicationDeadline && this.applicationDeadline < new Date()) {
    this.status = 'closed';
  }
  
  this.updatedAt = new Date();
  next();
});

// Instance methods
jobPostingSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    title: this.title,
    slug: this.slug,
    description: this.description,
    shortDescription: this.shortDescription,
    category: this.category,
    industry: this.industry,
    jobType: this.jobType,
    employmentType: this.employmentType,
    location: this.location,
    salary: this.salary,
    experience: this.experience,
    education: this.education,
    skills: this.skills,
    requirements: this.requirements,
    responsibilities: this.responsibilities,
    qualifications: this.qualifications,
    applicationDeadline: this.applicationDeadline,
    startDate: this.startDate,
    numberOfPositions: this.numberOfPositions,
    status: this.status,
    isUrgent: this.isUrgent,
    isFeatured: this.isFeatured,
    stats: this.stats,
    client: this.client,
    contact: this.contact,
    seo: this.seo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

jobPostingSchema.methods.incrementApplicationCount = function() {
  this.stats.totalApplications += 1;
  return this.save();
};

jobPostingSchema.methods.updateApplicationStats = function(status) {
  switch (status) {
    case 'shortlisted':
      this.stats.shortlisted += 1;
      break;
    case 'interviewed':
      this.stats.interviewed += 1;
      break;
    case 'selected':
      this.stats.selected += 1;
      break;
  }
  return this.save();
};

jobPostingSchema.methods.isApplicationOpen = function() {
  return this.status === 'published' && 
         this.applicationDeadline > new Date() && 
         this.stats.selected < this.numberOfPositions;
};

jobPostingSchema.methods.closeJob = function() {
  this.status = 'closed';
  return this.save();
};

// Static methods
jobPostingSchema.statics.getActiveJobs = function() {
  return this.find({ 
    status: 'published',
    applicationDeadline: { $gt: new Date() }
  }).sort({ isFeatured: -1, createdAt: -1 });
};

jobPostingSchema.statics.getFeaturedJobs = function() {
  return this.find({ 
    status: 'published',
    isFeatured: true,
    applicationDeadline: { $gt: new Date() }
  }).sort({ createdAt: -1 });
};

jobPostingSchema.statics.getJobsByCategory = function(categoryId) {
  return this.find({ 
    status: 'published',
    category: categoryId,
    applicationDeadline: { $gt: new Date() }
  }).sort({ isFeatured: -1, createdAt: -1 });
};

jobPostingSchema.statics.getJobsByIndustry = function(industryId) {
  return this.find({ 
    status: 'published',
    industry: industryId,
    applicationDeadline: { $gt: new Date() }
  }).sort({ isFeatured: -1, createdAt: -1 });
};

jobPostingSchema.statics.getJobsByLocation = function(city) {
  return this.find({ 
    status: 'published',
    'location.city': city,
    applicationDeadline: { $gt: new Date() }
  }).sort({ isFeatured: -1, createdAt: -1 });
};

jobPostingSchema.statics.getJobBySlug = function(slug) {
  return this.findOne({ status: 'published', slug });
};

jobPostingSchema.statics.searchJobs = function(query, filters = {}) {
  const searchQuery = {
    status: 'published',
    applicationDeadline: { $gt: new Date() }
  };
  
  // Add text search
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Add filters
  if (filters.category) {
    searchQuery.category = filters.category;
  }
  
  if (filters.industry) {
    searchQuery.industry = filters.industry;
  }
  
  if (filters.location) {
    searchQuery['location.city'] = filters.location;
  }
  
  if (filters.jobType) {
    searchQuery.jobType = filters.jobType;
  }
  
  if (filters.minSalary) {
    searchQuery['salary.max'] = { $gte: filters.minSalary };
  }
  
  return this.find(searchQuery).sort({ 
    isFeatured: -1,
    isUrgent: -1,
    createdAt: -1 
  });
};

jobPostingSchema.statics.getExpiringJobs = function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    status: 'published',
    applicationDeadline: { 
      $gt: new Date(),
      $lte: futureDate 
    }
  }).sort({ applicationDeadline: 1 });
};

jobPostingSchema.statics.getJobStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalApplications: { $sum: '$stats.totalApplications' },
        totalPositions: { $sum: '$numberOfPositions' }
      }
    }
  ]);
};

module.exports = mongoose.model('JobPosting', jobPostingSchema);
