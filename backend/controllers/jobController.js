const JobOpening = require('../models/JobOpening');
const JobApplication = require('../models/JobApplication');
const EmailService = require('../services/emailService');

class JobController {
  // Get all jobs with filters and pagination
  static async getAllJobs(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        department,
        category,
        jobType,
        experienceLevel,
        location,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {};

      // Apply filters
      if (status) query.status = status;
      if (department) query.department = department;
      if (category) query.category = category;
      if (jobType) query.jobType = jobType;
      if (experienceLevel) query.experienceLevel = experienceLevel;
      if (location) query['locations.city'] = { $regex: location, $options: 'i' };

      // Search in title and description
      if (search) {
        query.$or = [
          { 'title.en': { $regex: search, $options: 'i' } },
          { 'description.en': { $regex: search, $options: 'i' } },
          { jobCode: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const [jobs, totalJobs] = await Promise.all([
        JobOpening.find(query)
          .populate('postedBy', 'fullName email')
          .populate('assignedRecruiter', 'fullName email')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        JobOpening.countDocuments(query)
      ]);

      res.status(200).json({
        success: true,
        data: jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
          totalJobs,
          jobsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch jobs',
        error: error.message
      });
    }
  }

  // Get active jobs (public endpoint)
  static async getActiveJobs(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        department,
        location,
        jobType,
        search
      } = req.query;

      const query = {
        status: 'active',
        visibility: { $in: ['public', 'internal'] },
        applicationDeadline: { $gte: new Date() }
      };

      if (department) query.department = department;
      if (location) query['locations.city'] = { $regex: location, $options: 'i' };
      if (jobType) query.jobType = jobType;
      if (search) {
        query.$or = [
          { 'title.en': { $regex: search, $options: 'i' } },
          { 'summary.en': { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [jobs, totalJobs] = await Promise.all([
        JobOpening.find(query)
          .select('-hiringStages -postedBy -assignedRecruiter')
          .sort({ featuredJob: -1, createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        JobOpening.countDocuments(query)
      ]);

      res.status(200).json({
        success: true,
        data: jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
          totalJobs
        }
      });
    } catch (error) {
      console.error('Error fetching active jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch active jobs',
        error: error.message
      });
    }
  }

  // Get featured jobs
  static async getFeaturedJobs(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const jobs = await JobOpening.getFeaturedJobs(limit);

      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured jobs',
        error: error.message
      });
    }
  }

  // Get single job by ID or slug
  static async getJobById(req, res) {
    try {
      const { id } = req.params;
      
      // Try to find by ID first, then by slug
      let job = await JobOpening.findById(id)
        .populate('postedBy', 'fullName email')
        .populate('assignedRecruiter', 'fullName email');
      
      if (!job) {
        job = await JobOpening.findOne({ slug: id })
          .populate('postedBy', 'fullName email')
          .populate('assignedRecruiter', 'fullName email');
      }

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Increment view count
      await job.incrementViewCount();

      res.status(200).json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job',
        error: error.message
      });
    }
  }

  // Create new job
  static async createJob(req, res) {
    try {
      const jobData = req.body;
      
      // Set default hiring stages if not provided
      if (!jobData.hiringStages || jobData.hiringStages.length === 0) {
        jobData.hiringStages = [
          { name: 'Application Screening', description: 'Initial review of application', order: 1 },
          { name: 'Phone Interview', description: 'Initial phone screening', order: 2 },
          { name: 'In-Person Interview', description: 'Face-to-face interview', order: 3 },
          { name: 'Technical Assessment', description: 'Skills evaluation', order: 4 },
          { name: 'Final Interview', description: 'Final decision interview', order: 5 },
          { name: 'Offer', description: 'Job offer extended', order: 6 }
        ];
      }

      // Set created by and posted by
      if (req.user) {
        jobData.createdBy = req.user._id;
        jobData.postedBy = req.user._id;
      }

      const job = new JobOpening(jobData);
      await job.save();

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job
      });
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create job',
        error: error.message
      });
    }
  }

  // Update job
  static async updateJob(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const job = await JobOpening.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Job updated successfully',
        data: job
      });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update job',
        error: error.message
      });
    }
  }

  // Delete job
  static async deleteJob(req, res) {
    try {
      const { id } = req.params;

      // Check if there are applications for this job
      const applicationsCount = await JobApplication.countDocuments({ jobId: id });
      
      if (applicationsCount > 0 && req.query.force !== 'true') {
        return res.status(400).json({
          success: false,
          message: `Cannot delete job with ${applicationsCount} applications. Use force=true to delete anyway.`,
          applicationsCount
        });
      }

      const job = await JobOpening.findByIdAndDelete(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete job',
        error: error.message
      });
    }
  }

  // Bulk update jobs
  static async bulkUpdateJobs(req, res) {
    try {
      const { jobIds, updates } = req.body;

      if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid job IDs'
        });
      }

      const result = await JobOpening.updateMany(
        { _id: { $in: jobIds } },
        { $set: updates }
      );

      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} jobs updated successfully`,
        data: result
      });
    } catch (error) {
      console.error('Error bulk updating jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk update jobs',
        error: error.message
      });
    }
  }

  // Clone job
  static async cloneJob(req, res) {
    try {
      const { id } = req.params;
      const originalJob = await JobOpening.findById(id);

      if (!originalJob) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      const jobData = originalJob.toObject();
      delete jobData._id;
      delete jobData.jobCode;
      delete jobData.slug;
      delete jobData.createdAt;
      delete jobData.updatedAt;
      delete jobData.viewCount;
      delete jobData.applicationCount;
      
      // Update title to indicate it's a copy
      jobData.title.en = `${jobData.title.en} (Copy)`;
      if (jobData.title.ar) {
        jobData.title.ar = `${jobData.title.ar} (نسخة)`;
      }
      
      jobData.status = 'draft';
      if (req.user) {
        jobData.createdBy = req.user._id;
      }

      const newJob = new JobOpening(jobData);
      await newJob.save();

      res.status(201).json({
        success: true,
        message: 'Job cloned successfully',
        data: newJob
      });
    } catch (error) {
      console.error('Error cloning job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clone job',
        error: error.message
      });
    }
  }

  // Get job statistics
  static async getJobStatistics(req, res) {
    try {
      const [
        totalJobs,
        activeJobs,
        draftJobs,
        filledJobs,
        expiredJobs,
        totalApplications,
        jobsByDepartment,
        jobsByType,
        urgentJobs
      ] = await Promise.all([
        JobOpening.countDocuments(),
        JobOpening.countDocuments({ status: 'active', applicationDeadline: { $gte: new Date() } }),
        JobOpening.countDocuments({ status: 'draft' }),
        JobOpening.countDocuments({ status: 'filled' }),
        JobOpening.countDocuments({ status: 'active', applicationDeadline: { $lt: new Date() } }),
        JobApplication.countDocuments(),
        JobOpening.aggregate([
          { $group: { _id: '$department', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        JobOpening.aggregate([
          { $group: { _id: '$jobType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        JobOpening.countDocuments({ urgentHiring: true, status: 'active' })
      ]);

      res.status(200).json({
        success: true,
        data: {
          overview: {
            totalJobs,
            activeJobs,
            draftJobs,
            filledJobs,
            expiredJobs,
            urgentJobs,
            totalApplications
          },
          jobsByDepartment,
          jobsByType
        }
      });
    } catch (error) {
      console.error('Error fetching job statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job statistics',
        error: error.message
      });
    }
  }

  // Get jobs expiring soon
  static async getExpiringJobs(req, res) {
    try {
      const days = parseInt(req.query.days) || 7;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const jobs = await JobOpening.find({
        status: 'active',
        applicationDeadline: {
          $gte: new Date(),
          $lte: endDate
        }
      })
      .sort({ applicationDeadline: 1 })
      .populate('assignedRecruiter', 'fullName email');

      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      console.error('Error fetching expiring jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch expiring jobs',
        error: error.message
      });
    }
  }

  // Update job status
  static async updateJobStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const job = await JobOpening.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.status(200).json({
        success: true,
        message: `Job status updated to ${status}`,
        data: job
      });
    } catch (error) {
      console.error('Error updating job status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update job status',
        error: error.message
      });
    }
  }
}

module.exports = JobController;

