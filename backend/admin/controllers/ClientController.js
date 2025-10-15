const AdminClient = require('../models/Client');

class ClientController {
  // Seed default clients if none exist (idempotent)
  static async ensureSeeded(req, res) {
    try {
      const existing = await AdminClient.countDocuments();
      if (existing > 0) {
        return res.json({ success: true, data: { seeded: false, count: existing } });
      }

      const clientsData = [
        { name: 'Saudi Aramco', industry: 'Oil & Gas', display_order: 1, is_active: true },
        { name: 'SABIC', industry: 'Manufacturing', display_order: 2, is_active: true },
        { name: 'King Abdulaziz International Airport', industry: 'Aviation', display_order: 3, is_active: true },
        { name: 'Al-Rajhi Bank', industry: 'Banking', display_order: 4, is_active: true },
        { name: 'NEOM Project', industry: 'Construction', display_order: 5, is_active: true },
        { name: 'Red Sea Global', industry: 'Tourism', display_order: 6, is_active: true },
        { name: 'Royal Commission for AlUla', industry: 'Heritage', display_order: 7, is_active: true },
        { name: 'King Fahd Hospital', industry: 'Healthcare', display_order: 8, is_active: true }
      ];

      const created = await AdminClient.insertMany(clientsData);
      return res.status(201).json({ success: true, data: { seeded: true, created: created.length } });
    } catch (error) {
      console.error('Ensure-seeded clients error:', error);
      return res.status(500).json({ success: false, message: 'Failed to seed clients' });
    }
  }
  // Get all clients with filtering and pagination
  static async getAllClients(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        industry,
        companySize,
        status,
        isFeatured,
        sortBy = 'display_order',
        sortOrder = 'asc'
      } = req.query;

      // Build query
      const query = {};

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { displayName: { $regex: search, $options: 'i' } },
          { headquarters: { $regex: search, $options: 'i' } },
          { 'primaryContact.name': { $regex: search, $options: 'i' } }
        ];
      }

      // Industry filter
      if (industry) {
        query.industry = industry;
      }

      // Company size filter
      if (companySize) {
        query.companySize = companySize;
      }

      // Status filter
      if (status !== undefined) {
        query.is_active = status === 'active';
      }

      // Featured filter
      if (isFeatured !== undefined) {
        query.isFeatured = isFeatured === 'true';
      }

      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [clients, total] = await Promise.all([
        AdminClient.find(query)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        AdminClient.countDocuments(query)
      ]);
      
      res.json({
        success: true,
        data: {
          clients,
          count: clients.length,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get clients error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get client statistics
  static async getClientStats(req, res) {
    try {
      const stats = await AdminClient.getStatistics();
      
      // Get new clients this month
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const newThisMonth = await AdminClient.countDocuments({
        created_at: { $gte: firstDayOfMonth }
      });

      res.json({
        success: true,
        data: {
          ...stats,
          newThisMonth
        }
      });
    } catch (error) {
      console.error('Get client stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get client by ID
  static async getClientById(req, res) {
    try {
      const { id } = req.params;
      const client = await AdminClient.findById(id);

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      res.json({
        success: true,
        data: { client }
      });
    } catch (error) {
      console.error('Get client error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new client
  static async createClient(req, res) {
    try {
      const {
        name,
        logo,
        website,
        industry,
        contract_start,
        contract_end,
        display_order
      } = req.body;

      const client = new AdminClient({
        name,
        logo: logo || '',
        website: website || '',
        industry,
        contract_start,
        contract_end,
        display_order: display_order || 0,
        is_active: true
      });

      await client.save();

      res.status(201).json({
        success: true,
        message: 'Client created successfully',
        data: { client }
      });
    } catch (error) {
      console.error('Create client error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update client
  static async updateClient(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const client = await AdminClient.findByIdAndUpdate(
        id,
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
        data: { client }
      });
    } catch (error) {
      console.error('Update client error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete client
  static async deleteClient(req, res) {
    try {
      const { id } = req.params;
      const client = await AdminClient.findByIdAndDelete(id);

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      res.json({
        success: true,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      console.error('Delete client error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Toggle client status
  static async toggleClientStatus(req, res) {
    try {
      const { id } = req.params;
      const client = await AdminClient.findById(id);

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      client.is_active = !client.is_active;
      await client.save();

      res.json({
        success: true,
        message: `Client ${client.is_active ? 'activated' : 'deactivated'} successfully`,
        data: { client }
      });
    } catch (error) {
      console.error('Toggle client status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ClientController;
