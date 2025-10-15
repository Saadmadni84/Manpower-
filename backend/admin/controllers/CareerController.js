const JobOpening = require('../../models/JobOpening');
const CVSubmission = require('../models/CVSubmission');

class CareerController {
  // ===== JOB OPENINGS =====
  
  // Get all job openings
  static async getAllJobs(req, res) {
    try {
      const { status, location, department } = req.query;
      const filter = {};
      
      if (status) filter.status = status;
      if (department) filter.department = department;
      if (location) {
        filter['locations.city'] = { $regex: location, $options: 'i' };
      }

      const jobs = await JobOpening.find(filter)
        .populate('postedBy', 'fullName email')
        .sort({ createdAt: -1 });
      
      // Transform jobs to match frontend expectations
      const transformedJobs = jobs.map(job => ({
        _id: job._id,
        title: job.title.en,
        title_ar: job.title.ar,
        description: job.description.en,
        description_ar: job.description.ar,
        location: job.locations.map(loc => loc.city).join(', '),
        department: job.department,
        job_type: job.jobType,
        status: job.status,
        salary: job.salary ? `${job.salary.min || ''} - ${job.salary.max || ''} ${job.salary.currency}` : '',
        experience: `${job.experienceLevel} (${job.minExperience}${job.maxExperience ? '-' + job.maxExperience : '+'} years)`,
        jobCode: job.jobCode,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        applicationDeadline: job.applicationDeadline,
        numberOfPositions: job.numberOfPositions,
        urgentHiring: job.urgentHiring,
        featuredJob: job.featuredJob
      }));
      
      res.json({
        success: true,
        data: { jobs: transformedJobs, count: transformedJobs.length }
      });
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get job by ID
  static async getJobById(req, res) {
    try {
      const { id } = req.params;
      const job = await JobOpening.findById(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.json({
        success: true,
        data: { job }
      });
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new job
  static async createJob(req, res) {
    try {
      const jobData = req.body;
      
      // Transform frontend data to our new model structure
      const transformedJobData = {
        title: {
          en: jobData.title,
          ar: jobData.title_ar || ''
        },
        department: jobData.department || 'corporate_services',
        category: jobData.category || 'general_worker',
        jobType: jobData.job_type || 'full_time',
        workSchedule: jobData.workSchedule || 'day_shift',
        locations: jobData.location ? [{
          city: jobData.location,
          region: jobData.region || '',
          isRemote: false,
          isPrimary: true
        }] : [],
        summary: {
          en: jobData.shortDescription || jobData.description?.substring(0, 300) || '',
          ar: jobData.description_ar?.substring(0, 300) || ''
        },
        description: {
          en: jobData.description || '',
          ar: jobData.description_ar || ''
        },
        responsibilities: {
          en: jobData.requirements ? [jobData.requirements] : [],
          ar: []
        },
        requirements: {
          en: jobData.requirements ? [jobData.requirements] : [],
          ar: []
        },
        experienceLevel: jobData.experience || 'entry',
        minExperience: 0,
        educationLevel: 'high_school',
        salary: jobData.salary ? {
          min: parseInt(jobData.salary.split('-')[0]) || 0,
          max: parseInt(jobData.salary.split('-')[1]) || 0,
          currency: 'SAR',
          type: 'monthly'
        } : undefined,
        applicationDeadline: jobData.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        numberOfPositions: jobData.numberOfPositions || 1,
        status: jobData.status || 'draft',
        visibility: 'public',
        urgentHiring: jobData.urgentHiring || false,
        featuredJob: jobData.featuredJob || false
      };

      const job = new JobOpening(transformedJobData);
      await job.save();

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: { job }
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update job
  static async updateJob(req, res) {
    try {
      const { id } = req.params;
      const job = await JobOpening.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.json({
        success: true,
        message: 'Job updated successfully',
        data: { job }
      });
    } catch (error) {
      console.error('Update job error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete job
  static async deleteJob(req, res) {
    try {
      const { id } = req.params;
      const job = await JobOpening.findByIdAndDelete(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Also delete related CV submissions
      await CVSubmission.deleteMany({ job_id: id });

      res.json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // ===== CV SUBMISSIONS =====
  
  // Get all CV submissions
  static async getAllCVs(req, res) {
    try {
      const { status, job_id } = req.query;
      const filter = {};
      
      if (status) filter.status = status;
      if (job_id) filter.job_id = job_id;

      const cvs = await CVSubmission.find(filter)
        .populate('job_id', 'title_en title_ar location')
        .sort({ submitted_at: -1 });
      
      res.json({
        success: true,
        data: { cvs, count: cvs.length }
      });
    } catch (error) {
      console.error('Get CVs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get CV by ID
  static async getCVById(req, res) {
    try {
      const { id } = req.params;
      const cv = await CVSubmission.findById(id).populate('job_id');

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV not found'
        });
      }

      res.json({
        success: true,
        data: { cv }
      });
    } catch (error) {
      console.error('Get CV error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update CV status
  static async updateCVStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, review_notes } = req.body;

      const cv = await CVSubmission.findById(id);

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV not found'
        });
      }

      cv.status = status;
      if (review_notes) cv.review_notes = review_notes;
      if (status !== 'new') cv.reviewed_at = new Date();

      await cv.save();

      res.json({
        success: true,
        message: 'CV status updated successfully',
        data: { cv }
      });
    } catch (error) {
      console.error('Update CV status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete CV
  static async deleteCV(req, res) {
    try {
      const { id } = req.params;
      const cv = await CVSubmission.findByIdAndDelete(id);

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV not found'
        });
      }

      res.json({
        success: true,
        message: 'CV deleted successfully'
      });
    } catch (error) {
      console.error('Delete CV error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get CV statistics
  static async getCVStats(req, res) {
    try {
      const [total, newCVs, reviewed, shortlisted, rejected, hired] = await Promise.all([
        CVSubmission.countDocuments(),
        CVSubmission.countDocuments({ status: 'new' }),
        CVSubmission.countDocuments({ status: 'reviewed' }),
        CVSubmission.countDocuments({ status: 'shortlisted' }),
        CVSubmission.countDocuments({ status: 'rejected' }),
        CVSubmission.countDocuments({ status: 'hired' })
      ]);

      res.json({
        success: true,
        data: {
          total,
          byStatus: { newCVs, reviewed, shortlisted, rejected, hired }
        }
      });
    } catch (error) {
      console.error('Get CV stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = CareerController;
