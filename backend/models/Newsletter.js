const mongoose = require('mongoose');
const validator = require('validator');

const newsletterSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: [true, 'Email already subscribed'],
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  subscriptionDate: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  preferences: {
    jobAlerts: { 
      type: Boolean, 
      default: true 
    },
    companyNews: { 
      type: Boolean, 
      default: true 
    },
    industryUpdates: { 
      type: Boolean, 
      default: false 
    }
  },
  source: { 
    type: String, 
    enum: ['footer', 'popup', 'contact_page', 'career_page', 'admin'],
    default: 'footer' 
  },
  ipAddress: String,
  userAgent: String,
  unsubscribedAt: Date,
  unsubscribeReason: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
newsletterSchema.index({ email: 1 }, { unique: true });
newsletterSchema.index({ isActive: 1, subscriptionDate: -1 });
newsletterSchema.index({ source: 1 });

// Virtual for full name
newsletterSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || 'Anonymous';
});

// Virtual for subscription status
newsletterSchema.virtual('subscriptionStatus').get(function() {
  if (!this.isActive) {
    return 'unsubscribed';
  }
  
  const now = new Date();
  const daysSinceSubscription = Math.floor((now - this.subscriptionDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceSubscription < 1) {
    return 'new';
  } else if (daysSinceSubscription < 30) {
    return 'recent';
  } else {
    return 'active';
  }
});

// Pre-save middleware to validate email
newsletterSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

// Static method to subscribe user
newsletterSchema.statics.subscribe = async function(subscriptionData) {
  const { email, firstName, lastName, preferences = {}, source = 'footer', ipAddress, userAgent } = subscriptionData;
  
  // Check if email already exists
  const existingSubscription = await this.findOne({ email });
  
  if (existingSubscription) {
    if (existingSubscription.isActive) {
      throw new Error('Email already subscribed');
    } else {
      // Reactivate subscription
      existingSubscription.isActive = true;
      existingSubscription.firstName = firstName;
      existingSubscription.lastName = lastName;
      existingSubscription.preferences = { ...existingSubscription.preferences, ...preferences };
      existingSubscription.source = source;
      existingSubscription.ipAddress = ipAddress;
      existingSubscription.userAgent = userAgent;
      existingSubscription.unsubscribedAt = undefined;
      existingSubscription.unsubscribeReason = undefined;
      
      return await existingSubscription.save();
    }
  }
  
  // Create new subscription
  return await this.create({
    email,
    firstName,
    lastName,
    preferences,
    source,
    ipAddress,
    userAgent
  });
};

// Static method to unsubscribe user
newsletterSchema.statics.unsubscribe = async function(email, reason = 'User request') {
  const subscription = await this.findOne({ email, isActive: true });
  
  if (!subscription) {
    throw new Error('Subscription not found');
  }
  
  subscription.isActive = false;
  subscription.unsubscribedAt = new Date();
  subscription.unsubscribeReason = reason;
  
  return await subscription.save();
};

// Static method to get subscription stats
newsletterSchema.statics.getStats = async function() {
  const total = await this.countDocuments();
  const active = await this.countDocuments({ isActive: true });
  const recent = await this.countDocuments({ 
    isActive: true,
    subscriptionDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });
  
  const bySource = await this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$source', count: { $sum: 1 } } }
  ]);
  
  return {
    total,
    active,
    recent,
    unsubscribed: total - active,
    bySource: bySource.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

// Instance method to update preferences
newsletterSchema.methods.updatePreferences = function(newPreferences) {
  this.preferences = { ...this.preferences, ...newPreferences };
  return this.save();
};

module.exports = mongoose.model('Newsletter', newsletterSchema);
