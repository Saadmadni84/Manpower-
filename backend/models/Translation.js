const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  // Translation identification
  key: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // Language information
  language: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 5
  },
  
  // Translation content
  value: {
    type: String,
    required: true,
    maxlength: 5000
  },
  
  // Translation context
  context: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Translation category
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // Translation status
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft'
  },
  
  // Translation metadata
  metadata: {
    source: {
      type: String,
      enum: ['manual', 'auto', 'imported', 'api'],
      default: 'manual'
    },
    translator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    translatedAt: Date,
    reviewedAt: Date,
    version: {
      type: Number,
      default: 1
    }
  },
  
  // Translation notes
  notes: [{
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
translationSchema.index({ key: 1, language: 1 }, { unique: true });
translationSchema.index({ language: 1 });
translationSchema.index({ category: 1 });
translationSchema.index({ status: 1 });
translationSchema.index({ createdAt: -1 });

// Pre-save middleware
translationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
translationSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    key: this.key,
    language: this.language,
    value: this.value,
    context: this.context,
    category: this.category,
    status: this.status,
    metadata: {
      source: this.metadata.source,
      version: this.metadata.version
    },
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

translationSchema.methods.approve = function(reviewer) {
  this.status = 'approved';
  this.metadata.reviewer = reviewer;
  this.metadata.reviewedAt = new Date();
  return this.save();
};

translationSchema.methods.reject = function(reviewer) {
  this.status = 'rejected';
  this.metadata.reviewer = reviewer;
  this.metadata.reviewedAt = new Date();
  return this.save();
};

translationSchema.methods.addNote = function(note, adminUser) {
  this.notes.push({
    note,
    addedBy: adminUser,
    addedAt: new Date()
  });
  return this.save();
};

// Static methods
translationSchema.statics.getTranslationsByLanguage = function(language) {
  return this.find({ language: language.toLowerCase() }).sort({ category: 1, key: 1 });
};

translationSchema.statics.getTranslationsByCategory = function(category) {
  return this.find({ category }).sort({ language: 1, key: 1 });
};

translationSchema.statics.getTranslation = function(key, language) {
  return this.findOne({ key, language: language.toLowerCase() });
};

translationSchema.statics.getApprovedTranslations = function(language) {
  return this.find({ 
    language: language.toLowerCase(), 
    status: 'approved' 
  }).sort({ category: 1, key: 1 });
};

translationSchema.statics.getPendingTranslations = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

translationSchema.statics.getTranslationStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$language',
        total: { $sum: 1 },
        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } }
      }
    }
  ]);
};

module.exports = mongoose.model('Translation', translationSchema);
