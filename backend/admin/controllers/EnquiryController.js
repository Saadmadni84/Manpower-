const ContactEnquiry = require('../models/ContactEnquiry');
const { sendEmail } = require('../../config/mailer');

class EnquiryController {
  // Get all enquiries with advanced filtering and pagination
  static async getAllEnquiries(req, res) {
    try {
      const { 
        status, 
        serviceType, 
        inquiryType, 
        priority, 
        search,
        page = 1, 
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        startDate,
        endDate,
        city,
        region
      } = req.query;

      const filter = {};
      
      // Status filter
      if (status) {
        if (Array.isArray(status)) {
          filter.status = { $in: status };
        } else {
          filter.status = status;
        }
      }
      
      // Service type filter
      if (serviceType) {
        if (Array.isArray(serviceType)) {
          filter.serviceType = { $in: serviceType };
        } else {
          filter.serviceType = serviceType;
        }
      }
      
      // Inquiry type filter
      if (inquiryType) {
        if (Array.isArray(inquiryType)) {
          filter.inquiryType = { $in: inquiryType };
        } else {
          filter.inquiryType = inquiryType;
        }
      }
      
      // Priority filter
      if (priority) {
        if (Array.isArray(priority)) {
          filter.priority = { $in: priority };
        } else {
          filter.priority = priority;
        }
      }
      
      // Location filters
      if (city) filter['location.city'] = new RegExp(city, 'i');
      if (region) filter['location.region'] = new RegExp(region, 'i');
      
      // Date range filter
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
      
      // Search filter
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { 'personalInfo.name': searchRegex },
          { 'personalInfo.email': searchRegex },
          { 'personalInfo.phone': searchRegex },
          { 'personalInfo.company': searchRegex },
          { subject: searchRegex },
          { message: searchRegex }
        ];
      }

      // Sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Get enquiries with pagination
      const enquiries = await ContactEnquiry.find(filter)
        .populate('response.respondedBy', 'username email')
        .populate('followUp.assignedTo', 'username email')
        .populate('adminNotes.addedBy', 'username email')
        .populate('statusHistory.changedBy', 'username email')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalCount = await ContactEnquiry.countDocuments(filter);
      
