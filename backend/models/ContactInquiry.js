const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
  // Basic contact information
  personalInfo: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true,
      maxlength: 200
    },
    position: {
      type: String,
      trim: true,
      maxlength: 200
    }
  },
  
  // Inquiry details
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  message: {
    type: String,
    required: true,
    maxlength: 5000
  },
  
  // Inquiry classification
  inquiryType: {
    type: String,
    enum: ['general', 'service-request', 'partnership', 'job-application', 'complaint', 'feedback'],
    default: 'general'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Service or industry interest
  interestedServices: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    description: String
  }],
  
  interestedIndustries: [{
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Industry'
    },
    description: String
  }],
  
  // Location information
  location: {
    city: String,
    region: String,
    country: {
      type: String,
      default: 'Saudi Arabia'
    }
  },
  
  // Inquiry status
  status: {
    type: String,
    enum: ['new', 'in-progress', 'responded', 'closed', 'spam'],
    default: 'new'
  },
  
  // Response tracking
  response: {
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    respondedAt: Date,
    responseMessage: String,
    responseMethod: {
      type: String,
      enum: ['email', 'phone', 'in-person', 'other'],
      default: 'email'
    }
  },
  
  // Follow-up information
  followUp: {
    isRequired: {
      type: Boolean,
      default: false
    },
    scheduledDate: Date,
    notes: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  },
  
  // Admin notes and comments
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status history
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Additional information
  additionalInfo: {
    budget: String,
    timeline: String,
    requirements: String,
    previousExperience: String,
    source: {
      type: String,
      enum: ['website', 'referral', 'social-media', 'advertisement', 'other'],
      default: 'website'
    },
    referrer: String
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
contactInquirySchema.index({ 'personalInfo.email': 1 });
contactInquirySchema.index({ 'personalInfo.phone': 1 });
contactInquirySchema.index({ status: 1 });
contactInquirySchema.index({ inquiryType: 1 });
contactInquirySchema.index({ priority: 1 });
contactInquirySchema.index({ createdAt: -1 });

// Compound index for admin queries
contactInquirySchema.index({ status: 1, priority: 1 });

// Pre-save middleware
contactInquirySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
contactInquirySchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    personalInfo: this.personalInfo,
    subject: this.subject,
    message: this.message,
    inquiryType: this.inquiryType,
    interestedServices: this.interestedServices,
    interestedIndustries: this.interestedIndustries,
    location: this.location,
    status: this.status,
    createdAt: this.createdAt
  };
};

contactInquirySchema.methods.toAdminJSON = function() {
  return {
    id: this._id,
    personalInfo: this.personalInfo,
    subject: this.subject,
    message: this.message,
    inquiryType: this.inquiryType,
    priority: this.priority,
    interestedServices: this.interestedServices,
    interestedIndustries: this.interestedIndustries,
    location: this.location,
    status: this.status,
    response: this.response,
    followUp: this.followUp,
    adminNotes: this.adminNotes,
    statusHistory: this.statusHistory,
    additionalInfo: this.additionalInfo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

contactInquirySchema.methods.updateStatus = function(newStatus, adminUser, notes = '') {
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    changedBy: adminUser,
    changedAt: new Date(),
    notes
  });
  
  // Update current status
  this.status = newStatus;
  
  return this.save();
};

contactInquirySchema.methods.addResponse = function(responseData, adminUser) {
  this.response = {
    ...responseData,
    respondedBy: adminUser,
    respondedAt: new Date()
  };
  
  this.updateStatus('responded', adminUser, 'Response sent');
  
  return this.save();
};

contactInquirySchema.methods.addAdminNote = function(note, adminUser) {
  this.adminNotes.push({
    note,
    addedBy: adminUser,
    addedAt: new Date()
  });
  
  return this.save();
};

contactInquirySchema.methods.scheduleFollowUp = function(followUpData, adminUser) {
  this.followUp = {
    ...this.followUp,
    ...followUpData,
    isRequired: true
  };
  
  return this.save();
};

contactInquirySchema.methods.completeFollowUp = function(adminUser) {
  this.followUp.completed = true;
  this.followUp.completedAt = new Date();
  
  return this.save();
};

// Static methods
contactInquirySchema.statics.getInquiriesByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

contactInquirySchema.statics.getInquiriesByType = function(inquiryType) {
  return this.find({ inquiryType }).sort({ createdAt: -1 });
};

contactInquirySchema.statics.getInquiriesByPriority = function(priority) {
  return this.find({ priority }).sort({ createdAt: -1 });
};

contactInquirySchema.statics.getRecentInquiries = function(limit = 10) {
  return this.find({}).sort({ createdAt: -1 }).limit(limit);
};

contactInquirySchema.statics.getPendingInquiries = function() {
  return this.find({ 
    status: { $in: ['new', 'in-progress'] } 
  }).sort({ priority: -1, createdAt: -1 });
};

contactInquirySchema.statics.getInquiriesByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ createdAt: -1 });
};

contactInquirySchema.statics.getInquiryStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

contactInquirySchema.statics.getInquiriesByEmail = function(email) {
  return this.find({ 'personalInfo.email': email }).sort({ createdAt: -1 });
};

contactInquirySchema.statics.searchInquiries = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { 'personalInfo.name': searchRegex },
      { 'personalInfo.email': searchRegex },
      { 'personalInfo.phone': searchRegex },
      { 'personalInfo.company': searchRegex },
      { subject: searchRegex },
      { message: searchRegex }
    ]
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);
