const AdminService = require('../models/Service');

class ServiceController {
  // Get all services
  static async getAllServices(req, res) {
    try {
      const services = await AdminService.find().sort({ display_order: 1, created_at: -1 });
      
      res.json({
        success: true,
        data: { services, count: services.length }
      });
    } catch (error) {
      console.error('Get services error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get service by ID
  static async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = await AdminService.findById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        data: { service }
      });
    } catch (error) {
      console.error('Get service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new service
  static async createService(req, res) {
    try {
      const {
        title_en,
        title_ar,
        description_en,
        description_ar,
        short_description_en,
        short_description_ar,
        icon,
        image,
        display_order
      } = req.body;

      const service = new AdminService({
        title_en,
        title_ar,
        description_en,
        description_ar,
        short_description_en,
        short_description_ar,
        icon: icon || '⚡',
        image: image || '',
        display_order: display_order || 0,
        is_active: true
      });

      await service.save();

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: { service }
      });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update service
  static async updateService(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const service = await AdminService.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        message: 'Service updated successfully',
        data: { service }
      });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete service
  static async deleteService(req, res) {
    try {
      const { id } = req.params;
      const service = await AdminService.findByIdAndDelete(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      console.error('Delete service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Toggle service status
  static async toggleServiceStatus(req, res) {
    try {
      const { id } = req.params;
      const service = await AdminService.findById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      service.is_active = !service.is_active;
      await service.save();

      res.json({
        success: true,
        message: `Service ${service.is_active ? 'activated' : 'deactivated'} successfully`,
        data: { service }
      });
    } catch (error) {
      console.error('Toggle service status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Reorder services
  static async reorderServices(req, res) {
    try {
      const { services } = req.body; // Array of { id, display_order }

      const updatePromises = services.map(({ id, display_order }) =>
        AdminService.findByIdAndUpdate(id, { display_order })
      );

      await Promise.all(updatePromises);

      res.json({
        success: true,
        message: 'Services reordered successfully'
      });
    } catch (error) {
      console.error('Reorder services error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ServiceController;
