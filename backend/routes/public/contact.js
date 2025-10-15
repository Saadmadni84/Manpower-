const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/public/contactController');
const EnquiryController = require('../../admin/controllers/EnquiryController');
const { validate } = require('../../middleware/validation');
const { contactFormLimiter } = require('../../middleware/rateLimiter');

// Contact routes
router.get('/info', contactController.getContactInfo);
router.post('/submit', 
  contactFormLimiter,
  EnquiryController.createEnquiry
);

module.exports = router;
