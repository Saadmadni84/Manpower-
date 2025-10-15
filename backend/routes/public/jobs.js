const express = require('express');
const router = express.Router();
const jobController = require('../../controllers/public/jobController');
const { validate } = require('../../middleware/validation');
const { jobApplicationSchemas } = require('../../middleware/validation');
const { jobApplicationLimiter } = require('../../middleware/rateLimiter');
const { uploadSingleCloudinary, handleUploadError } = require('../../middleware/upload');

// Job posting routes
router.get('/', jobController.getJobPostings);
router.get('/featured', jobController.getFeaturedJobs);
router.get('/search', jobController.searchJobs);
router.get('/categories', jobController.getJobCategories);
router.get('/industries', jobController.getIndustries);
router.get('/statistics', jobController.getJobStatistics);
router.get('/:slug', jobController.getJobPosting);

// Job application route
router.post('/:jobId/apply', 
  jobApplicationLimiter,
  uploadSingleCloudinary('cv'),
  validate(jobApplicationSchemas.create),
  jobController.applyForJob
);

// Error handling for file uploads
router.use(handleUploadError);

module.exports = router;
