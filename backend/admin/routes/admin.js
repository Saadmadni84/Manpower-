const express = require('express');
const router = express.Router();

// Import controllers
const AuthController = require('../controllers/AuthController');
const DashboardController = require('../controllers/DashboardController');
const ContentController = require('../controllers/ContentController');
const ContentManagementController = require('../controllers/ContentManagementController');
const ServiceController = require('../controllers/ServiceController');
const ClientController = require('../controllers/ClientController');
const CareerController = require('../controllers/CareerController');
const GalleryController = require('../controllers/GalleryController');
const EnquiryController = require('../controllers/EnquiryController');

// Import new career management routes
const jobsRoutes = require('../../routes/jobs');
const applicationsRoutes = require('../../routes/applications');
const interviewsRoutes = require('../../routes/interviews');

// Import settings routes
const settingsRoutes = require('./settings');

// Import admin user routes
const adminUsersRoutes = require('./adminUsers');

// Import middleware
const { authenticateAdmin, authorizeAdmin, rateLimitLogin } = require('../middleware/auth');
const { uploadImage, uploadCV, handleUploadError } = require('../middleware/upload');
const { 
  uploadSingle, 
  uploadMultiple, 
  processSingleImage, 
  processMultipleImages,
  handleUploadError: handleGalleryUploadError 
} = require('../middleware/galleryUpload');

