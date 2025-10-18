const mongoose = require('mongoose');

const footerContentSchema = new mongoose.Schema({
  company: {
    name: {
      type: String,
      required: true,
      default: 'Manpower Excellence Company'
    },
    tagline: {
      type: String,
      required: true,
      default: '25 Years of Manpower Excellence in Saudi Arabia'
    },
    logo: {
      type: String,
      default: '/logo.png'
    }
  },
  quickLinks: [{
    label: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  contact: {
    address: {
      type: String,
      required: true,
      default: 'Riyadh, Saudi Arabia'
    },
    phone: {
      type: String,
      required: true,
      default: '+966 XX XXX XXXX'
    },
    email: {
      type: String,
      required: true,
      default: 'info@company.com'
    }
  },
  socialMedia: [{
    platform: {
      type: String,
      required: true,
      enum: ['LinkedIn', 'Facebook', 'Instagram', 'Twitter', 'YouTube']
    },
    url: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  copyright: {
    year: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    text: {
      type: String,
      default: 'All rights reserved.'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure quick links are sorted by order
footerContentSchema.pre('find', function() {
  this.sort({ 'quickLinks.order': 1 });
});

// Ensure social media links are sorted by order
footerContentSchema.pre('findOne', function() {
  this.sort({ 'socialMedia.order': 1 });
});

const FooterContent = mongoose.model('FooterContent', footerContentSchema);

module.exports = FooterContent;

