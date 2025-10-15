const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  // Basic location information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  description: {
    type: String,
    maxlength: 1000
  },
  
  // Location details
  type: {
    type: String,
    enum: ['headquarters', 'branch', 'office', 'warehouse', 'site'],
    default: 'branch'
  },
  
  // Address information
  address: {
    street: String,
    building: String,
    district: String,
    city: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    postalCode: String,
    country: {
      type: String,
      default: 'Saudi Arabia'
    }
  },
  
  // Geographic coordinates
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  
  // Contact information
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: String,
    fax: String,
    website: String
  },
  
  // Operating hours
  operatingHours: {
    sunday: {
      isOpen: { type: Boolean, default: false },
      openTime: String,
      closeTime: String
    },
    monday: {
      isOpen: { type: Boolean, default: true },
      openTime: String,
      closeTime: String
    },
    tuesday: {
      isOpen: { type: Boolean, default: true },
      openTime: String,
      closeTime: String
    },
    wednesday: {
      isOpen: { type: Boolean, default: true },
      openTime: String,
      closeTime: String
    },
    thursday: {
      isOpen: { type: Boolean, default: true },
      openTime: String,
      closeTime: String
    },
    friday: {
      isOpen: { type: Boolean, default: true },
      openTime: String,
      closeTime: String
    },
    saturday: {
      isOpen: { type: Boolean, default: false },
      openTime: String,
      closeTime: String
    }
  },
  
  // Services offered at this location
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    description: String,
    capacity: Number
  }],
  
  // Staff information
  staff: {
    totalEmployees: {
      type: Number,
      default: 0
    },
    manager: {
      name: String,
      phone: String,
      email: String
    },
    departments: [{
      name: String,
      head: String,
      employeeCount: Number
    }]
  },
  
  // Facilities and amenities
  facilities: [{
    name: String,
    description: String,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  
  // Location images
  images: [{
    url: String,
    publicId: String,
    alt: String,
    caption: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'office', 'facility', 'other']
    }
  }],
  
  // Location statistics
  stats: {
    yearsOfOperation: Number,
    clientsServed: {
      type: Number,
      default: 0
    },
    employeesDeployed: {
      type: Number,
      default: 0
    },
    contractsActive: {
      type: Number,
      default: 0
    }
  },
  
  // Multi-language support
  translations: {
    en: {
      name: String,
      description: String
    },
    ar: {
      name: String,
      description: String
    }
  },
  
  // Status and settings
  status: {
    type: String,
    enum: ['active', 'inactive', 'under-construction', 'temporarily-closed'],
    default: 'active'
  },
  
  isMainOffice: {
    type: Boolean,
    default: false
  },
  
  sortOrder: {
    type: Number,
    default: 0
  },
  
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
locationSchema.index({ name: 1 });
locationSchema.index({ type: 1 });
locationSchema.index({ 'address.city': 1 });
locationSchema.index({ 'address.region': 1 });
locationSchema.index({ status: 1 });
locationSchema.index({ isMainOffice: 1 });
locationSchema.index({ sortOrder: 1 });
locationSchema.index({ createdAt: -1 });

// Geospatial index for location-based queries
locationSchema.index({ coordinates: '2dsphere' });

// Virtual for full address
locationSchema.virtual('fullAddress').get(function() {
  const address = this.address;
  return [
    address.street,
    address.building,
    address.district,
    address.city,
    address.region,
    address.postalCode,
    address.country
  ].filter(Boolean).join(', ');
});

// Virtual for current operating status
locationSchema.virtual('isCurrentlyOpen').get(function() {
  const now = new Date();
  const day = now.toLocaleLowerCase().slice(0, 3);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  const daySchedule = this.operatingHours[day];
  if (!daySchedule || !daySchedule.isOpen) {
    return false;
  }
  
  if (!daySchedule.openTime || !daySchedule.closeTime) {
    return true; // Assume open if no specific times
  }
  
  const [openHour, openMinute] = daySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = daySchedule.closeTime.split(':').map(Number);
  
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;
  
  return currentTime >= openTime && currentTime <= closeTime;
});

// Pre-save middleware
locationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
locationSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    type: this.type,
    address: this.address,
    fullAddress: this.fullAddress,
    coordinates: this.coordinates,
    contact: this.contact,
    operatingHours: this.operatingHours,
    services: this.services,
    staff: {
      totalEmployees: this.staff.totalEmployees,
      manager: this.staff.manager
    },
    facilities: this.facilities,
    images: this.images,
    stats: this.stats,
    isCurrentlyOpen: this.isCurrentlyOpen,
    isMainOffice: this.isMainOffice,
    createdAt: this.createdAt
  };
};

locationSchema.methods.addService = function(serviceId, description, capacity) {
  this.services.push({
    service: serviceId,
    description,
    capacity
  });
  return this.save();
};

locationSchema.methods.removeService = function(serviceId) {
  this.services = this.services.filter(service => 
    service.service.toString() !== serviceId.toString()
  );
  return this.save();
};

locationSchema.methods.updateStaffCount = function(count) {
  this.staff.totalEmployees = count;
  return this.save();
};

// Static methods
locationSchema.statics.getActiveLocations = function() {
  return this.find({ status: 'active' }).sort({ sortOrder: 1, createdAt: -1 });
};

locationSchema.statics.getMainOffice = function() {
  return this.findOne({ isMainOffice: true, status: 'active' });
};

locationSchema.statics.getLocationsByCity = function(city) {
  return this.find({ 
    status: 'active',
    'address.city': city 
  }).sort({ sortOrder: 1 });
};

locationSchema.statics.getLocationsByRegion = function(region) {
  return this.find({ 
    status: 'active',
    'address.region': region 
  }).sort({ sortOrder: 1 });
};

locationSchema.statics.getLocationsByType = function(type) {
  return this.find({ 
    status: 'active',
    type 
  }).sort({ sortOrder: 1 });
};

locationSchema.statics.getLocationsNearby = function(coordinates, maxDistance = 10000) {
  return this.find({
    status: 'active',
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

locationSchema.statics.getLocationStats = function() {
  return this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: null,
        totalLocations: { $sum: 1 },
        totalEmployees: { $sum: '$staff.totalEmployees' },
        totalClients: { $sum: '$stats.clientsServed' },
        totalContracts: { $sum: '$stats.contractsActive' }
      }
    }
  ]);
};

module.exports = mongoose.model('Location', locationSchema);
