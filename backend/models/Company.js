const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Basic company information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
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
  
  // Company statistics
  establishedYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },
  
  totalEmployees: {
    type: Number,
    required: true,
    min: 0
  },
  
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Contact information
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  address: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Additional contact details
  website: {
    type: String,
    trim: true
  },
  
  // Social media links
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String
  },
  
  // Company logo and branding
  logo: {
    url: String,
    publicId: String,
    alt: String
  },
  
  // Company mission and vision
  mission: {
    type: String,
    maxlength: 1000
  },
  
  vision: {
    type: String,
    maxlength: 1000
  },
  
  values: [{
    title: String,
    description: String
  }],
  
  // Company achievements and highlights
  achievements: [{
    title: String,
    description: String,
    year: Number,
    image: {
      url: String,
      publicId: String
    }
  }],
  
  // Certifications and awards
  certifications: [{
    name: String,
    issuingBody: String,
    date: Date,
    expiryDate: Date,
    certificateUrl: String
  }],
  
  // Multi-language support
  translations: {
    en: {
      name: String,
      description: String,
      shortDescription: String,
      mission: String,
      vision: String,
      values: [{
        title: String,
        description: String
      }]
    },
    ar: {
      name: String,
      description: String,
      shortDescription: String,
      mission: String,
      vision: String,
      values: [{
        title: String,
        description: String
      }]
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
companySchema.index({ name: 1 });
companySchema.index({ status: 1 });
companySchema.index({ createdAt: -1 });

// Virtual for calculating years of experience
companySchema.virtual('calculatedYearsOfExperience').get(function() {
  return new Date().getFullYear() - this.establishedYear;
});

// Pre-save middleware to update years of experience
companySchema.pre('save', function(next) {
  if (this.isModified('establishedYear') || this.isNew) {
    this.yearsOfExperience = this.calculatedYearsOfExperience;
  }
  this.updatedAt = new Date();
  next();
});

// Instance methods
companySchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    shortDescription: this.shortDescription,
    establishedYear: this.establishedYear,
    totalEmployees: this.totalEmployees,
    yearsOfExperience: this.yearsOfExperience,
    email: this.email,
    phone: this.phone,
    address: this.address,
    website: this.website,
    socialMedia: this.socialMedia,
    logo: this.logo,
    mission: this.mission,
    vision: this.vision,
    values: this.values,
    achievements: this.achievements,
    certifications: this.certifications,
    seo: this.seo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
companySchema.statics.getActiveCompany = function() {
  return this.findOne({ status: 'active' });
};

companySchema.statics.getCompanyForSEO = function() {
  return this.findOne({ status: 'active' })
    .select('name description logo seo socialMedia')
    .lean();
};

module.exports = mongoose.model('Company', companySchema);
