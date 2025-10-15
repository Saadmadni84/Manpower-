const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  // Application Reference
  applicationId: { type: String, unique: true }, // Auto-generated: APP-YYYY-XXXX
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobOpening', required: true },
  
  // Personal Information
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: String,
    dateOfBirth: Date,
    nationality: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'] }
  },
  
  // Address Information
  address: {
    current: {
      street: String,
      city: { type: String, required: true },
      region: String,
      postalCode: String,
      country: { type: String, default: 'Saudi Arabia' }
    },
    permanent: {
      street: String,
      city: String,
      region: String,
      postalCode: String,
      country: String,
      sameAsCurrent: { type: Boolean, default: true }
    }
  },
  
  // Professional Information
  professional: {
    currentJobTitle: String,
    currentEmployer: String,
    currentSalary: Number,
    expectedSalary: { type: Number, required: true },
    totalExperience: { type: Number, required: true }, // in years
    relevantExperience: Number,
    noticePeriod: { 
      type: String, 
      enum: ['immediate', '1_week', '2_weeks', '1_month', '2_months', '3_months'],
      required: true 
    },
    willingToRelocate: { type: Boolean, default: false }
  },
  
  // Education History
  education: [{
    level: { 
      type: String, 
      enum: ['high_school', 'diploma', 'bachelor', 'master', 'phd', 'professional_cert'],
      required: true 
    },
    field: String,
    institution: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    grade: String,
    location: String
  }],
  
  // Work Experience
  experience: [{
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date, // null if current job
    isCurrent: { type: Boolean, default: false },
    responsibilities: [String],
    achievements: [String],
    salary: Number,
    reasonForLeaving: String
  }],
  
  // Skills and Certifications
  skills: {
    technical: [String],
    soft: [String],
    languages: [{
      language: String,
      proficiency: { type: String, enum: ['basic', 'intermediate', 'advanced', 'native'] }
    }]
  },
  certifications: [{
    name: { type: String, required: true },
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String
  }],
  
  // Application Files
  files: {
    cv: { 
      filename: { type: String, required: true },
      originalName: String,
      path: { type: String, required: true },
      size: Number,
      uploadDate: { type: Date, default: Date.now }
    },
    coverLetter: {
      filename: String,
      originalName: String,
      path: String,
      size: Number
    },
    additionalDocuments: [{
      filename: String,
      originalName: String,
      path: String,
      type: { type: String, enum: ['certificate', 'portfolio', 'reference', 'other'] },
      size: Number
    }]
  },
  
  // Application Status and Tracking
  status: { 
    type: String, 
    enum: ['submitted', 'screening', 'interview_scheduled', 'interviewed', 'technical_test', 'reference_check', 'offer_made', 'hired', 'rejected', 'withdrawn'],
    default: 'submitted' 
  },
  currentStage: String, // Current hiring stage
  
  // Evaluation and Notes
  evaluation: {
    overallRating: { type: Number, min: 1, max: 5 },
    technicalRating: { type: Number, min: 1, max: 5 },
    communicationRating: { type: Number, min: 1, max: 5 },
    cultureFitRating: { type: Number, min: 1, max: 5 },
    notes: String,
    strengths: [String],
    weaknesses: [String],
    recommendation: { type: String, enum: ['strongly_recommend', 'recommend', 'maybe', 'not_recommend', 'reject'] }
  },
  
  // Interview History
  interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }],
  
  // Communication Log
  communications: [{
    type: { type: String, enum: ['email', 'phone', 'sms', 'in_person', 'video_call'] },
    subject: String,
    message: String,
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    sentAt: { type: Date, default: Date.now },
    response: String,
    responseAt: Date
  }],
  
  // Source and Referral
  source: { 
    type: String, 
    enum: ['website', 'linkedin', 'job_board', 'referral', 'walk_in', 'recruitment_agency', 'social_media', 'other'],
    default: 'website' 
  },
  referralInfo: {
    referrerName: String,
    referrerEmail: String,
    relationship: String
  },
  
  // Metadata
  submittedAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  assignedRecruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
}, { timestamps: true });

// Pre-save middleware to generate application ID
jobApplicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate application ID: APP-YYYY-XXXX
    const year = new Date().getFullYear();
    const count = await mongoose.model('JobApplication').countDocuments();
    const sequenceNumber = String(count + 1).padStart(4, '0');
    this.applicationId = `APP-${year}-${sequenceNumber}`;
  }
  
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  next();
});

// Index for faster queries
jobApplicationSchema.index({ jobId: 1, status: 1 });
jobApplicationSchema.index({ 'personalInfo.email': 1 });
jobApplicationSchema.index({ applicationId: 1 });
jobApplicationSchema.index({ submittedAt: -1 });

// Virtual for applicant full name
jobApplicationSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for application age in days
jobApplicationSchema.virtual('applicationAge').get(function() {
  const today = new Date();
  const submitted = new Date(this.submittedAt);
  const diffTime = today - submitted;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to update status
jobApplicationSchema.methods.updateStatus = function(newStatus, updatedBy) {
  this.status = newStatus;
  this.updatedBy = updatedBy;
  this.lastUpdated = new Date();
  return this.save();
};

// Method to add communication log
jobApplicationSchema.methods.addCommunication = function(communicationData) {
  this.communications.push(communicationData);
  this.lastUpdated = new Date();
  return this.save();
};

// Method to add evaluation
jobApplicationSchema.methods.addEvaluation = function(evaluationData) {
  this.evaluation = { ...this.evaluation, ...evaluationData };
  this.lastUpdated = new Date();
  return this.save();
};

// Static method to get applications by job
jobApplicationSchema.statics.getByJob = function(jobId) {
  return this.find({ jobId }).sort({ submittedAt: -1 });
};

// Static method to get applications by status
jobApplicationSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ submittedAt: -1 });
};

// Static method to get recent applications
jobApplicationSchema.statics.getRecent = function(limit = 10) {
  return this.find()
    .sort({ submittedAt: -1 })
    .limit(limit)
    .populate('jobId', 'title jobCode');
};

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
