const Location = require('../../models/Location');
const { catchAsync } = require('../../utils/helpers');

/**
 * Get all active locations
 */
const getAllLocations = catchAsync(async (req, res) => {
  const locations = await Location.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 });
    
  res.status(200).json({
    success: true,
    locations
  });
});

module.exports = {
  getAllLocations
};
