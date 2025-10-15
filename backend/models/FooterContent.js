const mongoose = require('mongoose');

const footerContentSchema = new mongoose.Schema({
  section: { 
    type: String, 
    required: true,
    enum: ['company_info', 'quick_links', 'services', 'contact', 'social_media', 'legal', 'newsletter']
  },
  content: {
    en: mongoose.Schema.Types.Mixed,
    ar: mongoose.Schema.Types.Mixed
  },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient querying
footerContentSchema.index({ section: 1, isActive: 1 });
footerContentSchema.index({ displayOrder: 1 });

// Virtual for formatted content
footerContentSchema.virtual('formattedContent').get(function() {
  return {
    section: this.section,
    content: this.content,
    isActive: this.isActive,
    displayOrder: this.displayOrder,
    lastUpdated: this.updatedAt
  };
});

// Static method to get active footer content
footerContentSchema.statics.getActiveContent = async function() {
  return await this.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .select('section content displayOrder updatedAt');
};

// Static method to get content by section
footerContentSchema.statics.getBySection = async function(section) {
  return await this.findOne({ section, isActive: true })
    .select('content displayOrder updatedAt');
};

// Instance method to update content
footerContentSchema.methods.updateContent = function(newContent, adminId) {
  this.content = newContent;
  this.updatedBy = adminId;
  return this.save();
};

module.exports = mongoose.model('FooterContent', footerContentSchema);
