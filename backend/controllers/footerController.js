const FooterContent = require('../models/FooterContent');
const Newsletter = require('../models/Newsletter');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Get all active footer content
 */
const getFooterContent = async (req, res) => {
  try {
    const content = await FooterContent.getActiveContent();
    
    if (!content || content.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No footer content found'
      });
    }

    // Format content for frontend
    const formattedContent = content.reduce((acc, item) => {
      acc[item.section] = item.content;
      return acc;
    }, {});

    res.json({
      success: true,
      data: formattedContent,
      message: 'Footer content retrieved successfully'
    });

  } catch (error) {
    logger.error('Error getting footer content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update footer content section
 */
const updateFooterSection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { section } = req.params;
    const { content } = req.body;
    const adminId = req.admin?.id || req.user?.id;

    let footerSection = await FooterContent.findOne({ section });

    if (!footerSection) {
      // Create new section
      footerSection = new FooterContent({
        section,
        content,
        updatedBy: adminId
      });
    } else {
      // Update existing section
      footerSection.content = content;
      footerSection.updatedBy = adminId;
    }

    await footerSection.save();

    res.json({
      success: true,
      data: footerSection.formattedContent,
      message: 'Footer section updated successfully'
    });

  } catch (error) {
    logger.error('Error updating footer section:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Newsletter subscription
 */
const subscribeNewsletter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, firstName, lastName, preferences, source } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    try {
      const subscription = await Newsletter.subscribe({
        email,
        firstName,
        lastName,
        preferences,
        source: source || 'footer',
        ipAddress,
        userAgent
      });

      logger.info(`Newsletter subscription successful: ${email}`);

      res.status(201).json({
        success: true,
        data: {
          email: subscription.email,
          fullName: subscription.fullName,
          subscriptionStatus: subscription.subscriptionStatus
        },
        message: 'Successfully subscribed to newsletter'
      });

    } catch (subscriptionError) {
      if (subscriptionError.message === 'Email already subscribed') {
        return res.status(409).json({
          success: false,
          message: 'Email already subscribed to newsletter'
        });
      }
      throw subscriptionError;
    }

  } catch (error) {
    logger.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Unsubscribe from newsletter
 */
const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const { reason } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    await Newsletter.unsubscribe(email, reason);

    logger.info(`Newsletter unsubscription: ${email}`);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    if (error.message === 'Subscription not found') {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    logger.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Quick contact form from footer
 */
const quickContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message, source } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Here you would typically send an email or save to database
    // For now, we'll just log it
    const contactData = {
      name,
      email,
      phone,
      subject,
      message,
      source: source || 'footer',
      ipAddress,
      userAgent,
      timestamp: new Date()
    };

    logger.info('Quick contact form submission:', contactData);

    // TODO: Implement email sending or database storage
    // await sendContactEmail(contactData);
    // await saveContactInquiry(contactData);

    res.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon.'
    });

  } catch (error) {
    logger.error('Error processing quick contact:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get newsletter statistics (Admin only)
 */
const getNewsletterStats = async (req, res) => {
  try {
    const stats = await Newsletter.getStats();

    res.json({
      success: true,
      data: stats,
      message: 'Newsletter statistics retrieved successfully'
    });

  } catch (error) {
    logger.error('Error getting newsletter stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get social media feeds (optional)
 */
const getSocialFeeds = async (req, res) => {
  try {
    // This would typically fetch from social media APIs
    // For now, return mock data
    const socialFeeds = {
      facebook: {
        posts: [],
        followers: 1250,
        lastUpdated: new Date()
      },
      twitter: {
        tweets: [],
        followers: 890,
        lastUpdated: new Date()
      },
      linkedin: {
        posts: [],
        followers: 2100,
        lastUpdated: new Date()
      },
      instagram: {
        posts: [],
        followers: 650,
        lastUpdated: new Date()
      }
    };

    res.json({
      success: true,
      data: socialFeeds,
      message: 'Social media feeds retrieved successfully'
    });

  } catch (error) {
    logger.error('Error getting social feeds:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getFooterContent,
  updateFooterSection,
  subscribeNewsletter,
  unsubscribeNewsletter,
  quickContact,
  getNewsletterStats,
  getSocialFeeds
};
