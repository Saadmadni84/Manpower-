const JobApplication = require('../models/JobApplication');
const JobOpening = require('../models/JobOpening');
const Interview = require('../models/Interview');
const EmailService = require('../services/emailService');
const { deleteFile, deleteFiles } = require('../middleware/cvUpload');

class ApplicationController {
  // Get all applications with filters
  static async getAllApplications(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        jobId,
        status,
        source,
        assignedRecruiter,
        search,
        dateFrom,
        dateTo,
        sortBy = 'submittedAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {};

      // Apply filters
      if (jobId) query.jobId = jobId;
      if (status) query.status = status;
      if (source) query.source = source;
      if (assignedRecruiter) query.assignedRecruiter = assignedRecruiter;

      // Date range filter
      if (dateFrom || dateTo) {
        query.submittedAt = {};
        if (dateFrom) query.submittedAt.$gte = new Date(dateFrom);
        if (dateTo) query.submittedAt.$lte = new Date(dateTo);
      }

      // Search in name and email
      if (search) {
        query.$or = [
          { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
          { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
          { 'personalInfo.email': { $regex: search, $options: 'i' } },
          { applicationId: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const [applications, totalApplications] = await Promise.all([
        JobApplication.find(query)
          .populate('jobId', 'title jobCode department status')
          .populate('assignedRecruiter', 'fullName email')
          .populate('interviews')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        JobApplication.countDocuments(query)
      ]);

      res.status(200).json({
        success: true,
        data: applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalApplications / parseInt(limit)),
          totalApplications,
          applicationsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch applications',
        error: error.message
      });
    }
  }

  // Get single application by ID
  static async getApplicationById(req, res) {
    try {
      const { id } = req.params;

      const application = await JobApplication.findById(id)
        .populate('jobId')
        .populate('assignedRecruiter', 'fullName email')
        .populate({
          path: 'interviews',
          populate: {
            path: 'interviewers.userId',
            select: 'fullName email'
          }
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch application',
        error: error.message
      });
    }
  }

  // Submit new application (public endpoint)
  static async submitApplication(req, res) {
    try {
      const applicationData = req.body;
      
      // Validate job exists and is active
      const job = await JobOpening.findById(applicationData.jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      if (job.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Job is not accepting applications'
        });
      }

      if (new Date() > job.applicationDeadline) {
        return res.status(400).json({
          success: false,
          message: 'Application deadline has passed'
        });
      }

      // Check for duplicate application
      const existingApplication = await JobApplication.findOne({
        jobId: applicationData.jobId,
        'personalInfo.email': applicationData.personalInfo.email
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for this position'
        });
      }

      // Handle file uploads (files should be in req.files from multer middleware)
      if (req.files) {
        if (req.files.cv) {
          applicationData.files = applicationData.files || {};
          applicationData.files.cv = {
            filename: req.files.cv[0].filename,
            originalName: req.files.cv[0].originalname,
            path: req.files.cv[0].path,
            size: req.files.cv[0].size
          };
        }

        if (req.files.coverLetter) {
          applicationData.files.coverLetter = {
            filename: req.files.coverLetter[0].filename,
            originalName: req.files.coverLetter[0].originalname,
            path: req.files.coverLetter[0].path,
            size: req.files.coverLetter[0].size
          };
        }

        if (req.files.additionalDocuments) {
          applicationData.files.additionalDocuments = req.files.additionalDocuments.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            type: 'other'
          }));
        }
      }

      const application = new JobApplication(applicationData);
      await application.save();

      // Increment job application count
      await job.incrementApplicationCount();

