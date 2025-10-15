const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  displayName: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    enum: ['Oil & Gas', 'Construction', 'Tourism', 'Heritage', 'Entertainment', 'Government', 'Healthcare', 'Education', 'Technology', 'Manufacturing', 'Aviation', 'Banking', 'Hospitality', 'Retail', 'Other'],
    required: true
  },
  // Contact Information
  primaryContact: {
    name: String,
    email: String,
    phone: String,
    position: String
  },
  secondaryContact: {
    name: String,
    email: String,
    phone: String,
    position: String
  },
  // Company Details
  companySize: {
    type: String,
    enum: ['Startup', 'Small', 'Medium', 'Large', 'Enterprise'],
    default: 'Medium'
  },
  foundedYear: Number,
  headquarters: String,
  // Business Relationship
  contract_start: {
    type: Date
  },
  contract_end: {
    type: Date
  },
  totalProjects: {
    type: Number,
    default: 0
  },
  activeProjects: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  // Display Settings
  is_active: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  showOnWebsite: {
    type: Boolean,
    default: true
  },
  display_order: {
    type: Number,
    default: 0
  },
  // Additional Info
  description: {
    type: String,
    maxlength: 1000
  },
  tags: [String],
  // Timestamps
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
clientSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Index for efficient queries
clientSchema.index({ is_active: 1, display_order: 1 });
clientSchema.index({ name: 1 });
clientSchema.index({ industry: 1 });

// Static method to get statistics
clientSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { 
          $sum: { $cond: [{ $eq: ['$is_active', true] }, 1, 0] } 
        },
        featured: { 
          $sum: { $cond: ['$isFeatured', 1, 0] } 
        },
        totalRevenue: { $sum: '$totalRevenue' },
        totalProjects: { $sum: '$totalProjects' }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    active: 0,
    featured: 0,
    totalRevenue: 0,
    totalProjects: 0
  };
};

module.exports = mongoose.model('AdminClient', clientSchema);
