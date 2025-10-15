const Contract = require('../../models/Contract');
const { catchAsync } = require('../../utils/helpers');
const { AppError } = require('../../middleware/errorHandler');

/**
 * Get all published contracts
 */
const getAllContracts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  
  const filter = {
    isActive: true,
    isPublished: true
  };
  
  if (status) filter.status = status;
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const contracts = await Contract.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Contract.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    contracts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit: parseInt(limit)
    }
  });
});

/**
 * Get contract by ID
 */
const getContractById = catchAsync(async (req, res) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    isActive: true,
    isPublished: true
  });
  
  if (!contract) {
    throw new AppError('Contract not found', 404);
  }
  
  res.status(200).json({
    success: true,
    contract
  });
});

/**
 * Get contracts by status
 */
const getContractsByStatus = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const filter = {
    status: req.params.status,
    isActive: true,
    isPublished: true
  };
  
  const skip = (page - 1) * limit;
  
  const contracts = await Contract.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Contract.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    contracts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit: parseInt(limit)
    }
  });
});

module.exports = {
  getAllContracts,
  getContractById,
  getContractsByStatus
};