      res.json({
        success: true,
        data: { 
          enquiries: enquiries.map(e => e.toAdminJSON()), 
          count: enquiries.length,
          totalCount,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          hasNextPage: skip + enquiries.length < totalCount,
          hasPrevPage: parseInt(page) > 1
        }
      });
    } catch (error) {
      console.error('Get enquiries error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get enquiry by ID with full details
  static async getEnquiryById(req, res) {
    try {
      const { id } = req.params;
      const enquiry = await ContactEnquiry.findById(id)
        .populate('response.respondedBy', 'username email')
        .populate('followUp.assignedTo', 'username email')
        .populate('adminNotes.addedBy', 'username email')
        .populate('statusHistory.changedBy', 'username email');

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      // Mark as read if it's new
      if (enquiry.status === 'new') {
        await enquiry.updateStatus('read', req.admin._id, 'Viewed by admin');
      }

      res.json({
        success: true,
        data: { enquiry: enquiry.toAdminJSON() }
      });
    } catch (error) {
      console.error('Get enquiry error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new enquiry (public endpoint)
  static async createEnquiry(req, res) {
    try {
      const enquiryData = {
        ...req.body,
        additionalInfo: {
          ...req.body.additionalInfo,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          pageUrl: req.get('Referer') || req.body.pageUrl
        }
      };

      const enquiry = new ContactEnquiry(enquiryData);
      await enquiry.save();

      // Send notification email to admin
      try {
        await sendEmail(
          process.env.ADMIN_EMAIL || 'admin@manpowercompany.sa',
          'newEnquiry',
          {
            name: enquiry.personalInfo.name,
            email: enquiry.personalInfo.email,
            phone: enquiry.personalInfo.phone,
            company: enquiry.personalInfo.company,
            subject: enquiry.subject,
            message: enquiry.message,
            serviceType: enquiry.serviceType,
            inquiryType: enquiry.inquiryType,
            priority: enquiry.priority,
            enquiryId: enquiry._id,
            companyName: process.env.COMPANY_NAME || 'Manpower Company'
          }
        );
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }

      // Send auto-reply to customer
      try {
        await sendEmail(
          enquiry.personalInfo.email,
          'enquiryConfirmation',
          {
            name: enquiry.personalInfo.name,
            subject: enquiry.subject,
            enquiryId: enquiry._id,
            companyName: process.env.COMPANY_NAME || 'Manpower Company'
          }
        );
      } catch (emailError) {
        console.error('Failed to send auto-reply:', emailError);
      }

      res.status(201).json({
        success: true,
        message: 'Your enquiry has been submitted successfully. We will get back to you soon.',
        data: { enquiry: enquiry.toPublicJSON() }
      });
    } catch (error) {
      console.error('Create enquiry error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit enquiry. Please try again.'
      });
    }
  }

  // Update enquiry status
  static async updateEnquiryStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes, priority } = req.body;

      const enquiry = await ContactEnquiry.findById(id);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      // Update status with history tracking
      await enquiry.updateStatus(status, req.admin._id, notes || 'Status updated');

      // Update priority if provided
      if (priority) {
        enquiry.priority = priority;
      }

      await enquiry.save();

      res.json({
        success: true,
        message: 'Enquiry status updated successfully',
        data: { enquiry: enquiry.toAdminJSON() }
      });
    } catch (error) {
      console.error('Update enquiry status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Add admin note to enquiry
  static async addAdminNote(req, res) {
    try {
      const { id } = req.params;
      const { note, isInternal = false } = req.body;

      const enquiry = await ContactEnquiry.findById(id);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      await enquiry.addAdminNote(note, req.admin._id, isInternal);

      res.json({
        success: true,
        message: 'Note added successfully',
        data: { enquiry: enquiry.toAdminJSON() }
      });
    } catch (error) {
      console.error('Add admin note error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Respond to enquiry
  static async respondToEnquiry(req, res) {
    try {
      const { id } = req.params;
      const { responseMessage, responseMethod = 'email' } = req.body;

      const enquiry = await ContactEnquiry.findById(id);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      await enquiry.addResponse({
        responseMessage,
        responseMethod
      }, req.admin._id);

      // Send response email to customer
      if (responseMethod === 'email') {
        try {
          await sendEmail(
            enquiry.personalInfo.email,
            'enquiryResponse',
            {
              name: enquiry.personalInfo.name,
              subject: enquiry.subject,
              responseMessage,
              enquiryId: enquiry._id,
              companyName: process.env.COMPANY_NAME || 'Manpower Company'
            }
          );
        } catch (emailError) {
          console.error('Failed to send response email:', emailError);
        }
      }

      res.json({
        success: true,
        message: 'Response sent successfully',
        data: { enquiry: enquiry.toAdminJSON() }
      });
    } catch (error) {
      console.error('Respond to enquiry error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Schedule follow-up
  static async scheduleFollowUp(req, res) {
    try {
      const { id } = req.params;
      const { scheduledDate, notes, assignedTo } = req.body;

      const enquiry = await ContactEnquiry.findById(id);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      await enquiry.scheduleFollowUp({
        scheduledDate: new Date(scheduledDate),
        notes,
        assignedTo
      }, req.admin._id);

      res.json({
        success: true,
        message: 'Follow-up scheduled successfully',
        data: { enquiry: enquiry.toAdminJSON() }
      });
    } catch (error) {
      console.error('Schedule follow-up error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Complete follow-up
  static async completeFollowUp(req, res) {
    try {
      const { id } = req.params;

      const enquiry = await ContactEnquiry.findById(id);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      await enquiry.completeFollowUp(req.admin._id);

      res.json({
        success: true,
        message: 'Follow-up completed successfully',
        data: { enquiry: enquiry.toAdminJSON() }
      });
    } catch (error) {
      console.error('Complete follow-up error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Bulk update enquiries
  static async bulkUpdateEnquiries(req, res) {
    try {
      const { enquiryIds, updates } = req.body;

      if (!enquiryIds || !Array.isArray(enquiryIds) || enquiryIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Enquiry IDs are required'
        });
      }

      const bulkOps = enquiryIds.map(id => ({
        updateOne: {
          filter: { _id: id },
          update: { 
            ...updates,
            updatedAt: new Date()
          }
        }
      }));

      const result = await ContactEnquiry.bulkWrite(bulkOps);

      res.json({
        success: true,
        message: `Updated ${result.modifiedCount} enquiries successfully`,
        data: { modifiedCount: result.modifiedCount }
      });
    } catch (error) {
      console.error('Bulk update enquiries error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete enquiry
  static async deleteEnquiry(req, res) {
    try {
      const { id } = req.params;
      const enquiry = await ContactEnquiry.findByIdAndDelete(id);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      res.json({
        success: true,
        message: 'Enquiry deleted successfully'
      });
    } catch (error) {
      console.error('Delete enquiry error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get enquiry statistics
  static async getEnquiryStats(req, res) {
    try {
      const [
        total,
        newEnquiries,
        readEnquiries,
        inProgressEnquiries,
        respondedEnquiries,
        closedEnquiries,
        spamEnquiries,
        byServiceType,
        byInquiryType,
        byPriority,
        monthlyStats,
        pendingFollowUps
      ] = await Promise.all([
        ContactEnquiry.countDocuments(),
        ContactEnquiry.countDocuments({ status: 'new' }),
        ContactEnquiry.countDocuments({ status: 'read' }),
        ContactEnquiry.countDocuments({ status: 'in-progress' }),
        ContactEnquiry.countDocuments({ status: 'responded' }),
        ContactEnquiry.countDocuments({ status: 'closed' }),
        ContactEnquiry.countDocuments({ status: 'spam' }),
        ContactEnquiry.aggregate([
          { $group: { _id: '$serviceType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        ContactEnquiry.aggregate([
          { $group: { _id: '$inquiryType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        ContactEnquiry.aggregate([
          { $group: { _id: '$priority', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        ContactEnquiry.aggregate([
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': -1, '_id.month': -1 } },
          { $limit: 12 }
        ]),
        ContactEnquiry.countDocuments({ 'followUp.isRequired': true, 'followUp.completed': false })
      ]);

      res.json({
        success: true,
        data: {
          total,
          byStatus: {
            new: newEnquiries,
            read: readEnquiries,
            inProgress: inProgressEnquiries,
            responded: respondedEnquiries,
            closed: closedEnquiries,
            spam: spamEnquiries
          },
          byServiceType,
          byInquiryType,
          byPriority,
          monthlyStats,
          pendingFollowUps
        }
      });
    } catch (error) {
      console.error('Get enquiry stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Export enquiries to CSV
  static async exportEnquiries(req, res) {
    try {
      const { format = 'csv', startDate, endDate, status, serviceType } = req.query;
      
      let filter = {};
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
      if (status) filter.status = status;
      if (serviceType) filter.serviceType = serviceType;

      const enquiries = await ContactEnquiry.find(filter)
        .populate('response.respondedBy', 'username email')
        .sort({ createdAt: -1 });
      
      if (format === 'csv') {
        // Create CSV content
        const csvHeader = 'ID,Name,Email,Phone,Company,Position,Subject,Service Type,Inquiry Type,Priority,Status,City,Region,Country,Created At,Response Date,Response Method\n';
        const csvRows = enquiries.map(e => {
          const responseDate = e.response?.respondedAt ? new Date(e.response.respondedAt).toISOString().split('T')[0] : '';
          const responseMethod = e.response?.responseMethod || '';
          return `"${e._id}","${e.personalInfo.name}","${e.personalInfo.email}","${e.personalInfo.phone}","${e.personalInfo.company || ''}","${e.personalInfo.position || ''}","${e.subject}","${e.serviceType}","${e.inquiryType}","${e.priority}","${e.status}","${e.location.city || ''}","${e.location.region || ''}","${e.location.country}","${new Date(e.createdAt).toISOString().split('T')[0]}","${responseDate}","${responseMethod}"`;
        }).join('\n');
        
        const csvContent = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=enquiries_${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csvContent);
      } else {
        // JSON format
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=enquiries_${new Date().toISOString().split('T')[0]}.json`);
        res.json({
          success: true,
          data: enquiries.map(e => e.toAdminJSON()),
          exportedAt: new Date(),
          totalCount: enquiries.length
        });
      }
    } catch (error) {
      console.error('Export enquiries error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get dashboard quick stats for enquiries
  static async getDashboardStats(req, res) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      
      const [
        todayEnquiries,
        pendingEnquiries,
        urgentEnquiries,
        overdueFollowUps
      ] = await Promise.all([
        ContactEnquiry.countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }),
        ContactEnquiry.countDocuments({
          status: { $in: ['new', 'read', 'in-progress'] }
        }),
        ContactEnquiry.countDocuments({ priority: 'urgent' }),
        ContactEnquiry.countDocuments({
          'followUp.isRequired': true,
          'followUp.completed': false,
          'followUp.scheduledDate': { $lt: new Date() }
        })
      ]);

      res.json({
        success: true,
        data: {
          todayEnquiries,
          pendingEnquiries,
          urgentEnquiries,
          overdueFollowUps
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = EnquiryController;
