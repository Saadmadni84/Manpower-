const WebsiteContent = require('../models/WebsiteContent');
const PageContent = require('../models/PageContent');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Get all pages with their content structure
exports.getAllPages = async (req, res) => {
  try {
    const pages = await PageContent.find()
      .sort({ page: 1 })
      .populate('updatedBy', 'username email')
      .lean();
    
    res.json({
      success: true,
      data: pages
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pages',
      error: error.message
    });
  }
};

// Get specific page with all its content
exports.getPageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { language = 'en', includeDrafts = false } = req.query;
    
    // Get page metadata
    const pageInfo = await PageContent.findOne({ page });
    
    // Build query for content
    const query = { page, isActive: true };
    if (!includeDrafts) {
      query.isDraft = false;
    }
    
    // Get all content for this page
    const content = await WebsiteContent.find(query)
      .sort({ section: 1, displayOrder: 1 })
      .populate('updatedBy', 'username email')
      .lean();
    
    // Organize content by sections
    const organizedContent = {};
    content.forEach(item => {
      if (!organizedContent[item.section]) {
        organizedContent[item.section] = [];
      }
      organizedContent[item.section].push({
        ...item,
        value: item.content[language] || item.content.en
      });
    });
    
    res.json({
      success: true,
      data: {
        pageInfo,
        content: organizedContent,
        rawContent: content
      }
    });
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching page content',
      error: error.message
    });
  }
};

// Update page section content
exports.updatePageSection = async (req, res) => {
  try {
    const { page, section } = req.params;
    const { contentKey, content, contentType, language = 'both' } = req.body;
    const userId = req.user._id;
    
    // Find existing content or create new
    let contentItem = await WebsiteContent.findOne({ page, section, contentKey });
    
    if (contentItem) {
      // Update existing content
      if (language === 'both') {
        contentItem.content.en = content.en;
        contentItem.content.ar = content.ar;
      } else {
        contentItem.content[language] = content;
      }
      contentItem.updatedBy = userId;
      contentItem.isDraft = true; // Mark as draft until published
    } else {
      // Create new content
      contentItem = new WebsiteContent({
        page,
        section,
        contentKey,
        content: language === 'both' ? content : { [language]: content },
        contentType: contentType || 'text',
        updatedBy: userId,
        createdBy: userId,
        isDraft: true
      });
    }
    
    await contentItem.save();
    
    res.json({
      success: true,
      message: 'Content updated successfully',
      data: contentItem
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message
    });
  }
};

// Bulk update multiple content items
exports.bulkUpdateContent = async (req, res) => {
  try {
    const { updates } = req.body; // Array of content updates
    const userId = req.user._id;
    
    const promises = updates.map(async (update) => {
      const { page, section, contentKey, content, contentType } = update;
      
      let contentItem = await WebsiteContent.findOne({ page, section, contentKey });
      
      if (contentItem) {
        contentItem.content = content;
        contentItem.updatedBy = userId;
        contentItem.isDraft = true;
      } else {
        contentItem = new WebsiteContent({
          page,
          section,
          contentKey,
          content,
          contentType: contentType || 'text',
          updatedBy: userId,
          createdBy: userId,
          isDraft: true
        });
      }
      
      return contentItem.save();
    });
    
    const results = await Promise.all(promises);
    
    res.json({
      success: true,
      message: `${results.length} content items updated successfully`,
      data: results
    });
  } catch (error) {
    console.error('Error bulk updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk updating content',
      error: error.message
    });
  }
};

// Upload media (images/videos)
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const { folder = 'website-content' } = req.body;
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, folder);
    
    res.json({
      success: true,
      message: 'Media uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      }
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading media',
      error: error.message
    });
  }
};

// Delete media
exports.deleteMedia = async (req, res) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }
    
    await deleteFromCloudinary(publicId);
    
    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting media',
      error: error.message
    });
  }
};

// Preview page content
exports.previewPage = async (req, res) => {
  try {
    const { page } = req.params;
    const { language = 'en' } = req.query;
    
    // Get all content including drafts
    const content = await WebsiteContent.getPageContent(page, language);
    const pageInfo = await PageContent.findOne({ page });
    
    res.json({
      success: true,
      data: {
        page: pageInfo,
        content
      }
    });
  } catch (error) {
    console.error('Error previewing page:', error);
    res.status(500).json({
      success: false,
      message: 'Error previewing page',
      error: error.message
    });
  }
};