// Auth routes
router.post('/login', rateLimitLogin, AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/profile', authenticateAdmin, AuthController.getProfile);
router.put('/change-password', authenticateAdmin, AuthController.changePassword);
router.get('/verify-token', authenticateAdmin, AuthController.verifyToken);

// Dashboard routes
router.get('/dashboard/stats', authenticateAdmin, DashboardController.getStats);
router.get('/dashboard/quick-stats', authenticateAdmin, DashboardController.getQuickStats);
router.get('/dashboard/recent-activity', authenticateAdmin, DashboardController.getRecentActivity);
router.get('/dashboard/overview', authenticateAdmin, DashboardController.getOverview);

// Content management routes (old - simple)
router.get('/content', authenticateAdmin, ContentController.getAllContent);
router.put('/content/:id', authenticateAdmin, ContentController.updateContent);

// Content management routes (new - comprehensive)
router.get('/content-management', authenticateAdmin, ContentManagementController.getAllContent);
router.get('/content-management/:section', authenticateAdmin, ContentManagementController.getContentBySection);
router.get('/content-management/:section/:key', authenticateAdmin, ContentManagementController.getContentItem);
router.put('/content-management/:section/:key', authenticateAdmin, ContentManagementController.updateContent);
router.post('/content-management/bulk-update', authenticateAdmin, ContentManagementController.bulkUpdateContent);
router.post('/content-management/upload-image', authenticateAdmin, uploadImage.single('image'), ContentManagementController.uploadContentImage);
router.delete('/content-management/image/:filename', authenticateAdmin, ContentManagementController.deleteContentImage);
router.get('/content-management/:section/:key/history', authenticateAdmin, ContentManagementController.getContentHistory);
router.get('/content-management/export', authenticateAdmin, ContentManagementController.exportContent);
router.post('/content-management/import', authenticateAdmin, ContentManagementController.importContent);

// Services management routes
router.get('/services', authenticateAdmin, ServiceController.getAllServices);
router.get('/services/:id', authenticateAdmin, ServiceController.getServiceById);
router.post('/services', authenticateAdmin, ServiceController.createService);
router.put('/services/:id', authenticateAdmin, ServiceController.updateService);
router.delete('/services/:id', authenticateAdmin, ServiceController.deleteService);
router.patch('/services/:id/toggle', authenticateAdmin, ServiceController.toggleServiceStatus);
router.post('/services/reorder', authenticateAdmin, ServiceController.reorderServices);

// Clients management routes
router.post('/clients/ensure-seeded', authenticateAdmin, ClientController.ensureSeeded);
router.get('/clients/stats', authenticateAdmin, ClientController.getClientStats);
router.get('/clients', authenticateAdmin, ClientController.getAllClients);
router.get('/clients/:id', authenticateAdmin, ClientController.getClientById);
router.post('/clients', authenticateAdmin, ClientController.createClient);
router.put('/clients/:id', authenticateAdmin, ClientController.updateClient);
router.delete('/clients/:id', authenticateAdmin, ClientController.deleteClient);
router.patch('/clients/:id/toggle', authenticateAdmin, ClientController.toggleClientStatus);

// Careers/Jobs management routes
router.get('/jobs', CareerController.getAllJobs); // Temporarily disabled auth for testing
router.get('/jobs/:id', CareerController.getJobById); // Temporarily disabled auth for testing
router.post('/jobs', CareerController.createJob); // Temporarily disabled auth for testing
router.put('/jobs/:id', CareerController.updateJob); // Temporarily disabled auth for testing
router.delete('/jobs/:id', CareerController.deleteJob); // Temporarily disabled auth for testing

// CV submissions routes
router.get('/cvs', authenticateAdmin, CareerController.getAllCVs);
router.get('/cvs/:id', authenticateAdmin, CareerController.getCVById);
router.put('/cvs/:id/status', authenticateAdmin, CareerController.updateCVStatus);
router.delete('/cvs/:id', authenticateAdmin, CareerController.deleteCV);
router.get('/cvs/stats', authenticateAdmin, CareerController.getCVStats);

// Gallery management routes
router.get('/gallery/stats', authenticateAdmin, GalleryController.getStats);
router.get('/gallery/categories', authenticateAdmin, GalleryController.getCategories);
router.get('/gallery', authenticateAdmin, GalleryController.getAllImages);
router.get('/gallery/:id', authenticateAdmin, GalleryController.getImageById);
router.post('/gallery/upload', authenticateAdmin, uploadSingle, handleGalleryUploadError, processSingleImage, GalleryController.uploadImage);
router.post('/gallery/bulk-upload', authenticateAdmin, uploadMultiple, handleGalleryUploadError, processMultipleImages, GalleryController.bulkUpload);
router.put('/gallery/:id', authenticateAdmin, GalleryController.updateImage);
router.put('/gallery/reorder', authenticateAdmin, GalleryController.reorderImages);
router.delete('/gallery/:id', authenticateAdmin, GalleryController.deleteImage);
router.post('/gallery/bulk-delete', authenticateAdmin, GalleryController.bulkDelete);
router.patch('/gallery/:id/toggle', authenticateAdmin, GalleryController.toggleImageStatus);
router.patch('/gallery/:id/featured', authenticateAdmin, GalleryController.toggleFeatured);
router.post('/gallery/:id/view', GalleryController.incrementView);
router.post('/gallery/:id/download', GalleryController.incrementDownload);

// Contact enquiries routes
router.get('/enquiries', authenticateAdmin, EnquiryController.getAllEnquiries);
router.get('/enquiries/stats', authenticateAdmin, EnquiryController.getEnquiryStats);
router.get('/enquiries/dashboard-stats', authenticateAdmin, EnquiryController.getDashboardStats);
router.get('/enquiries/export', authenticateAdmin, EnquiryController.exportEnquiries);
router.post('/enquiries/bulk-update', authenticateAdmin, EnquiryController.bulkUpdateEnquiries);
router.get('/enquiries/:id', authenticateAdmin, EnquiryController.getEnquiryById);
router.put('/enquiries/:id/status', authenticateAdmin, EnquiryController.updateEnquiryStatus);
router.post('/enquiries/:id/notes', authenticateAdmin, EnquiryController.addAdminNote);
router.post('/enquiries/:id/respond', authenticateAdmin, EnquiryController.respondToEnquiry);
router.post('/enquiries/:id/follow-up', authenticateAdmin, EnquiryController.scheduleFollowUp);
router.put('/enquiries/:id/follow-up/complete', authenticateAdmin, EnquiryController.completeFollowUp);
router.delete('/enquiries/:id', authenticateAdmin, EnquiryController.deleteEnquiry);

// Career Management - Jobs, Applications, and Interviews (New Comprehensive System)
router.use('/career/jobs', jobsRoutes);
router.use('/career/applications', applicationsRoutes);
router.use('/career/interviews', interviewsRoutes);

// Settings Management
router.use('/settings', settingsRoutes);

// Admin Users Management
router.use('/users', adminUsersRoutes);

// Protected route test
router.get('/protected', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Protected route accessed successfully',
    admin: req.admin.username
  });
});

module.exports = router;
