const mongoose = require('mongoose');

const cvSubmissionSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobOpening',
    required: true
  },
  applicant_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  nationality: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  cv_file: {
    type: String,
    required: true
  },
  cover_letter: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'new'
  },
  review_notes: {
    type: String,
    default: ''
  },
  submitted_at: {
    type: Date,
    default: Date.now
  },
  reviewed_at: {
    type: Date
  }
});

// Index for efficient queries
cvSubmissionSchema.index({ job_id: 1, status: 1 });
cvSubmissionSchema.index({ submitted_at: -1 });

module.exports = mongoose.model('CVSubmission', cvSubmissionSchema);
