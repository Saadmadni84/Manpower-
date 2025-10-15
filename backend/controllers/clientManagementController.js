const ClientManagement = require('../models/ClientManagement');
const path = require('path');
const fs = require('fs').promises;

class ClientManagementController {
  // GET /api/clients-management - Get all clients with pagination, filtering, sorting
  static async getAllClients(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        industry,
        companySize,
        status = 'active',
        isFeatured,
        relationshipCategory,
        minRevenue,
        maxRevenue,
        sortBy = 'name',
        sortOrder = 'asc'
      } = req.query;

      // Build query
      const query = { isDeleted: false };

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { displayName: { $regex: search, $options: 'i' } },
          { 'primaryContact.name': { $regex: search, $options: 'i' } },
          { 'primaryContact.email': { $regex: search, $options: 'i' } },
          { headquarters: { $regex: search, $options: 'i' } }
        ];
      }

      // Industry filter
      if (industry) {
        query.industry = Array.isArray(industry) ? { $in: industry } : industry;
      }

      // Company size filter
      if (companySize) {
        query.companySize = Array.isArray(companySize) ? { $in: companySize } : companySize;
      }

      // Status filter
      if (status !== 'all') {
        query.status = status;
      }

      // Featured filter
      if (isFeatured !== undefined) {
        query.isFeatured = isFeatured === 'true';
      }

      // Revenue filter
      if (minRevenue || maxRevenue) {
        query.totalRevenue = {};
        if (minRevenue) query.totalRevenue.$gte = parseFloat(minRevenue);
        if (maxRevenue) query.totalRevenue.$lte = parseFloat(maxRevenue);
      }

      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [clients, total] = await Promise.all([
        ClientManagement.find(query)
          .populate('servicesUsed', 'title_en icon')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        ClientManagement.countDocuments(query)
      ]);

      // Apply relationship category filter if needed (post-query)
      let filteredClients = clients;
      if (relationshipCategory) {
        filteredClients = clients.filter(client => {
          const duration = (new Date() - new Date(client.relationshipStart)) / (1000 * 60 * 60 * 24 * 365.25);
          if (relationshipCategory === 'new') return duration < 1;
          if (relationshipCategory === 'established') return duration >= 1 && duration < 3;
          if (relationshipCategory === 'long_term') return duration >= 3;
          return true;
        });
      }

      res.json({
        success: true,
        data: {
          clients: filteredClients,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all clients error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch clients',
        error: error.message
      });
    }
  }

  // GET /api/clients-management/stats - Get client statistics
  static async getStatistics(req, res) {
    try {
      const [
        basicStats,
        industryDistribution,
        newClientsThisMonth,
        topClients
      ] = await Promise.all([
        ClientManagement.getStatistics(),
        ClientManagement.getIndustryDistribution(),
        ClientManagement.countDocuments({
          isDeleted: false,
          createdAt: { $gte: new Date(new Date().setDate(1)) }
        }),
        ClientManagement.find({ isDeleted: false, status: 'active' })
          .sort({ totalRevenue: -1 })
          .limit(5)
          .select('name logo totalRevenue totalProjects')
          .lean()
      ]);

      res.json({
        success: true,
        data: {
          ...basicStats,
          newThisMonth: newClientsThisMonth,
          industryDistribution,
          topClients
        }
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }

  // GET /api/clients-management/:id - Get single client with full details
  static async getClientById(req, res) {
    try {
      const client = await ClientManagement.findOne({
        _id: req.params.id,
        isDeleted: false
      })
        .populate('servicesUsed')
        .populate('createdBy', 'username email')
        .populate('updatedBy', 'username email');

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      console.error('Get client by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch client',
        error: error.message
      });
    }
  }

  // POST /api/clients-management - Create new client
  static async createClient(req, res) {
    try {
      const clientData = {
        ...req.body,
        createdBy: req.admin?._id || req.body.createdBy
      };

      // Handle logo if uploaded
      if (req.file) {
        clientData.logo = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          thumbnail: req.file.thumbnail,
          size: req.file.size,
          mimetype: req.file.mimetype
        };
      }

      const client = new ClientManagement(clientData);
      await client.save();

      res.status(201).json({
        success: true,
        message: 'Client created successfully',
        data: client
      });
    } catch (error) {
      console.error('Create client error:', error);
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Client with this name already exists'
        });
      }

      res.status(400).json({
        success: false,
        message: 'Failed to create client',
        error: error.message
      });
    }
  }

  // PUT /api/clients-management/:id - Update client
  static async updateClient(req, res) {
    try {
      const updateData = {
        ...req.body,
        updatedBy: req.admin?._id || req.body.updatedBy
      };

      // Handle logo update if new file uploaded
      if (req.file) {
        updateData.logo = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          thumbnail: req.file.thumbnail,
          size: req.file.size,
          mimetype: req.file.mimetype
        };
      }

      const client = await ClientManagement.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        updateData,
        { new: true, runValidators: true }
      );

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      res.json({
        success: true,
        message: 'Client updated successfully',
        data: client
      });
    } catch (error) {
      console.error('Update client error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update client',
        error: error.message
      });
    }
  }

  // DELETE /api/clients-management/:id - Soft delete client
  static async deleteClient(req, res) {
    try {
      const client = await ClientManagement.findOne({
        _id: req.params.id,
        isDeleted: false
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      await client.softDelete(req.admin?._id);

      res.json({
        success: true,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      console.error('Delete client error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete client',
        error: error.message
      });
    }
  }

  // PUT /api/clients-management/reorder - Update display order
  static async reorderClients(req, res) {
    try {
      const { clientOrders } = req.body; // Array of {id, displayOrder}

      const updates = clientOrders.map(({ id, displayOrder }) =>
        ClientManagement.findByIdAndUpdate(id, { displayOrder })
      );

      await Promise.all(updates);

      res.json({
        success: true,
        message: 'Client order updated successfully'
      });
    } catch (error) {
      console.error('Reorder clients error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reorder clients',
        error: error.message
      });
    }
  }

  // PUT /api/clients-management/:id/feature-toggle - Toggle featured status
  static async toggleFeatured(req, res) {
    try {
      const client = await ClientManagement.findById(req.params.id);

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      client.isFeatured = !client.isFeatured;
      client.updatedBy = req.admin?._id;
      await client.save();

      res.json({
        success: true,
        message: `Client ${client.isFeatured ? 'featured' : 'unfeatured'} successfully`,
        data: { isFeatured: client.isFeatured }
      });
    } catch (error) {
      console.error('Toggle featured error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle featured status',
        error: error.message
      });
    }
  }

  // POST /api/clients-management/bulk-actions - Bulk operations
  static async bulkActions(req, res) {
    try {
      const { action, clientIds } = req.body;

      if (!clientIds || clientIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No clients selected'
        });
      }

      let result;
      switch (action) {
        case 'activate':
          result = await ClientManagement.updateMany(
            { _id: { $in: clientIds }, isDeleted: false },
            { status: 'active', updatedBy: req.admin?._id }
          );
          break;

        case 'deactivate':
          result = await ClientManagement.updateMany(
            { _id: { $in: clientIds }, isDeleted: false },
            { status: 'inactive', updatedBy: req.admin?._id }
          );
          break;

        case 'feature':
          result = await ClientManagement.updateMany(
            { _id: { $in: clientIds }, isDeleted: false },
            { isFeatured: true, updatedBy: req.admin?._id }
          );
          break;

        case 'unfeature':
          result = await ClientManagement.updateMany(
            { _id: { $in: clientIds }, isDeleted: false },
            { isFeatured: false, updatedBy: req.admin?._id }
          );
          break;

        case 'delete':
          const clients = await ClientManagement.find({
            _id: { $in: clientIds },
            isDeleted: false
          });
          await Promise.all(clients.map(c => c.softDelete(req.admin?._id)));
          result = { modifiedCount: clients.length };
          break;

        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid action'
          });
      }

      res.json({
        success: true,
        message: `Bulk ${action} completed successfully`,
        data: { affected: result.modifiedCount || clientIds.length }
      });
    } catch (error) {
      console.error('Bulk actions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to perform bulk action',
        error: error.message
      });
    }
  }

  // GET /api/clients-management/export - Export clients to CSV
  static async exportClients(req, res) {
    try {
      const { format = 'csv', fields, ...filters } = req.query;

      // Build query from filters
      const query = { isDeleted: false };
      if (filters.status && filters.status !== 'all') query.status = filters.status;
      if (filters.industry) query.industry = filters.industry;

      const clients = await ClientManagement.find(query)
        .populate('servicesUsed', 'title_en')
        .lean();

      // Default fields to export
      const defaultFields = [
        'name', 'displayName', 'industry', 'companySize', 'headquarters',
        'primaryContact.name', 'primaryContact.email', 'primaryContact.phone',
        'website', 'status', 'totalRevenue', 'totalProjects', 'relationshipStart'
      ];

      const exportFields = fields ? fields.split(',') : defaultFields;

      if (format === 'json') {
        return res.json({
          success: true,
          data: clients
        });
      }

      // Generate CSV
      const csv = this.generateCSV(clients, exportFields);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=clients-${Date.now()}.csv`);
      res.send(csv);
    } catch (error) {
      console.error('Export clients error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export clients',
        error: error.message
      });
    }
  }

  // Helper method to generate CSV
  static generateCSV(data, fields) {
    if (data.length === 0) return '';

    // Create headers
    const headers = fields.join(',');
    
    // Create rows
    const rows = data.map(item => {
      return fields.map(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        // Escape commas and quotes
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',');
    });

    return [headers, ...rows].join('\n');
  }
}

module.exports = ClientManagementController;

