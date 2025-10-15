const mongoose = require('mongoose');
const validator = require('validator');

const clientSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: [true, 'Client name is required'],
    unique: true, 
    maxlength: [100, 'Client name cannot exceed 100 characters'],
    trim: true
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true
  },
  displayName: { type: String, trim: true },
  
  // Logo and Branding
  logo: {
    filename: String,
    originalName: String,
    path: String,
    thumbnail: String,
    size: Number,
    mimetype: String,
    uploadedAt: { type: Date, default: Date.now }
  },
  
  // Contact Information
  website: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || validator.isURL(v);
      },
      message: 'Invalid website URL'
    }
  },
  primaryContact: {
    name: { 
      type: String, 
      required: [true, 'Primary contact name is required']
    },
    email: { 
      type: String, 
      required: [true, 'Primary contact email is required'],
      validate: {
        validator: validator.isEmail,
        message: 'Invalid email address'
      }
    },
    phone: { 
      type: String, 
      required: [true, 'Primary contact phone is required']
    },
    position: String,
    department: String
  },
  secondaryContact: {
    name: String,
    email: { 
      type: String,
      validate: {
        validator: function(v) {
          return !v || validator.isEmail(v);
        },
        message: 'Invalid email address'
      }
    },
    phone: String,
    position: String
  },
  
  // Company Details
  industry: { 
    type: String, 
    enum: {
      values: ['construction', 'healthcare', 'hospitality', 'manufacturing', 'government', 'aviation', 'education', 'retail', 'oil_gas', 'banking', 'technology', 'other'],
      message: '{VALUE} is not a valid industry'
    },
    required: [true, 'Industry is required']
  },
  companySize: { 
    type: String, 
    enum: {
      values: ['startup', 'small', 'medium', 'large', 'enterprise'],
      message: '{VALUE} is not a valid company size'
    },
    required: [true, 'Company size is required']
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year must be after 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  headquarters: { 
    type: String, 
    required: [true, 'Headquarters location is required']
  },
  
  // Address Information
  addresses: [{
    type: { 
      type: String, 
      enum: ['headquarters', 'branch', 'project_site'], 
      default: 'branch' 
    },
    street: String,
    city: String,  
    province: String,
    postalCode: String,
    country: { type: String, default: 'Saudi Arabia' },
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Business Relationship
  clientType: {
    type: String,
    enum: ['direct', 'subcontractor', 'partner', 'government', 'private'],
    default: 'direct'
  },
  relationshipStart: { 
    type: Date, 
    required: [true, 'Relationship start date is required']
  },
  totalProjects: { type: Number, default: 0, min: 0 },
  activeProjects: { type: Number, default: 0, min: 0 },
  
  // Financial Information  
  creditLimit: { 
    type: Number,
    min: [0, 'Credit limit cannot be negative']
  },
  totalRevenue: { 
    type: Number, 
    default: 0,
    min: [0, 'Total revenue cannot be negative']
  },
  paymentTerms: {
    type: String,
    enum: ['net_15', 'net_30', 'net_45', 'net_60', 'advance_payment', 'on_delivery'],
    default: 'net_30'
  },
  
  // Services Used
  servicesUsed: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service' 
  }],
  
  // Status and Display
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'prospect', 'former', 'blacklisted'],
    default: 'active' 
  },
  displayOrder: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  showOnWebsite: { type: Boolean, default: true },
  
  // Additional Information
  description: { 
    type: String, 
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  tags: [String],
  internalNotes: { type: String },
  
  // Social Media
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  
  // Soft delete
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
clientSchema.index({ name: 1 });
clientSchema.index({ slug: 1 });
clientSchema.index({ industry: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ isFeatured: 1 });
clientSchema.index({ createdAt: -1 });
clientSchema.index({ totalRevenue: -1 });
clientSchema.index({ 'primaryContact.email': 1 });

// Virtual for relationship duration
clientSchema.virtual('relationshipDuration').get(function() {
  if (!this.relationshipStart) return 0;
  const now = new Date();
  const start = new Date(this.relationshipStart);
  const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(years * 10) / 10; // Round to 1 decimal place
});

// Virtual for relationship duration category
clientSchema.virtual('relationshipCategory').get(function() {
  const duration = this.relationshipDuration;
  if (duration < 1) return 'new';
  if (duration < 3) return 'established';
  return 'long_term';
});

// Pre-save middleware to generate slug
clientSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Pre-save middleware to update timestamp
clientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get client statistics
clientSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { 
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
        },
        featured: { 
          $sum: { $cond: ['$isFeatured', 1, 0] } 
        },
        totalRevenue: { $sum: '$totalRevenue' },
        totalProjects: { $sum: '$totalProjects' },
        activeProjects: { $sum: '$activeProjects' }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    active: 0,
    featured: 0,
    totalRevenue: 0,
    totalProjects: 0,
    activeProjects: 0
  };
};

// Static method to get industry distribution
clientSchema.statics.getIndustryDistribution = async function() {
  return await this.aggregate([
    { $match: { isDeleted: false, status: 'active' } },
    {
      $group: {
        _id: '$industry',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalRevenue' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Method to soft delete
clientSchema.methods.softDelete = function(adminId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = adminId;
  this.status = 'inactive';
  return this.save();
};

// Method to restore
clientSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

const ClientManagement = mongoose.model('ClientManagement', clientSchema);

module.exports = ClientManagement;

