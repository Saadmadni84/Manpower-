const mongoose = require('mongoose');

const websiteContentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    required: true,
    enum: ['home', 'about', 'contact', 'career', 'clients', 'services'],
    index: true
  },
  section: { 
    type: String, 
    required: true,
    index: true
  }, // hero, about_us, services, statistics, etc.
  contentKey: { 
    type: String, 
    required: true,
    index: true
  }, // unique identifier like 'hero_title', 'stats_employees'
  
  // Multi-language content support
  content: {
    en: mongoose.Schema.Types.Mixed, // Can store text, HTML, arrays, objects
    ar: mongoose.Schema.Types.Mixed  // Arabic content
  },
  
  // Content metadata
  contentType: { 
    type: String, 
    enum: ['text', 'html', 'image', 'video', 'number', 'array', 'json', 'url', 'email'],
    required: true 
  },
  
  // Display and ordering
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  
  // SEO fields
  seoTitle: { 
    en: String, 
    ar: String 
  },
  seoDescription: { 
    en: String, 
    ar: String 
  },
  seoKeywords: { 
    en: [String], 
    ar: [String] 
  },
  
  // Version control
  version: { type: Number, default: 1 },
  isDraft: { type: Boolean, default: false },
  lastPublished: Date,
  previousVersions: [{
    content: {
      en: mongoose.Schema.Types.Mixed,
      ar: mongoose.Schema.Types.Mixed
    },
    version: Number,
    savedAt: Date,
    savedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  }],
  
  // Metadata
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for faster queries
websiteContentSchema.index({ page: 1, section: 1, contentKey: 1 }, { unique: true });

// Virtual for checking if content has unsaved changes
websiteContentSchema.virtual('hasUnpublishedChanges').get(function() {
  return this.isDraft || (this.updatedAt > this.lastPublished);
});

// Methods
websiteContentSchema.methods.publish = function() {
  this.isDraft = false;
  this.lastPublished = new Date();
  return this.save();
};

websiteContentSchema.methods.saveDraft = function(userId) {
  this.isDraft = true;
  this.updatedBy = userId;
  return this.save();
};

websiteContentSchema.methods.saveVersion = function() {
  if (this.previousVersions.length >= 10) {
    this.previousVersions.shift(); // Keep only last 10 versions
  }
  
  this.previousVersions.push({
    content: {
      en: this.content.en,
      ar: this.content.ar
    },
    version: this.version,
    savedAt: new Date(),
    savedBy: this.updatedBy
  });
  
  this.version += 1;
};

// Statics
websiteContentSchema.statics.getPageContent = async function(page, language = 'en') {
  const content = await this.find({ page, isActive: true, isDraft: false })
    .sort({ section: 1, displayOrder: 1 })
    .lean();
  
  // Transform to more usable structure
  const result = {};
  content.forEach(item => {
    if (!result[item.section]) {
      result[item.section] = {};
    }
    result[item.section][item.contentKey] = item.content[language] || item.content.en;
  });
  
  return result;
};

websiteContentSchema.statics.bulkPublish = async function(contentIds, userId) {
  return this.updateMany(
    { _id: { $in: contentIds } },
    { 
      isDraft: false, 
      lastPublished: new Date(),
      updatedBy: userId
    }
  );
};

// Pre-save middleware to handle version control
websiteContentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.saveVersion();
  }
  next();
});

module.exports = mongoose.model('WebsiteContent', websiteContentSchema);