// Publish content changes
exports.publishContent = async (req, res) => {
  try {
    const { contentIds, page } = req.body;
    const userId = req.user._id;
    
    let query = {};
    
    if (contentIds && contentIds.length > 0) {
      // Publish specific content items
      query._id = { $in: contentIds };
    } else if (page) {
      // Publish all draft content for a page
      query = { page, isDraft: true };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either contentIds or page must be provided'
      });
    }
    
    const result = await WebsiteContent.updateMany(
      query,
      { 
        isDraft: false,
        lastPublished: new Date(),
        updatedBy: userId
      }
    );
    
    // Update page publish status
    if (page) {
      await PageContent.findOneAndUpdate(
        { page },
        { 
          lastPublished: new Date(),
          isDraft: false,
          updatedBy: userId
        }
      );
    }
    
    res.json({
      success: true,
      message: `${result.modifiedCount} content items published successfully`,
      data: result
    });
  } catch (error) {
    console.error('Error publishing content:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing content',
      error: error.message
    });
  }
};

// Save as draft
exports.saveDraft = async (req, res) => {
  try {
    const { page, section, contentKey, content, contentType } = req.body;
    const userId = req.user._id;
    
    let contentItem = await WebsiteContent.findOne({ page, section, contentKey });
    
    if (contentItem) {
      contentItem.content = content;
      contentItem.updatedBy = userId;
      contentItem.isDraft = true;
    } else {
      contentItem = new WebsiteContent({
        page,
        section,
        contentKey,
        content,
        contentType: contentType || 'text',
        updatedBy: userId,
        createdBy: userId,
        isDraft: true
      });
    }
    
    await contentItem.save();
    
    res.json({
      success: true,
      message: 'Draft saved successfully',
      data: contentItem
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving draft',
      error: error.message
    });
  }
};

// Get content history/versions
exports.getContentHistory = async (req, res) => {
  try {
    const { contentId } = req.params;
    
    const content = await WebsiteContent.findById(contentId)
      .populate('previousVersions.savedBy', 'username email')
      .lean();
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        current: content,
        versions: content.previousVersions
      }
    });
  } catch (error) {
    console.error('Error fetching content history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content history',
      error: error.message
    });
  }
};

// Revert to previous version
exports.revertToVersion = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { versionIndex } = req.body;
    const userId = req.user._id;
    
    const content = await WebsiteContent.findById(contentId);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    if (!content.previousVersions[versionIndex]) {
      return res.status(400).json({
        success: false,
        message: 'Version not found'
      });
    }
    
    const previousVersion = content.previousVersions[versionIndex];
    content.content = previousVersion.content;
    content.updatedBy = userId;
    content.isDraft = true;
    
    await content.save();
    
    res.json({
      success: true,
      message: 'Content reverted successfully',
      data: content
    });
  } catch (error) {
    console.error('Error reverting content:', error);
    res.status(500).json({
      success: false,
      message: 'Error reverting content',
      error: error.message
    });
  }
};

// Update page metadata
exports.updatePageMetadata = async (req, res) => {
  try {
    const { page } = req.params;
    const updateData = req.body;
    const userId = req.user._id;
    
    let pageInfo = await PageContent.findOne({ page });
    
    if (!pageInfo) {
      pageInfo = new PageContent({
        page,
        ...updateData,
        createdBy: userId
      });
    } else {
      Object.assign(pageInfo, updateData);
    }
    
    pageInfo.updatedBy = userId;
    await pageInfo.save();
    
    res.json({
      success: true,
      message: 'Page metadata updated successfully',
      data: pageInfo
    });
  } catch (error) {
    console.error('Error updating page metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating page metadata',
      error: error.message
    });
  }
};

// Search content
exports.searchContent = async (req, res) => {
  try {
    const { query, page, section, contentType } = req.query;
    
    const searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { 'content.en': { $regex: query, $options: 'i' } },
        { 'content.ar': { $regex: query, $options: 'i' } },
        { contentKey: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (page) searchQuery.page = page;
    if (section) searchQuery.section = section;
    if (contentType) searchQuery.contentType = contentType;
    
    const results = await WebsiteContent.find(searchQuery)
      .limit(50)
      .sort({ updatedAt: -1 })
      .populate('updatedBy', 'username email');
    
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching content',
      error: error.message
    });
  }
};

// Get draft content
exports.getDrafts = async (req, res) => {
  try {
    const { page } = req.query;
    
    const query = { isDraft: true };
    if (page) query.page = page;
    
    const drafts = await WebsiteContent.find(query)
      .sort({ updatedAt: -1 })
      .populate('updatedBy', 'username email');
    
    res.json({
      success: true,
      count: drafts.length,
      data: drafts
    });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drafts',
      error: error.message
    });
  }
};

module.exports = exports;
