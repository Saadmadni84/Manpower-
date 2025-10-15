const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  // Interview Reference
  interviewId: { type: String, unique: true }, // Auto-generated: INT-YYYY-XXXX
  
  // Related Records
  applicationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'JobApplication', 
    required: true 
  },
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'JobOpening', 
    required: true 
  },
  
  // Interview Details
  type: {
    type: String,
    enum: ['phone_screening', 'video_call', 'in_person', 'technical', 'panel', 'group', 'final'],
    required: true
  },
  round: { type: Number, default: 1 },
  stage: String, // e.g., "First Round", "Technical Assessment", "Final Interview"
  
  // Scheduling
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true }, // e.g., "10:00 AM"
  duration: { type: Number, default: 60 }, // in minutes
  timeZone: { type: String, default: 'Asia/Riyadh' },
  
  // Location/Platform
  location: {
    type: { type: String, enum: ['office', 'online', 'phone', 'other'] },
    address: String, // For in-person interviews
    room: String,
    platform: String, // Zoom, Teams, Google Meet
    meetingLink: String,
    meetingId: String,
    passcode: String
  },
  
  // Participants
  interviewers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    name: String,
    role: String, // e.g., "Technical Lead", "HR Manager"
    email: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Interview Content
  focusAreas: [String], // Technical skills, soft skills, culture fit, etc.
  questionsToAsk: [String],
  evaluationCriteria: [{
    criterion: String,
    weight: Number, // Percentage importance
    description: String
  }],
  
  // Status and Outcome
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled', 'no_show'],
    default: 'scheduled'
  },
  
  // Feedback and Evaluation
  feedback: {
    overallRating: { type: Number, min: 1, max: 5 },
    technicalSkills: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    problemSolving: { type: Number, min: 1, max: 5 },
    cultureFit: { type: Number, min: 1, max: 5 },
    leadership: { type: Number, min: 1, max: 5 },
    
    strengths: [String],
    weaknesses: [String],
    keyObservations: String,
    concerns: [String],
    
    recommendation: {
      type: String,
      enum: ['strongly_recommend', 'recommend', 'neutral', 'not_recommend', 'reject']
    },
    nextSteps: String,
    
    // Individual interviewer feedbacks
    individualFeedbacks: [{
      interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
      rating: { type: Number, min: 1, max: 5 },
      comments: String,
      recommendation: String,
      submittedAt: { type: Date, default: Date.now }
    }]
  },
  
  // Technical Assessment (if applicable)
  technicalAssessment: {
    hasAssessment: { type: Boolean, default: false },
    assessmentType: { type: String, enum: ['coding', 'system_design', 'case_study', 'presentation', 'other'] },
    problemStatement: String,
    solution: String,
    score: { type: Number, min: 0, max: 100 },
    passingScore: { type: Number, default: 70 },
    timeAllotted: Number, // in minutes
    timeUsed: Number,
    evaluatorNotes: String
  },
  
  // Notes and Attachments
  notes: String,
  internalNotes: String, // Not visible to candidate
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Reminders and Notifications
  reminders: [{
    type: { type: String, enum: ['email', 'sms', 'system'] },
    sentTo: { type: String, enum: ['candidate', 'interviewer', 'both'] },
    sentAt: Date,
    status: { type: String, enum: ['pending', 'sent', 'failed'] }
  }],
  
  // Rescheduling History
  rescheduleHistory: [{
    previousDate: Date,
    previousTime: String,
    newDate: Date,
    newTime: String,
    reason: String,
    rescheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    rescheduledAt: { type: Date, default: Date.now }
  }],
  
  // Cancellation
  cancellation: {
    isCancelled: { type: Boolean, default: false },
    reason: String,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    cancelledAt: Date
  },
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
}, { timestamps: true });

// Pre-save middleware to generate interview ID
interviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate interview ID: INT-YYYY-XXXX
    const year = new Date().getFullYear();
    const count = await mongoose.model('Interview').countDocuments();
    const sequenceNumber = String(count + 1).padStart(4, '0');
    this.interviewId = `INT-${year}-${sequenceNumber}`;
  }
  next();
});

// Index for faster queries
interviewSchema.index({ applicationId: 1 });
interviewSchema.index({ scheduledDate: 1, status: 1 });
interviewSchema.index({ 'interviewers.userId': 1 });

// Virtual for interview date-time
interviewSchema.virtual('fullDateTime').get(function() {
  return `${this.scheduledDate.toISOString().split('T')[0]} ${this.scheduledTime}`;
});

// Virtual for checking if interview is upcoming
interviewSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  const interviewDateTime = new Date(this.scheduledDate);
  return interviewDateTime > now && this.status === 'scheduled';
});

// Method to reschedule interview
interviewSchema.methods.reschedule = function(newDate, newTime, reason, userId) {
  this.rescheduleHistory.push({
    previousDate: this.scheduledDate,
    previousTime: this.scheduledTime,
    newDate: newDate,
    newTime: newTime,
    reason: reason,
    rescheduledBy: userId
  });
  
  this.scheduledDate = newDate;
  this.scheduledTime = newTime;
  this.status = 'rescheduled';
  this.updatedBy = userId;
  
  return this.save();
};

// Method to cancel interview
interviewSchema.methods.cancel = function(reason, userId) {
  this.status = 'cancelled';
  this.cancellation = {
    isCancelled: true,
    reason: reason,
    cancelledBy: userId,
    cancelledAt: new Date()
  };
  this.updatedBy = userId;
  
  return this.save();
};

// Method to add feedback
interviewSchema.methods.addFeedback = function(feedbackData, userId) {
  this.feedback = { ...this.feedback, ...feedbackData };
  this.status = 'completed';
  this.updatedBy = userId;
  
  return this.save();
};

// Static method to get upcoming interviews
interviewSchema.statics.getUpcoming = function(days = 7) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  
  return this.find({
    scheduledDate: { $gte: startDate, $lte: endDate },
    status: { $in: ['scheduled', 'confirmed'] }
  })
  .sort({ scheduledDate: 1 })
  .populate('applicationId jobId');
};

// Static method to get today's interviews
interviewSchema.statics.getToday = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    scheduledDate: { $gte: today, $lt: tomorrow },
    status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
  })
  .sort({ scheduledTime: 1 })
  .populate('applicationId jobId');
};

// Static method to get interviews by interviewer
interviewSchema.statics.getByInterviewer = function(userId) {
  return this.find({
    'interviewers.userId': userId,
    status: { $in: ['scheduled', 'confirmed'] }
  })
  .sort({ scheduledDate: 1 });
};

module.exports = mongoose.model('Interview', interviewSchema);

