const Service = require('../../models/Service');
const { catchAsync } = require('../../utils/helpers');
const { AppError } = require('../../middleware/errorHandler');

/**
 * Get all published services
 */
const getAllServices = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, category, search } = req.query;
  
  const filter = {
    isActive: true,
    isPublished: true
  };
  
  if (category) filter.category = category;
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const services = await Service.find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Service.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    services,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit: parseInt(limit)
    }
  });
});

/**
 * Get service by ID
 */
const getServiceById = catchAsync(async (req, res) => {
  const service = await Service.findOne({
    _id: req.params.id,
    isActive: true,
    isPublished: true
  });
  
  if (!service) {
    throw new AppError('Service not found', 404);
  }
  
  res.status(200).json({
    success: true,
    service
  });
});

/**
 * Get services by category
 */
const getServicesByCategory = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const filter = {
    category: req.params.category,
    isActive: true,
    isPublished: true
  };
  
  const skip = (page - 1) * limit;
  
  const services = await Service.find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Service.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    services,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit: parseInt(limit)
    }
  });
});

module.exports = {
  getAllServices,
  getServiceById,
  getServicesByCategory
};
