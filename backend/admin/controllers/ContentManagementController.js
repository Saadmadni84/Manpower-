const SiteContent = require('../models/SiteContent');
const path = require('path');
const fs = require('fs').promises;

class ContentManagementController {
  // Get all content
  static async getAllContent(req, res) {
    try {
      const content = await SiteContent.find()
        .populate('updatedBy', 'username email')
        .sort({ section: 1, contentKey: 1 });
      
      res.json({
        success: true,
        data: { content, count: content.length }
      });
    } catch (error) {
      console.error('Get all content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get content by section
  static async getContentBySection(req, res) {
    try {
      const { section } = req.params;
      
      const content = await SiteContent.find({ section })
        .populate('updatedBy', 'username email')
        .sort({ contentKey: 1 });
      
      res.json({
        success: true,
        data: { content, count: content.length }
      });
    } catch (error) {
      console.error('Get content by section error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single content item
  static async getContentItem(req, res) {
    try {
      const { section, key } = req.params;
      
      const content = await SiteContent.findOne({ 
        section, 
        contentKey: key 
      }).populate('updatedBy', 'username email');
      
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }
      
      res.json({
        success: true,
        data: { content }
      });
    } catch (error) {
      console.error('Get content item error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update content
  static async updateContent(req, res) {
    try {
      const { section, key } = req.params;
      const { contentValue, contentType } = req.body;
      const adminId = req.admin._id;

      // Validate content value
      if (!contentValue) {
        return res.status(400).json({
          success: false,
          message: 'Content value is required'
        });
      }

      // Find existing content or create new
      let content = await SiteContent.findOne({ section, contentKey: key });
      
      if (content) {
        // Update existing
        content.contentValue = contentValue;
        if (contentType) content.contentType = contentType;
        content.updatedBy = adminId;
        content.updatedAt = new Date();
        await content.save();
      } else {
        // Create new
        content = new SiteContent({
          section,
          contentKey: key,
          contentValue,
          contentType: contentType || 'text',
          updatedBy: adminId
        });
        await content.save();
      }

      await content.populate('updatedBy', 'username email');

      res.json({
        success: true,
        message: 'Content updated successfully',
        data: { content }
      });
    } catch (error) {
      console.error('Update content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Bulk update content
  static async bulkUpdateContent(req, res) {
    try {
      const { updates } = req.body; // Array of {section, key, contentValue, contentType}
      const adminId = req.admin._id;

      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Updates array is required'
        });
      }

      const results = [];
      const errors = [];

      for (const update of updates) {
        try {
          const { section, key, contentValue, contentType } = update;
          
          let content = await SiteContent.findOne({ 
            section, 
            contentKey: key 
          });
          
          if (content) {
            content.contentValue = contentValue;
            if (contentType) content.contentType = contentType;
            content.updatedBy = adminId;
            content.updatedAt = new Date();
            await content.save();
          } else {
            content = new SiteContent({
              section,
              contentKey: key,
              contentValue,
              contentType: contentType || 'text',
              updatedBy: adminId
            });
            await content.save();
          }
          
          results.push(content);
        } catch (err) {
          errors.push({
            section: update.section,
            key: update.key,
            error: err.message
          });
        }
      }

      res.json({
        success: true,
        message: `Updated ${results.length} items${errors.length > 0 ? `, ${errors.length} errors` : ''}`,
        data: { 
          updated: results.length,
          errors: errors.length > 0 ? errors : undefined
        }
      });
    } catch (error) {
      console.error('Bulk update content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Upload content image
  static async uploadContentImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const imageUrl = `/uploads/content/${req.file.filename}`;
      
      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          filename: req.file.filename,
          url: imageUrl,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete content image
  static async deleteContentImage(req, res) {
    try {
      const { filename } = req.params;
      const imagePath = path.join(__dirname, '../../uploads/content', filename);

      try {
        await fs.unlink(imagePath);
        res.json({
          success: true,
          message: 'Image deleted successfully'
        });
      } catch (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({
            success: false,
            message: 'Image not found'
          });
        }
        throw err;
      }
    } catch (error) {
      console.error('Delete image error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get content history/versions
  static async getContentHistory(req, res) {
    try {
      const { section, key } = req.params;
      
      // For now, just return the current version
      // In a full implementation, you'd have a ContentHistory model
      const content = await SiteContent.findOne({ section, contentKey: key })
        .populate('updatedBy', 'username email');
      
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      res.json({
        success: true,
        data: {
          history: [{
            version: 1,
            contentValue: content.contentValue,
            updatedBy: content.updatedBy,
            updatedAt: content.updatedAt
          }]
        }
      });
    } catch (error) {
      console.error('Get content history error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Export all content as JSON
  static async exportContent(req, res) {
    try {
      const content = await SiteContent.find().select('-__v');
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=content-export.json');
      res.json({
        success: true,
        exportDate: new Date(),
        data: content
      });
    } catch (error) {
      console.error('Export content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Import content from JSON
  static async importContent(req, res) {
    try {
      const { content } = req.body;
      const adminId = req.admin._id;

      if (!Array.isArray(content)) {
        return res.status(400).json({
          success: false,
          message: 'Content must be an array'
        });
      }

      let imported = 0;
      let updated = 0;
      let errors = 0;

      for (const item of content) {
        try {
          const existing = await SiteContent.findOne({
            section: item.section,
            contentKey: item.contentKey
          });

          if (existing) {
            existing.contentValue = item.contentValue;
            existing.contentType = item.contentType;
            existing.updatedBy = adminId;
            existing.updatedAt = new Date();
            await existing.save();
            updated++;
          } else {
            await SiteContent.create({
              ...item,
              updatedBy: adminId
            });
            imported++;
          }
        } catch (err) {
          console.error('Import item error:', err);
          errors++;
        }
      }

      res.json({
        success: true,
        message: `Import complete: ${imported} new, ${updated} updated, ${errors} errors`,
        data: { imported, updated, errors }
      });
    } catch (error) {
      console.error('Import content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ContentManagementController;
