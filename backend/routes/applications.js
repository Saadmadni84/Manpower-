const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/applicationController');
const { authenticateToken } = require('../middleware/auth');
const { applicationDocumentsMiddleware } = require('../middleware/cvUpload');

// Public routes (no authentication required)
// Submit application (with file upload)
router.post('/submit', applicationDocumentsMiddleware, ApplicationController.submitApplication);

// Protected routes (require authentication)
router.use(authenticateToken); // All routes below require authentication

// Get all applications with filters
router.get('/', ApplicationController.getAllApplications);

// Get application statistics
router.get('/statistics/overview', ApplicationController.getApplicationStatistics);

// Export applications to CSV
router.get('/export/csv', ApplicationController.exportApplications);

// Get single application
router.get('/:id', ApplicationController.getApplicationById);

// Update application
router.put('/:id', ApplicationController.updateApplication);

// Update application status
router.patch('/:id/status', ApplicationController.updateApplicationStatus);

// Add evaluation to application
router.post('/:id/evaluation', ApplicationController.addEvaluation);

// Add communication log
router.post('/:id/communication', ApplicationController.addCommunication);

// Assign recruiter
router.patch('/:id/assign-recruiter', ApplicationController.assignRecruiter);

// Schedule interview for application
router.post('/:id/schedule-interview', ApplicationController.scheduleInterview);

// Bulk update applications
router.patch('/bulk/update', ApplicationController.bulkUpdateApplications);

// Delete application
router.delete('/:id', ApplicationController.deleteApplication);

module.exports = router;

