const mongoose = require('mongoose');

const contactEnquirySchema = new mongoose.Schema({
  // Personal Information
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
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
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
    },
    nationality: {
      type: String,
      trim: true
    }
  },
  
  // Inquiry Details
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
  
  // Service Interest
  serviceType: {
    type: String,
    enum: [
      'Airport Operations', 
      'Corporate Offices', 
      'Catering Services', 
      'Logistics & Warehousing', 
      'Construction & Engineering', 
      'Facility Management',
      'General Inquiry',
      'Partnership',
      'Job Application',
      'Complaint',
      'Feedback'
    ],
    default: 'General Inquiry'
  },
  
  // Inquiry Classification
  inquiryType: {
    type: String,
    enum: ['general', 'service-request', 'partnership', 'job-application', 'complaint', 'feedback', 'quote-request'],
    default: 'general'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Location Information
  location: {
    city: String,
    region: String,
    country: {
      type: String,
      default: 'Saudi Arabia'
    }
  },
  
  // Project Details (if applicable)
  projectDetails: {
    budget: String,
    timeline: String,
    requirements: String,
    previousExperience: String,
    preferredStartDate: Date
  },
  
  // Status Management
  status: {
    type: String,
    enum: ['new', 'read', 'in-progress', 'responded', 'closed', 'spam'],
    default: 'new'
  },
  
  // Response Tracking
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
    },
    responseNotes: String
  },
  
  // Follow-up Information
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
    completedAt: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    }
  },
  
  // Admin Management
  adminNotes: [{
    note: {
      type: String,
      required: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  
  // Status History
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
  
  // Additional Information
  additionalInfo: {
    source: {
      type: String,
      enum: ['website', 'referral', 'social-media', 'advertisement', 'phone', 'email', 'other'],
      default: 'website'
    },
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    pageUrl: String,
    userAgent: String,
    ipAddress: String
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
contactEnquirySchema.index({ 'personalInfo.email': 1 });
contactEnquirySchema.index({ 'personalInfo.phone': 1 });
contactEnquirySchema.index({ status: 1 });
contactEnquirySchema.index({ serviceType: 1 });
contactEnquirySchema.index({ inquiryType: 1 });
contactEnquirySchema.index({ priority: 1 });
contactEnquirySchema.index({ createdAt: -1 });
contactEnquirySchema.index({ 'location.city': 1 });
contactEnquirySchema.index({ 'location.region': 1 });

// Compound indexes for admin queries
contactEnquirySchema.index({ status: 1, priority: 1 });
contactEnquirySchema.index({ status: 1, serviceType: 1 });
contactEnquirySchema.index({ createdAt: -1, status: 1 });

// Update timestamp on save
contactEnquirySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
contactEnquirySchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    personalInfo: this.personalInfo,
    subject: this.subject,
    message: this.message,
    serviceType: this.serviceType,
    inquiryType: this.inquiryType,
    location: this.location,
    status: this.status,
    createdAt: this.createdAt
  };
};

contactEnquirySchema.methods.toAdminJSON = function() {
  return {
    id: this._id,
    personalInfo: this.personalInfo,
    subject: this.subject,
    message: this.message,
    serviceType: this.serviceType,
    inquiryType: this.inquiryType,
    priority: this.priority,
    location: this.location,
    projectDetails: this.projectDetails,
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

contactEnquirySchema.methods.updateStatus = function(newStatus, adminUser, notes = '') {
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

contactEnquirySchema.methods.addResponse = function(responseData, adminUser) {
  this.response = {
    ...responseData,
    respondedBy: adminUser,
    respondedAt: new Date()
  };
  
  this.updateStatus('responded', adminUser, 'Response sent');
  
  return this.save();
};

contactEnquirySchema.methods.addAdminNote = function(note, adminUser, isInternal = false) {
  this.adminNotes.push({
    note,
    addedBy: adminUser,
    addedAt: new Date(),
    isInternal
  });
  
  return this.save();
};

contactEnquirySchema.methods.scheduleFollowUp = function(followUpData, adminUser) {
  this.followUp = {
    ...this.followUp,
    ...followUpData,
    isRequired: true
  };
  
  return this.save();
};

contactEnquirySchema.methods.completeFollowUp = function(adminUser) {
  this.followUp.completed = true;
  this.followUp.completedAt = new Date();
  
  return this.save();
};

// Static methods
contactEnquirySchema.statics.getEnquiriesByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

contactEnquirySchema.statics.getEnquiriesByServiceType = function(serviceType) {
  return this.find({ serviceType }).sort({ createdAt: -1 });
};

contactEnquirySchema.statics.getEnquiriesByPriority = function(priority) {
  return this.find({ priority }).sort({ createdAt: -1 });
};

contactEnquirySchema.statics.getRecentEnquiries = function(limit = 10) {
  return this.find({}).sort({ createdAt: -1 }).limit(limit);
};

contactEnquirySchema.statics.getPendingEnquiries = function() {
  return this.find({ 
    status: { $in: ['new', 'read', 'in-progress'] } 
  }).sort({ priority: -1, createdAt: -1 });
};

contactEnquirySchema.statics.getEnquiriesByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ createdAt: -1 });
};

contactEnquirySchema.statics.getEnquiryStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

contactEnquirySchema.statics.getEnquiriesByEmail = function(email) {
  return this.find({ 'personalInfo.email': email }).sort({ createdAt: -1 });
};

contactEnquirySchema.statics.searchEnquiries = function(query) {
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

module.exports = mongoose.model('ContactEnquiry', contactEnquirySchema);
