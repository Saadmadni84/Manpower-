const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    required: true,
    enum: ['home', 'about', 'contact', 'career', 'clients', 'services'],
    unique: true
  },
  
  // Page-level SEO
  seo: {
    title: { en: String, ar: String },
    description: { en: String, ar: String },
    keywords: { en: [String], ar: [String] },
    ogImage: String, // Open Graph image for social sharing
    canonical: String
  },
  
  // Page status
  isPublished: { type: Boolean, default: true },
  isDraft: { type: Boolean, default: false },
  lastPublished: Date,
  scheduledPublish: Date,
  
  // Page configuration
  config: {
    enableComments: { type: Boolean, default: false },
    enableSharing: { type: Boolean, default: true },
    requireAuth: { type: Boolean, default: false },
    customCSS: String,
    customJS: String
  },
  
  // Sections management
  sections: [{
    sectionId: { type: String, required: true },
    name: { en: String, ar: String },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    config: mongoose.Schema.Types.Mixed // Section-specific configuration
  }],
  
  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    lastViewed: Date,
    avgTimeOnPage: Number
  },
  
  // Metadata
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to check if page has active sections
pageContentSchema.virtual('activeSectionsCount').get(function() {
  return this.sections.filter(s => s.isActive).length;
});

// Methods
pageContentSchema.methods.publish = function() {
  this.isDraft = false;
  this.isPublished = true;
  this.lastPublished = new Date();
  return this.save();
};

pageContentSchema.methods.addSection = function(sectionData) {
  this.sections.push(sectionData);
  this.sections.sort((a, b) => a.displayOrder - b.displayOrder);
  return this.save();
};

pageContentSchema.methods.reorderSections = function(sectionOrder) {
  sectionOrder.forEach((sectionId, index) => {
    const section = this.sections.find(s => s.sectionId === sectionId);
    if (section) {
      section.displayOrder = index;
    }
  });
  return this.save();
};

pageContentSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  return this.save();
};

// Statics
pageContentSchema.statics.getPublishedPages = function() {
  return this.find({ isPublished: true, isDraft: false })
    .select('-__v')
    .lean();
};

pageContentSchema.statics.getPageWithContent = async function(pageName) {
  const WebsiteContent = mongoose.model('WebsiteContent');
  
  const [pageInfo, content] = await Promise.all([
    this.findOne({ page: pageName }),
    WebsiteContent.find({ page: pageName, isActive: true })
      .sort({ section: 1, displayOrder: 1 })
  ]);
  
  return {
    page: pageInfo,
    content: content
  };
};

module.exports = mongoose.model('PageContent', pageContentSchema);
