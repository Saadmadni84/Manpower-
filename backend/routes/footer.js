const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footerController');
const { 
  validateNewsletterSubscription, 
  validateNewsletterUnsubscription,
  validateFooterSection,
  validateQuickContact,
  newsletterRateLimit,
  validateEmailDomain
} = require('../middleware/newsletterValidation');
const { authenticateToken } = require('../middleware/auth');
const { checkRolePermission } = require('../middleware/rolePermission');

/**
 * @route   GET /api/footer/content
 * @desc    Get all active footer content
 * @access  Public
 */
router.get('/content', footerController.getFooterContent);

/**
 * @route   PUT /api/footer/content/:section
 * @desc    Update footer section content
 * @access  Private (Admin only)
 */
router.put('/content/:section', 
  authenticateToken, 
  checkRolePermission('admin'),
  validateFooterSection,
  footerController.updateFooterSection
);

/**
 * @route   POST /api/newsletter/subscribe
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post('/subscribe',
  newsletterRateLimit,
  validateEmailDomain,
  validateNewsletterSubscription,
  footerController.subscribeNewsletter
);

/**
 * @route   POST /api/newsletter/unsubscribe
 * @desc    Unsubscribe from newsletter
 * @access  Public
 */
router.post('/unsubscribe',
  validateNewsletterUnsubscription,
  footerController.unsubscribeNewsletter
);

/**
 * @route   POST /api/footer/contact-quick
 * @desc    Quick contact form from footer
 * @access  Public
 */
router.post('/contact-quick',
  validateQuickContact,
  footerController.quickContact
);

/**
 * @route   GET /api/footer/social-feeds
 * @desc    Get social media feeds (optional)
 * @access  Public
 */
router.get('/social-feeds', footerController.getSocialFeeds);

/**
 * @route   GET /api/newsletter/stats
 * @desc    Get newsletter statistics
 * @access  Private (Admin only)
 */
router.get('/stats',
  authenticateToken,
  checkRolePermission('admin'),
  footerController.getNewsletterStats
);

module.exports = router;
