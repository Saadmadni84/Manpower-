const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  // Basic contract information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  description: {
    type: String,
    maxlength: 2000
  },
  
  shortDescription: {
    type: String,
    maxlength: 500
  },
  
  // Contract details
  contractNumber: {
    type: String,
    unique: true,
    trim: true
  },
  
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  
  // Contract value and terms
  value: {
    type: Number,
    required: true,
    min: 0
  },
  
  currency: {
    type: String,
    default: 'SAR'
  },
  
  duration: {
    type: String,
    required: true
  },
  
  // Contract timeline
  timeline: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    signedDate: Date,
    renewalDate: Date
  },
  
  // Contract status
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'completed', 'terminated', 'suspended'],
    default: 'draft'
  },
  
  contractType: {
    type: String,
    enum: ['new', 'renewal', 'extension', 'expansion'],
    default: 'new'
  },
  
  // Location and scope
  location: {
    city: String,
    region: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  scope: {
    description: String,
    deliverables: [String],
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'delayed'],
        default: 'pending'
      }
    }]
  },
  
  // Employee deployment
  employeesDeployed: {
    type: Number,
    default: 0,
    min: 0
  },
  
  employeeRequirements: {
    total: Number,
    categories: [{
      category: String,
      count: Number,
      skills: [String]
    }]
  },
  
  // Performance metrics
  performance: {
    clientSatisfaction: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 95
    },
    onTimeDelivery: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    }
  },
  
  // Financial information
  financials: {
    totalValue: Number,
    paidAmount: {
      type: Number,
      default: 0
    },
    pendingAmount: {
      type: Number,
      default: 0
    },
    paymentTerms: String,
    paymentSchedule: [{
      amount: Number,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
      }
    }]
  },
  
  // Contract documents
  documents: [{
    name: String,
    url: String,
    publicId: String,
    type: {
      type: String,
      enum: ['contract', 'amendment', 'certificate', 'report', 'other']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Visual elements
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
  
  // Achievements and highlights
  achievements: [{
    title: String,
    description: String,
    date: Date,
    image: {
      url: String,
      publicId: String
    }
  }],
  
  // Multi-language support
  translations: {
    en: {
      title: String,
      description: String,
      shortDescription: String
    },
    ar: {
      title: String,
      description: String,
      shortDescription: String
    }
  },
  
  // Status and settings
  isActive: {
    type: Boolean,
    default: true
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
contractSchema.index({ title: 1 });
contractSchema.index({ contractNumber: 1 });
contractSchema.index({ client: 1 });
contractSchema.index({ service: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ contractType: 1 });
contractSchema.index({ 'timeline.startDate': 1 });
contractSchema.index({ 'timeline.endDate': 1 });
contractSchema.index({ isActive: 1 });
contractSchema.index({ isFeatured: 1 });
contractSchema.index({ sortOrder: 1 });
contractSchema.index({ createdAt: -1 });

// Virtual for contract duration in days
contractSchema.virtual('durationInDays').get(function() {
  if (this.timeline.startDate && this.timeline.endDate) {
    return Math.ceil((this.timeline.endDate - this.timeline.startDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for days remaining
contractSchema.virtual('daysRemaining').get(function() {
  if (this.timeline.endDate && this.status === 'active') {
    const now = new Date();
    const remaining = Math.ceil((this.timeline.endDate - now) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  }
  return 0;
});

// Virtual for completion percentage
contractSchema.virtual('completionPercentage').get(function() {
  if (this.timeline.startDate && this.timeline.endDate) {
    const now = new Date();
    const total = this.timeline.endDate - this.timeline.startDate;
    const elapsed = now - this.timeline.startDate;
    const percentage = (elapsed / total) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }
  return 0;
});

// Pre-save middleware
contractSchema.pre('save', function(next) {
  // Generate contract number if not provided
  if (!this.contractNumber && this.isNew) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.contractNumber = `CNT-${year}-${random}`;
  }
  
  // Calculate pending amount
  if (this.financials) {
    this.financials.pendingAmount = this.financials.totalValue - (this.financials.paidAmount || 0);
  }
  
  this.updatedAt = new Date();
  next();
});

// Instance methods
contractSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    shortDescription: this.shortDescription,
    client: this.client,
    service: this.service,
    value: this.value,
    currency: this.currency,
    duration: this.duration,
    timeline: this.timeline,
    status: this.status,
    contractType: this.contractType,
    location: this.location,
    employeesDeployed: this.employeesDeployed,
    performance: this.performance,
    image: this.image,
    gallery: this.gallery,
    achievements: this.achievements,
    isFeatured: this.isFeatured,
    createdAt: this.createdAt
  };
};

contractSchema.methods.updatePerformance = function(metrics) {
  this.performance = { ...this.performance, ...metrics };
  return this.save();
};

contractSchema.methods.addAchievement = function(achievement) {
  this.achievements.push({
    ...achievement,
    date: achievement.date || new Date()
  });
  return this.save();
};

contractSchema.methods.updateMilestone = function(milestoneId, updates) {
  const milestone = this.scope.milestones.id(milestoneId);
  if (milestone) {
    Object.assign(milestone, updates);
    return this.save();
  }
  throw new Error('Milestone not found');
};

// Static methods
contractSchema.statics.getActiveContracts = function() {
  return this.find({ isActive: true, status: 'active' }).sort({ sortOrder: 1, createdAt: -1 });
};

contractSchema.statics.getFeaturedContracts = function() {
  return this.find({ isActive: true, isFeatured: true }).sort({ sortOrder: 1 });
};

contractSchema.statics.getContractsByClient = function(clientId) {
  return this.find({ client: clientId }).sort({ 'timeline.startDate': -1 });
};

contractSchema.statics.getContractsByService = function(serviceId) {
  return this.find({ service: serviceId }).sort({ 'timeline.startDate': -1 });
};

contractSchema.statics.getContractsByStatus = function(status) {
  return this.find({ status }).sort({ 'timeline.startDate': -1 });
};

contractSchema.statics.getExpiringContracts = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    status: 'active',
    'timeline.endDate': { $lte: futureDate }
  }).sort({ 'timeline.endDate': 1 });
};

contractSchema.statics.getContractStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
        totalEmployees: { $sum: '$employeesDeployed' }
      }
    }
  ]);
};

module.exports = mongoose.model('Contract', contractSchema);
