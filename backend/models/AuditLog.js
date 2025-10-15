const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // Action information
  action: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // Entity information
  entity: {
    type: {
      type: String,
      required: true,
      trim: true
    },
    id: {
      type: String,
      required: true
    },
    name: String
  },
  
  // Action details
  operation: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import'],
    required: true
  },
  
  // User information
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true
    },
    email: String,
    name: String,
    role: String
  },
  
  // Request information
  request: {
    ipAddress: String,
    userAgent: String,
    method: String,
    url: String,
    headers: mongoose.Schema.Types.Mixed
  },
  
  // Changes information
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    fieldsChanged: [String]
  },
  
  // Additional data
  data: {
    description: String,
    reason: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  
  // Status information
  status: {
    type: String,
    enum: ['success', 'failure', 'warning'],
    default: 'success'
  },
  
  // Error information (if applicable)
  error: {
    message: String,
    code: String,
    stack: String
  },
  
  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  // Additional timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
auditLogSchema.index({ 'user.id': 1 });
auditLogSchema.index({ 'entity.type': 1 });
auditLogSchema.index({ 'entity.id': 1 });
auditLogSchema.index({ operation: 1 });
auditLogSchema.index({ status: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ createdAt: -1 });

// Compound indexes for common queries
auditLogSchema.index({ 'user.id': 1, timestamp: -1 });
auditLogSchema.index({ 'entity.type': 1, timestamp: -1 });
auditLogSchema.index({ operation: 1, timestamp: -1 });

// Instance methods
auditLogSchema.methods.toJSON = function() {
  return {
    id: this._id,
    action: this.action,
    entity: this.entity,
    operation: this.operation,
    user: {
      id: this.user.id,
      email: this.user.email,
      name: this.user.name,
      role: this.user.role
    },
    request: {
      ipAddress: this.request.ipAddress,
      userAgent: this.request.userAgent,
      method: this.request.method,
      url: this.request.url
    },
    changes: this.changes,
    data: this.data,
    status: this.status,
    error: this.error ? {
      message: this.error.message,
      code: this.error.code
    } : null,
    timestamp: this.timestamp,
    createdAt: this.createdAt
  };
};

// Static methods
auditLogSchema.statics.logAction = function(actionData) {
  const logEntry = new this({
    action: actionData.action,
    entity: actionData.entity,
    operation: actionData.operation,
    user: actionData.user,
    request: actionData.request,
    changes: actionData.changes,
    data: actionData.data,
    status: actionData.status || 'success',
    error: actionData.error
  });
  
  return logEntry.save();
};

auditLogSchema.statics.getLogsByUser = function(userId, limit = 50) {
  return this.find({ 'user.id': userId })
    .sort({ timestamp: -1 })
    .limit(limit);
};

auditLogSchema.statics.getLogsByEntity = function(entityType, entityId, limit = 50) {
  return this.find({ 
    'entity.type': entityType, 
    'entity.id': entityId 
  })
    .sort({ timestamp: -1 })
    .limit(limit);
};

auditLogSchema.statics.getLogsByOperation = function(operation, limit = 50) {
  return this.find({ operation })
    .sort({ timestamp: -1 })
    .limit(limit);
};

auditLogSchema.statics.getLogsByDateRange = function(startDate, endDate, limit = 100) {
  return this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  })
    .sort({ timestamp: -1 })
    .limit(limit);
};

auditLogSchema.statics.getRecentLogs = function(limit = 100) {
  return this.find({})
    .sort({ timestamp: -1 })
    .limit(limit);
};

auditLogSchema.statics.getFailedActions = function(limit = 50) {
  return this.find({ status: 'failure' })
    .sort({ timestamp: -1 })
    .limit(limit);
};

auditLogSchema.statics.getAuditStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: {
          operation: '$operation',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    }
  ]);
};

auditLogSchema.statics.getUserActivity = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        'user.id': mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          operation: '$operation'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.date': -1 }
    }
  ]);
};

auditLogSchema.statics.getEntityActivity = function(entityType, entityId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    'entity.type': entityType,
    'entity.id': entityId,
    timestamp: { $gte: startDate }
  })
    .sort({ timestamp: -1 });
};

// Helper function to create audit log entry
const createAuditLog = async (actionData) => {
  try {
    const AuditLog = mongoose.model('AuditLog');
    return await AuditLog.logAction(actionData);
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to avoid breaking the main operation
  }
};

module.exports = {
  AuditLog: mongoose.model('AuditLog', auditLogSchema),
  createAuditLog
};
