const Client = require('../../models/Client');
const { catchAsync } = require('../../utils/helpers');
const { AppError } = require('../../middleware/errorHandler');

/**
 * Get all published clients
 */
const getAllClients = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, industry, search } = req.query;
  
  const filter = {
    isActive: true,
    isPublished: true
  };
  
  if (industry) filter.industry = industry;
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const clients = await Client.find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Client.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    clients,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit: parseInt(limit)
    }
  });
});

/**
 * Get client by ID
 */
const getClientById = catchAsync(async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    isActive: true,
    isPublished: true
  });
  
  if (!client) {
    throw new AppError('Client not found', 404);
  }
  
  res.status(200).json({
    success: true,
    client
  });
});

/**
 * Get clients by industry
 */
const getClientsByIndustry = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const filter = {
    industry: req.params.industry,
    isActive: true,
    isPublished: true
  };
  
  const skip = (page - 1) * limit;
  
  const clients = await Client.find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Client.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    clients,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit: parseInt(limit)
    }
  });
});

module.exports = {
  getAllClients,
  getClientById,
  getClientsByIndustry
};
