const mongoose = require('mongoose');
const slugify = require('slugify');

const jobOpeningSchema = new mongoose.Schema({
  // Basic Job Information
  title: {
    en: { type: String, required: true, maxlength: 100 },
    ar: { type: String, maxlength: 100 }
  },
  jobCode: { type: String, unique: true }, // Auto-generated: JOB-YYYY-XXXX
  slug: { type: String, unique: true },
  
  // Job Classification  
  department: { 
    type: String, 
    enum: ['airport_operations', 'corporate_services', 'catering', 'logistics', 'construction', 'facility_management', 'administration', 'hr', 'finance', 'it'],
    required: true 
  },
  category: {
    type: String,
    enum: ['management', 'supervisor', 'skilled_worker', 'general_worker', 'specialist', 'intern'],
    required: true
  },
  
  // Location and Work Details
  locations: [{ 
    city: { type: String, required: true },
    region: String,
    isRemote: { type: Boolean, default: false },
    isPrimary: { type: Boolean, default: false }
  }],
  
  jobType: { 
    type: String, 
    enum: ['full_time', 'part_time', 'contract', 'temporary', 'internship'],
    required: true 
  },
  workSchedule: {
    type: String,
    enum: ['day_shift', 'night_shift', 'rotating_shift', 'flexible', 'weekend_only'],
    default: 'day_shift'
  },
  
  // Job Description
  summary: {
    en: { type: String, required: true, maxlength: 300 },
    ar: { type: String, maxlength: 300 }
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String }
  },
  responsibilities: {
    en: [{ type: String, required: true }],
    ar: [String]
  },
  requirements: {
    en: [{ type: String, required: true }],
    ar: [String]
  },
  qualifications: {
    en: [String],
    ar: [String]
  },
  skills: {
    required: [String], // Must-have skills
    preferred: [String]  // Nice-to-have skills
  },
  
  // Experience and Education
  experienceLevel: { 
    type: String, 
    enum: ['entry', 'junior', 'mid', 'senior', 'executive'],
    required: true 
  },
  minExperience: { type: Number, required: true, min: 0 }, // years
  maxExperience: { type: Number },
  educationLevel: {
    type: String,
    enum: ['high_school', 'diploma', 'bachelor', 'master', 'phd', 'professional_cert'],
    required: true
  },
  
  // Compensation
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, enum: ['SAR', 'USD'], default: 'SAR' },
    type: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
    negotiable: { type: Boolean, default: false }
  },
  benefits: [String], // Health insurance, transportation, housing, etc.
  
  // Application Management
  applicationDeadline: { type: Date, required: true },
  numberOfPositions: { type: Number, default: 1 },
  urgentHiring: { type: Boolean, default: false },
  applicationMethod: {
    type: String,
    enum: ['online_form', 'email', 'in_person', 'phone'],
    default: 'online_form'
  },
  
  // Status and Visibility
  status: { 
    type: String, 
    enum: ['draft', 'active', 'paused', 'filled', 'cancelled', 'expired'],
    default: 'draft' 
  },
  visibility: {
    type: String,
    enum: ['public', 'internal', 'private'],
    default: 'public'
  },
  featuredJob: { type: Boolean, default: false },
  
  // SEO and Marketing
  metaDescription: {
    en: String,
    ar: String
  },
  keywords: [String],
  
  // Analytics
  viewCount: { type: Number, default: 0 },
  applicationCount: { type: Number, default: 0 },
  
  // Hiring Process
  hiringStages: [{
    name: { type: String, required: true },
    description: String,
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
  }],
  
  // Metadata
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  assignedRecruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
}, { timestamps: true });

// Pre-save middleware to generate job code and slug
jobOpeningSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate job code: JOB-YYYY-XXXX
    const year = new Date().getFullYear();
    const count = await mongoose.model('JobOpening').countDocuments();
    const sequenceNumber = String(count + 1).padStart(4, '0');
    this.jobCode = `JOB-${year}-${sequenceNumber}`;
    
    // Generate slug from English title
    if (this.title.en && !this.slug) {
      this.slug = slugify(this.title.en, { lower: true, strict: true }) + `-${sequenceNumber}`;
    }
  }
  next();
});

// Index for faster queries
jobOpeningSchema.index({ status: 1, applicationDeadline: 1 });
jobOpeningSchema.index({ department: 1, category: 1 });
jobOpeningSchema.index({ 'title.en': 'text', 'description.en': 'text' });

// Virtual for checking if job is expired
jobOpeningSchema.virtual('isExpired').get(function() {
  return new Date() > this.applicationDeadline;
});

// Virtual for days until deadline
jobOpeningSchema.virtual('daysUntilDeadline').get(function() {
  const today = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to increment view count
jobOpeningSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment application count
jobOpeningSchema.methods.incrementApplicationCount = function() {
  this.applicationCount += 1;
  return this.save();
};

// Static method to get active jobs
jobOpeningSchema.statics.getActiveJobs = function() {
  return this.find({ 
    status: 'active', 
    applicationDeadline: { $gte: new Date() } 
  }).sort({ createdAt: -1 });
};

// Static method to get featured jobs
jobOpeningSchema.statics.getFeaturedJobs = function(limit = 6) {
  return this.find({ 
    status: 'active', 
    featuredJob: true,
    applicationDeadline: { $gte: new Date() } 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

module.exports = mongoose.model('JobOpening', jobOpeningSchema);

