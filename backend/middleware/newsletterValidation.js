const { body, param, query } = require('express-validator');

/**
 * Newsletter subscription validation
 */
const validateNewsletterSubscription = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
  
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .trim(),
  
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .trim(),
  
  body('preferences.jobAlerts')
    .optional()
    .isBoolean()
    .withMessage('Job alerts preference must be a boolean value'),
  
  body('preferences.companyNews')
    .optional()
    .isBoolean()
    .withMessage('Company news preference must be a boolean value'),
  
  body('preferences.industryUpdates')
    .optional()
    .isBoolean()
    .withMessage('Industry updates preference must be a boolean value'),
  
  body('source')
    .optional()
    .isIn(['footer', 'popup', 'contact_page', 'career_page', 'admin'])
    .withMessage('Invalid subscription source')
];

/**
 * Newsletter unsubscription validation
 */
const validateNewsletterUnsubscription = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
  
  query('reason')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Unsubscribe reason cannot exceed 200 characters')
    .trim()
];

/**
 * Footer section validation
 */
const validateFooterSection = [
  param('section')
    .isIn(['company_info', 'quick_links', 'services', 'contact', 'social_media', 'legal', 'newsletter'])
    .withMessage('Invalid footer section'),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .custom((value) => {
      if (typeof value !== 'object' || value === null) {
        throw new Error('Content must be an object');
      }
      
      // Validate that content has both English and Arabic versions
      if (!value.en && !value.ar) {
        throw new Error('Content must have at least English (en) or Arabic (ar) version');
      }
      
      return true;
    }),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  
  body('displayOrder')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Display order must be a number between 0 and 100')
];

/**
 * Quick contact form validation
 */
const validateQuickContact = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('subject')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters')
    .trim(),
  
  body('message')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .trim(),
  
  body('source')
    .optional()
    .isIn(['footer', 'contact_page', 'popup'])
    .withMessage('Invalid contact source')
];

/**
 * Rate limiting for newsletter subscription
 */
const newsletterRateLimit = (req, res, next) => {
  const email = req.body.email;
  const ipAddress = req.ip || req.connection.remoteAddress;
  
  // Simple in-memory rate limiting (in production, use Redis)
  if (!global.newsletterRateLimit) {
    global.newsletterRateLimit = new Map();
  }
  
  const key = `${email}_${ipAddress}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 3;
  
  const attempts = global.newsletterRateLimit.get(key) || { count: 0, resetTime: now + windowMs };
  
  if (attempts.resetTime < now) {
    // Reset window
    attempts.count = 0;
    attempts.resetTime = now + windowMs;
  }
  
  if (attempts.count >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many subscription attempts. Please try again later.',
      retryAfter: Math.ceil((attempts.resetTime - now) / 1000)
    });
  }
  
  attempts.count++;
  global.newsletterRateLimit.set(key, attempts);
  
  next();
};

/**
 * Email domain validation (block disposable emails)
 */
const validateEmailDomain = [
  body('email').custom((value) => {
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ];
    
    const domain = value.split('@')[1];
    
    if (disposableDomains.includes(domain.toLowerCase())) {
      throw new Error('Disposable email addresses are not allowed');
    }
    
    return true;
  })
];

module.exports = {
  validateNewsletterSubscription,
  validateNewsletterUnsubscription,
  validateFooterSection,
  validateQuickContact,
  newsletterRateLimit,
  validateEmailDomain
};
