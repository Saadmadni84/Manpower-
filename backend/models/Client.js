const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // Basic client information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  description: {
    type: String,
    maxlength: 1000
  },
  
  // Client contact information
  contactPerson: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    trim: true
  },
  
  website: {
    type: String,
    trim: true
  },
  
  // Client classification
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry'
  },
  
  clientType: {
    type: String,
    enum: ['corporate', 'government', 'private', 'international'],
    default: 'corporate'
  },
  
  // Client logo and branding
  logo: {
    url: String,
    publicId: String,
    alt: String
  },
  
  // Client location
  location: {
    city: String,
    region: String,
    country: {
      type: String,
      default: 'Saudi Arabia'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Service relationship
  servicesProvided: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'suspended'],
      default: 'active'
    },
    employeesDeployed: {
      type: Number,
      default: 0
    }
  }],
  
  // Contract information
  contractValue: {
    type: Number,
    min: 0
  },
  
  contractCurrency: {
    type: String,
    default: 'SAR'
  },
  
  contractDuration: {
    startDate: Date,
    endDate: Date,
    renewalDate: Date
  },
  
  // Client relationship status
  relationshipStatus: {
    type: String,
    enum: ['prospect', 'active', 'inactive', 'former'],
    default: 'active'
  },
  
  // Client satisfaction and rating
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    feedback: String,
    lastReviewDate: Date
  },
  
  // Testimonials and reviews
  testimonials: [{
    content: String,
    author: String,
    position: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    date: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  
  // Multi-language support
  translations: {
    en: {
      name: String,
      description: String
    },
    ar: {
      name: String,
      description: String
    }
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
clientSchema.index({ name: 1 });
clientSchema.index({ industry: 1 });
clientSchema.index({ clientType: 1 });
clientSchema.index({ relationshipStatus: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ isFeatured: 1 });
clientSchema.index({ sortOrder: 1 });
clientSchema.index({ createdAt: -1 });

// Virtual for total employees deployed
clientSchema.virtual('totalEmployeesDeployed').get(function() {
  return this.servicesProvided.reduce((total, service) => {
    return total + (service.employeesDeployed || 0);
  }, 0);
});

// Virtual for active contracts count
clientSchema.virtual('activeContractsCount').get(function() {
  return this.servicesProvided.filter(service => service.status === 'active').length;
});

// Pre-save middleware
clientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
clientSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    industry: this.industry,
    clientType: this.clientType,
    logo: this.logo,
    location: this.location,
    servicesProvided: this.servicesProvided.map(service => ({
      service: service.service,
      startDate: service.startDate,
      endDate: service.endDate,
      status: service.status,
      employeesDeployed: service.employeesDeployed
    })),
    satisfaction: this.satisfaction,
    testimonials: this.testimonials.filter(testimonial => testimonial.isApproved),
    isFeatured: this.isFeatured,
    createdAt: this.createdAt
  };
};

clientSchema.methods.addTestimonial = function(testimonialData) {
  this.testimonials.push({
    ...testimonialData,
    date: new Date(),
    isApproved: false
  });
  return this.save();
};

clientSchema.methods.approveTestimonial = function(testimonialId) {
  const testimonial = this.testimonials.id(testimonialId);
  if (testimonial) {
    testimonial.isApproved = true;
    return this.save();
  }
  throw new Error('Testimonial not found');
};

// Static methods
clientSchema.statics.getActiveClients = function() {
  return this.find({ status: 'active' }).sort({ sortOrder: 1, createdAt: -1 });
};

clientSchema.statics.getFeaturedClients = function() {
  return this.find({ status: 'active', isFeatured: true }).sort({ sortOrder: 1 });
};

clientSchema.statics.getClientsByIndustry = function(industryId) {
  return this.find({ status: 'active', industry: industryId }).sort({ sortOrder: 1 });
};

clientSchema.statics.getClientsByType = function(clientType) {
  return this.find({ status: 'active', clientType }).sort({ sortOrder: 1 });
};

clientSchema.statics.getActiveClientsWithServices = function() {
  return this.find({ 
    status: 'active',
    'servicesProvided.status': 'active'
  }).populate('servicesProvided.service').sort({ sortOrder: 1 });
};

clientSchema.statics.getClientStats = function() {
  return this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: null,
        totalClients: { $sum: 1 },
        totalEmployeesDeployed: { $sum: '$totalEmployeesDeployed' },
        averageSatisfaction: { $avg: '$satisfaction.rating' },
        activeContracts: { $sum: '$activeContractsCount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Client', clientSchema);