      // Send confirmation email to candidate
      try {
        await EmailService.sendApplicationConfirmation(application, job);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      // Send notification to recruiter
      try {
        const recruiter = job.assignedRecruiter;
        if (recruiter) {
          await EmailService.sendNewApplicationToRecruiter(application, job, recruiter);
        }
      } catch (emailError) {
        console.error('Failed to send recruiter notification:', emailError);
      }

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: {
          applicationId: application.applicationId,
          _id: application._id
        }
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit application',
        error: error.message
      });
    }
  }

  // Update application
  static async updateApplication(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const application = await JobApplication.findByIdAndUpdate(
        id,
        { ...updates, lastUpdated: new Date(), updatedBy: req.user?._id },
        { new: true, runValidators: true }
      ).populate('jobId', 'title jobCode');

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        data: application
      });
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update application',
        error: error.message
      });
    }
  }

  // Update application status
  static async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes, sendNotification = true } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const application = await JobApplication.findById(id).populate('jobId');

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      const previousStatus = application.status;
      application.status = status;
      application.updatedBy = req.user?._id;
      application.lastUpdated = new Date();

      await application.save();

      // Send status update email to candidate
      if (sendNotification) {
        try {
          await EmailService.sendStatusUpdate(application, application.jobId, status, notes);
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError);
        }
      }

      res.status(200).json({
        success: true,
        message: `Application status updated from ${previousStatus} to ${status}`,
        data: application
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update application status',
        error: error.message
      });
    }
  }

  // Add evaluation to application
  static async addEvaluation(req, res) {
    try {
      const { id } = req.params;
      const evaluationData = req.body;

      const application = await JobApplication.findById(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      await application.addEvaluation(evaluationData);

      res.status(200).json({
        success: true,
        message: 'Evaluation added successfully',
        data: application
      });
    } catch (error) {
      console.error('Error adding evaluation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add evaluation',
        error: error.message
      });
    }
  }

  // Add communication log
  static async addCommunication(req, res) {
    try {
      const { id } = req.params;
      const communicationData = req.body;

      const application = await JobApplication.findById(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      if (req.user) {
        communicationData.sentBy = req.user._id;
      }

      await application.addCommunication(communicationData);

      res.status(200).json({
        success: true,
        message: 'Communication logged successfully',
        data: application
      });
    } catch (error) {
      console.error('Error adding communication:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add communication',
        error: error.message
      });
    }
  }

  // Assign recruiter to application
  static async assignRecruiter(req, res) {
    try {
      const { id } = req.params;
      const { recruiterId } = req.body;

      const application = await JobApplication.findByIdAndUpdate(
        id,
        { 
          assignedRecruiter: recruiterId,
          updatedBy: req.user?._id,
          lastUpdated: new Date()
        },
        { new: true }
      ).populate('assignedRecruiter', 'fullName email');

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Recruiter assigned successfully',
        data: application
      });
    } catch (error) {
      console.error('Error assigning recruiter:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign recruiter',
        error: error.message
      });
    }
  }

  // Bulk update applications
  static async bulkUpdateApplications(req, res) {
    try {
      const { applicationIds, updates } = req.body;

      if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid application IDs'
        });
      }

      const updateData = { 
        ...updates, 
        lastUpdated: new Date(),
        updatedBy: req.user?._id
      };

      const result = await JobApplication.updateMany(
        { _id: { $in: applicationIds } },
        { $set: updateData }
      );

      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} applications updated successfully`,
        data: result
      });
    } catch (error) {
      console.error('Error bulk updating applications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk update applications',
        error: error.message
      });
    }
  }

  // Get application statistics
  static async getApplicationStatistics(req, res) {
    try {
      const { jobId, dateFrom, dateTo } = req.query;
      
      const dateFilter = {};
      if (dateFrom || dateTo) {
        dateFilter.submittedAt = {};
        if (dateFrom) dateFilter.submittedAt.$gte = new Date(dateFrom);
        if (dateTo) dateFilter.submittedAt.$lte = new Date(dateTo);
      }

      const jobFilter = jobId ? { jobId } : {};
      const query = { ...jobFilter, ...dateFilter };

      const [
        totalApplications,
        applicationsByStatus,
        applicationsBySource,
        recentApplications,
        averageExperience
      ] = await Promise.all([
        JobApplication.countDocuments(query),
        JobApplication.aggregate([
          { $match: query },
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        JobApplication.aggregate([
          { $match: query },
          { $group: { _id: '$source', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        JobApplication.find(query)
          .sort({ submittedAt: -1 })
          .limit(5)
          .populate('jobId', 'title jobCode'),
        JobApplication.aggregate([
          { $match: query },
          { $group: { 
            _id: null, 
            avgExperience: { $avg: '$professional.totalExperience' }
          }}
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          overview: {
            totalApplications,
            averageExperience: averageExperience[0]?.avgExperience || 0
          },
          applicationsByStatus,
          applicationsBySource,
          recentApplications
        }
      });
    } catch (error) {
      console.error('Error fetching application statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch application statistics',
        error: error.message
      });
    }
  }

  // Delete application
  static async deleteApplication(req, res) {
    try {
      const { id } = req.params;

      const application = await JobApplication.findById(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      // Delete associated files
      const filesToDelete = [];
      if (application.files.cv) filesToDelete.push(application.files.cv.path);
      if (application.files.coverLetter) filesToDelete.push(application.files.coverLetter.path);
      if (application.files.additionalDocuments) {
        application.files.additionalDocuments.forEach(doc => {
          filesToDelete.push(doc.path);
        });
      }

      if (filesToDelete.length > 0) {
        try {
          await deleteFiles(filesToDelete);
        } catch (fileError) {
          console.error('Error deleting files:', fileError);
        }
      }

      // Delete associated interviews
      if (application.interviews && application.interviews.length > 0) {
        await Interview.deleteMany({ _id: { $in: application.interviews } });
      }

      await JobApplication.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Application deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete application',
        error: error.message
      });
    }
  }

  // Schedule interview for application
  static async scheduleInterview(req, res) {
    try {
      const { id } = req.params;
      const interviewData = req.body;

      const application = await JobApplication.findById(id).populate('jobId');

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      interviewData.applicationId = application._id;
      interviewData.jobId = application.jobId._id;
      if (req.user) {
        interviewData.createdBy = req.user._id;
      }

      const interview = new Interview(interviewData);
      await interview.save();

      // Add interview to application
      application.interviews.push(interview._id);
      application.status = 'interview_scheduled';
      application.lastUpdated = new Date();
      await application.save();

      // Send interview invitation email
      try {
        await EmailService.sendInterviewSchedule(application, application.jobId, interview);
      } catch (emailError) {
        console.error('Failed to send interview invitation:', emailError);
      }

      res.status(201).json({
        success: true,
        message: 'Interview scheduled successfully',
        data: interview
      });
    } catch (error) {
      console.error('Error scheduling interview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to schedule interview',
        error: error.message
      });
    }
  }

  // Export applications to CSV
  static async exportApplications(req, res) {
    try {
      const { jobId, status } = req.query;
      const query = {};
      
      if (jobId) query.jobId = jobId;
      if (status) query.status = status;

      const applications = await JobApplication.find(query)
        .populate('jobId', 'title jobCode')
        .sort({ submittedAt: -1 });

      // Convert to CSV format
      const csvHeaders = [
        'Application ID',
        'Name',
        'Email',
        'Phone',
        'Job Title',
        'Experience (Years)',
        'Education',
        'Expected Salary',
        'Status',
        'Source',
        'Submitted Date'
      ];

      const csvData = applications.map(app => [
        app.applicationId,
        `${app.personalInfo.firstName} ${app.personalInfo.lastName}`,
        app.personalInfo.email,
        app.personalInfo.phone,
        app.jobId?.title?.en || 'N/A',
        app.professional.totalExperience,
        app.education[0]?.level || 'N/A',
        app.professional.expectedSalary,
        app.status,
        app.source,
        new Date(app.submittedAt).toLocaleDateString()
      ]);

      const csv = [csvHeaders, ...csvData].map(row => row.join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=applications-${Date.now()}.csv`);
      res.status(200).send(csv);
    } catch (error) {
      console.error('Error exporting applications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export applications',
        error: error.message
      });
    }
  }
}

module.exports = ApplicationController;

