const SiteContent = require('../models/SiteContent');

class ContentController {
  // Get all content
  static async getAllContent(req, res) {
    try {
      const content = await SiteContent.find().sort({ section: 1, content_key: 1 });
      
      res.json({
        success: true,
        data: { content }
      });
    } catch (error) {
      console.error('Get content error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update content
  static async updateContent(req, res) {
    try {
      const { id } = req.params;
      const { content_value_en, content_value_ar } = req.body;

      const content = await SiteContent.findByIdAndUpdate(
        id,
        { content_value_en, content_value_ar },
        { new: true }
      );

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

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
}

module.exports = ContentController;
