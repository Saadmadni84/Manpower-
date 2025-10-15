const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { uploadSingle, uploadMultiple, handleUploadError } = require('../middleware/contentUpload');
const { authenticateToken } = require('../middleware/auth');

// Protect all routes - require authentication
router.use(authenticateToken);

// Pages management
router.get('/pages', contentController.getAllPages);
router.get('/pages/:page', contentController.getPageContent);
router.put('/pages/:page/metadata', contentController.updatePageMetadata);

// Content management
router.get('/content/:page', contentController.getPageContent);
router.put('/content/:page/:section', contentController.updatePageSection);
router.post('/content/bulk-update', contentController.bulkUpdateContent);

// Media upload
router.post('/upload-media', uploadSingle, handleUploadError, contentController.uploadMedia);
router.post('/upload-multiple', uploadMultiple, handleUploadError, contentController.uploadMedia);
router.delete('/delete-media', contentController.deleteMedia);

// Preview
router.get('/preview/:page', contentController.previewPage);

// Publishing
router.post('/publish', contentController.publishContent);
router.post('/save-draft', contentController.saveDraft);
router.get('/drafts', contentController.getDrafts);

// Version control
router.get('/history/:contentId', contentController.getContentHistory);
router.post('/revert/:contentId', contentController.revertToVersion);

// Search
router.get('/search', contentController.searchContent);

module.exports = router;
