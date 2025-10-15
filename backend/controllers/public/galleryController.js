const GalleryCategory = require('../../models/GalleryCategory');
const GalleryImage = require('../../models/GalleryImage');
const { catchAsync } = require('../../utils/helpers');
const { AppError } = require('../../middleware/errorHandler');

/**
 * Get all active gallery categories
 */
const getCategories = catchAsync(async (req, res) => {
  const categories = await GalleryCategory.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 });
    
  res.status(200).json({
    success: true,
    categories
  });
});

/**
 * Get all published gallery images
 */
const getImages = catchAsync(async (req, res) => {
  const { page = 1, limit = 12, category } = req.query;
  
  const filter = {
    isActive: true,
    isPublished: true
  };
  
  if (category) filter.category = category;
  
  const skip = (page - 1) * limit;
  
  const images = await GalleryImage.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await GalleryImage.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    images,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit: parseInt(limit)
    }
  });
});

/**
 * Get images by category
 */
const getImagesByCategory = catchAsync(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  
  const filter = {
    category: req.params.category,
    isActive: true,
    isPublished: true
  };
  
  const skip = (page - 1) * limit;
  
  const images = await GalleryImage.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await GalleryImage.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    images,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit: parseInt(limit)
    }
  });
});

/**
 * Get gallery image by ID
 */
const getImageById = catchAsync(async (req, res) => {
  const image = await GalleryImage.findOne({
    _id: req.params.id,
    isActive: true,
    isPublished: true
  }).populate('category', 'name');
  
  if (!image) {
    throw new AppError('Gallery image not found', 404);
  }
  
  res.status(200).json({
    success: true,
    image
  });
});

module.exports = {
  getCategories,
  getImages,
  getImagesByCategory,
  getImageById
};
