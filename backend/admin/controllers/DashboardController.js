const AdminService = require('../models/Service');
const AdminClient = require('../models/Client');
const JobOpening = require('../../models/JobOpening');
const CVSubmission = require('../models/CVSubmission');
const Gallery = require('../models/Gallery');
const ContactEnquiry = require('../models/ContactEnquiry');
const SiteContent = require('../models/SiteContent');

class DashboardController {
  // Get comprehensive dashboard statistics
  static async getStats(req, res) {
    try {
      const [
        totalServices,
        activeServices,
        totalClients,
        activeJobs,
        totalJobs,
        pendingCVs,
        reviewedCVs,
        galleryImages,
        contactEnquiries,
        repliedEnquiries,
        allServices,
        allClients,
        allJobs,
        allCVs,
        activeContracts
      ] = await Promise.all([
        AdminService.countDocuments(),
        AdminService.countDocuments({ is_active: true }),
        AdminClient.countDocuments({ is_active: true }),
        JobOpening.countDocuments({ status: 'active' }),
        JobOpening.countDocuments(),
        CVSubmission.countDocuments({ status: 'new' }),
        CVSubmission.countDocuments({ status: 'reviewed' }),
        Gallery.countDocuments({ is_active: true }),
        ContactEnquiry.countDocuments({ status: 'new' }),
        ContactEnquiry.countDocuments({ status: 'replied' }),
        AdminService.countDocuments(),
        AdminClient.countDocuments(),
        JobOpening.countDocuments(),
        CVSubmission.countDocuments(),
        AdminClient.countDocuments({ is_active: true, contract_end: { $gte: new Date() } })
      ]);

      // Get recent activities with enhanced information
      const recentCVs = await CVSubmission.find()
        .populate('job_id', 'title_en')
        .sort({ submitted_at: -1 })
        .limit(5);

      const recentEnquiries = await ContactEnquiry.find()
        .sort({ created_at: -1 })
        .limit(5);

      const recentJobs = await JobOpening.find()
        .sort({ created_at: -1 })
        .limit(3);

      const recentServices = await AdminService.find()
        .sort({ created_at: -1 })
        .limit(3);

      const recentClients = await AdminClient.find()
        .sort({ created_at: -1 })
        .limit(3);

      const recentGallery = await Gallery.find()
        .sort({ created_at: -1 })
        .limit(3);

      // Format recent activities with user action
      const activities = [
        ...recentCVs.map(cv => ({
          type: 'cv',
          action: 'Created',
          entity: 'CV Submission',
          message: `New CV from ${cv.applicant_name} for ${cv.job_id?.title_en || 'Unknown Position'}`,
          timestamp: cv.submitted_at,
          id: cv._id,
          user: 'System'
        })),
        ...recentEnquiries.map(enquiry => ({
          type: 'enquiry',
          action: 'Created',
          entity: 'Contact Enquiry',
          message: `New enquiry from ${enquiry.name}: ${enquiry.subject}`,
          timestamp: enquiry.created_at,
          id: enquiry._id,
          user: 'System'
        })),
        ...recentJobs.map(job => ({
          type: 'job',
          action: 'Created',
          entity: 'Job Opening',
          message: `New job posted: ${job.title_en} in ${job.location}`,
          timestamp: job.created_at,
          id: job._id,
          user: 'Admin'
        })),
        ...recentServices.map(service => ({
          type: 'service',
          action: 'Created',
          entity: 'Service',
          message: `Service added: ${service.title_en}`,
          timestamp: service.created_at,
          id: service._id,
          user: 'Admin'
        })),
        ...recentClients.map(client => ({
          type: 'client',
          action: 'Created',
          entity: 'Client',
          message: `New client: ${client.name}`,
          timestamp: client.created_at,
          id: client._id,
          user: 'Admin'
        })),
        ...recentGallery.map(image => ({
          type: 'gallery',
          action: 'Created',
          entity: 'Gallery Image',
          message: `New image uploaded: ${image.title_en}`,
          timestamp: image.created_at,
          id: image._id,
          user: 'Admin'
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

      res.json({
        success: true,
        data: {
          stats: {
            totalServices: activeServices,
            totalClients,
            activeJobs,
            pendingCVs,
            galleryImages,
            contactEnquiries,
            activeContracts
          },
          extendedStats: {
            services: {
              total: totalServices,
              active: activeServices,
              inactive: totalServices - activeServices
            },
            clients: {
              total: allClients,
              active: totalClients
            },
            jobs: {
              total: totalJobs,
              active: activeJobs,
              filled: totalJobs - activeJobs
            },
            cvs: {
              total: allCVs,
              pending: pendingCVs,
              reviewed: reviewedCVs
            },
            enquiries: {
              total: contactEnquiries + repliedEnquiries,
              new: contactEnquiries,
              replied: repliedEnquiries
            },
            gallery: {
              total: galleryImages
            }
          },
          activities,
          timestamp: new Date()
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

  // Get quick stats for header
  static async getQuickStats(req, res) {
    try {
      const [pendingCVs, newEnquiries] = await Promise.all([
        CVSubmission.countDocuments({ status: 'new' }),
        ContactEnquiry.countDocuments({ status: 'new' })
      ]);

      res.json({
        success: true,
        data: {
          pendingCVs,
          newEnquiries,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Get quick stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get recent activity
  static async getRecentActivity(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;

      const [recentCVs, recentEnquiries, recentJobs] = await Promise.all([
        CVSubmission.find()
          .populate('job_id', 'title_en')
          .sort({ submitted_at: -1 })
          .limit(5),
        ContactEnquiry.find()
          .sort({ created_at: -1 })
          .limit(5),
        JobOpening.find()
          .sort({ created_at: -1 })
          .limit(5)
      ]);

      const activities = [
        ...recentCVs.map(cv => ({
          type: 'cv',
          action: 'Submitted',
          entity: 'CV Application',
          message: `${cv.applicant_name} applied for ${cv.job_id?.title_en || 'Unknown Position'}`,
          timestamp: cv.submitted_at,
          id: cv._id,
          user: cv.applicant_name
        })),
        ...recentEnquiries.map(enquiry => ({
          type: 'enquiry',
          action: 'Received',
          entity: 'Contact Enquiry',
          message: `${enquiry.name} sent enquiry: ${enquiry.subject}`,
          timestamp: enquiry.created_at,
          id: enquiry._id,
          user: enquiry.name
        })),
        ...recentJobs.map(job => ({
          type: 'job',
          action: 'Posted',
          entity: 'Job Opening',
          message: `Job posted: ${job.title_en}`,
          timestamp: job.created_at,
          id: job._id,
          user: 'Admin'
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);

      res.json({
        success: true,
        data: {
          activities,
          total: activities.length
        }
      });

    } catch (error) {
      console.error('Get recent activity error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get system overview
  static async getOverview(req, res) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [
        recentCVs,
        recentEnquiries,
        recentJobs,
        totalStats
      ] = await Promise.all([
        CVSubmission.countDocuments({ submitted_at: { $gte: thirtyDaysAgo } }),
        ContactEnquiry.countDocuments({ created_at: { $gte: thirtyDaysAgo } }),
        JobOpening.countDocuments({ created_at: { $gte: thirtyDaysAgo } }),
        Promise.all([
          AdminService.countDocuments({ is_active: true }),
          AdminClient.countDocuments({ is_active: true }),
          JobOpening.countDocuments({ status: 'active' }),
          CVSubmission.countDocuments({ status: 'new' }),
          Gallery.countDocuments({ is_active: true }),
          ContactEnquiry.countDocuments({ status: 'new' })
        ])
      ]);

      res.json({
        success: true,
        data: {
          overview: {
            last30Days: {
              cvSubmissions: recentCVs,
              enquiries: recentEnquiries,
              jobsPosted: recentJobs
            },
            current: {
              activeServices: totalStats[0],
              activeClients: totalStats[1],
              activeJobs: totalStats[2],
              pendingCVs: totalStats[3],
              galleryImages: totalStats[4],
              newEnquiries: totalStats[5]
            }
          },
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Get overview error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = DashboardController;
