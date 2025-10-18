const FooterContent = require('../models/FooterContent');
const logger = require('../utils/logger');

/**
 * Get active footer content
 */
exports.getFooterContent = async (req, res) => {
  try {
    let footerContent = await FooterContent.findOne({ isActive: true });

    // If no footer content exists, create default
    if (!footerContent) {
      footerContent = await FooterContent.create({
        company: {
          name: 'Manpower Excellence Company',
          tagline: '25 Years of Manpower Excellence in Saudi Arabia',
          logo: '/logo.png'
        },
        quickLinks: [
          { label: 'Home', path: '/', order: 1 },
          { label: 'About Us', path: '/about', order: 2 },
          { label: 'Our Services', path: '/services', order: 3 },
          { label: 'Clients', path: '/clients', order: 4 },
          { label: 'Careers', path: '/careers', order: 5 },
          { label: 'Contact Us', path: '/contact', order: 6 }
        ],
        contact: {
          address: 'Riyadh, Kingdom of Saudi Arabia',
          phone: '+966 XX XXX XXXX',
          email: 'info@manpowerexcellence.com'
        },
        socialMedia: [
          { platform: 'LinkedIn', url: 'https://linkedin.com/company/yourcompany', icon: 'linkedin', order: 1 },
          { platform: 'Facebook', url: 'https://facebook.com/yourcompany', icon: 'facebook', order: 2 },
          { platform: 'Instagram', url: 'https://instagram.com/yourcompany', icon: 'instagram', order: 3 }
        ],
        copyright: {
          year: new Date().getFullYear(),
          text: 'All rights reserved.'
        },
        isActive: true
      });
    }

    res.json({
      success: true,
      data: footerContent
    });
  } catch (error) {
    logger.error('Error fetching footer content:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch footer content',
      error: error.message
    });
  }
};

/**
 * Update footer content (Admin only)
 */
exports.updateFooterContent = async (req, res) => {
  try {
    const { company, quickLinks, contact, socialMedia, copyright } = req.body;

    let footerContent = await FooterContent.findOne({ isActive: true });

    if (!footerContent) {
      footerContent = new FooterContent();
    }

    // Update fields if provided
    if (company) footerContent.company = { ...footerContent.company, ...company };
    if (quickLinks) footerContent.quickLinks = quickLinks;
    if (contact) footerContent.contact = { ...footerContent.contact, ...contact };
    if (socialMedia) footerContent.socialMedia = socialMedia;
    if (copyright) footerContent.copyright = { ...footerContent.copyright, ...copyright };

    await footerContent.save();

    logger.info('Footer content updated successfully', { userId: req.user?.id });

    res.json({
      success: true,
      message: 'Footer content updated successfully',
      data: footerContent
    });
  } catch (error) {
    logger.error('Error updating footer content:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to update footer content',
      error: error.message
    });
  }
};

/**
 * Get all footer content (Admin only - for management)
 */
exports.getAllFooterContent = async (req, res) => {
  try {
    const footerContents = await FooterContent.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: footerContents
    });
  } catch (error) {
    logger.error('Error fetching all footer content:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch footer content',
      error: error.message
    });
  }
};

/**
 * Toggle footer content active status (Admin only)
 */
exports.toggleFooterActive = async (req, res) => {
  try {
    const { id } = req.params;

    // Deactivate all footer content
    await FooterContent.updateMany({}, { isActive: false });

    // Activate the selected one
    const footerContent = await FooterContent.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!footerContent) {
      return res.status(404).json({
        success: false,
        message: 'Footer content not found'
      });
    }

    logger.info('Footer content activated', { id, userId: req.user?.id });

    res.json({
      success: true,
      message: 'Footer content activated successfully',
      data: footerContent
    });
  } catch (error) {
    logger.error('Error toggling footer active status:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to toggle footer status',
      error: error.message
    });
  }
};

