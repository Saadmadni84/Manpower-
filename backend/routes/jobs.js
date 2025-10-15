const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/active', JobController.getActiveJobs);
router.get('/featured', JobController.getFeaturedJobs);
router.get('/:id/public', JobController.getJobById); // Public job details

// Protected routes (require authentication)
router.use(authenticateToken); // All routes below require authentication

// Get all jobs with filters
router.get('/', JobController.getAllJobs);

// Get job statistics
router.get('/statistics/overview', JobController.getJobStatistics);

// Get expiring jobs
router.get('/expiring/soon', JobController.getExpiringJobs);

// Get single job
router.get('/:id', JobController.getJobById);

// Create new job
router.post('/', JobController.createJob);

// Update job
router.put('/:id', JobController.updateJob);

// Update job status
router.patch('/:id/status', JobController.updateJobStatus);

// Clone job
router.post('/:id/clone', JobController.cloneJob);

// Bulk update jobs
router.patch('/bulk/update', JobController.bulkUpdateJobs);

// Delete job
router.delete('/:id', JobController.deleteJob);

module.exports = router;

