const Gallery = require('../models/Gallery');
const { deleteFromCloudinary } = require('../middleware/galleryUpload');

class GalleryController {
  // Get all gallery images with pagination and filtering
  static async getAllImages(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        category, 
        isFeatured, 
        isActive,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        startDate,
        endDate
      } = req.query;

      const filter = {};
      
      if (category) filter.category = category;
      if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
      if (isActive !== undefined) filter.isActive = isActive === 'true';
      
      // Date range filter
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
      
      // Search filter
      if (search) {
        filter.$or = [
          { 'title.en': { $regex: search, $options: 'i' } },
          { 'title.ar': { $regex: search, $options: 'i' } },
          { 'description.en': { $regex: search, $options: 'i' } },
          { 'description.ar': { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
          { keywords: { $in: [new RegExp(search, 'i')] } },
          { eventName: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const images = await Gallery.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('uploadedBy', 'name email')
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');

      const total = await Gallery.countDocuments(filter);
      
      res.json({
        success: true,
        data: { 
          images, 
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('Get images error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get image by ID
  static async getImageById(req, res) {
    try {
      const { id } = req.params;
      const image = await Gallery.findById(id)
        .populate('uploadedBy', 'name email')
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      res.json({
        success: true,
        data: { image }
      });
    } catch (error) {
      console.error('Get image error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Upload single image
  static async uploadImage(req, res) {
    try {
      if (!req.processedImage) {
        return res.status(400).json({
          success: false,
          message: 'No processed image data found'
        });
      }

      const {
        title,
        description,
        category,
        tags,
        keywords,
        displayOrder,
        isFeatured,
        displayOnHomepage,
        photoDate,
        eventName,
        location,
        altText
      } = req.body;

      const imageData = {
        ...req.processedImage,
        title: typeof title === 'string' ? JSON.parse(title) : title,
        description: typeof description === 'string' ? JSON.parse(description) : description,
        category: category || 'other',
        tags: typeof tags === 'string' ? JSON.parse(tags) : (tags || []),
        keywords: typeof keywords === 'string' ? JSON.parse(keywords) : (keywords || []),
        displayOrder: displayOrder || 0,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        displayOnHomepage: displayOnHomepage === 'true' || displayOnHomepage === true,
        photoDate: photoDate || null,
        eventName: eventName || '',
        location: location || '',
        altText: typeof altText === 'string' ? JSON.parse(altText) : altText,
        uploadedBy: req.user?.id,
        createdBy: req.user?.id,
        isActive: true
      };

      const image = new Gallery(imageData);
      await image.save();

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: { image }
      });
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error.message
      });
    }
  }

  // Bulk upload images
  static async bulkUpload(req, res) {
    try {
      if (!req.processedImages || req.processedImages.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No processed images found'
        });
      }

      const {
        category,
        tags,
        keywords,
        eventName,
        location,
        photoDate,
        isFeatured,
        displayOnHomepage
      } = req.body;

      const savedImages = [];
      const errors = [];

      for (let i = 0; i < req.processedImages.length; i++) {
        const processedImage = req.processedImages[i];
        
        if (processedImage.error) {
          errors.push({
            filename: processedImage.originalFilename,
            error: processedImage.error
          });
          continue;
        }

        try {
          const imageData = {
            ...processedImage,
            title: {
              en: processedImage.originalFilename.split('.')[0],
              ar: ''
            },
            description: {
              en: '',
              ar: ''
            },
            category: category || 'other',
            tags: typeof tags === 'string' ? JSON.parse(tags) : (tags || []),
            keywords: typeof keywords === 'string' ? JSON.parse(keywords) : (keywords || []),
            displayOrder: i,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            displayOnHomepage: displayOnHomepage === 'true' || displayOnHomepage === true,
            photoDate: photoDate || null,
            eventName: eventName || '',
            location: location || '',
            altText: {
              en: processedImage.originalFilename.split('.')[0],
              ar: ''
            },
            uploadedBy: req.user?.id,
            createdBy: req.user?.id,
            isActive: true
          };

          const image = new Gallery(imageData);
          await image.save();
          savedImages.push(image);
        } catch (error) {
          errors.push({
            filename: processedImage.originalFilename,
            error: error.message
          });
        }
      }

      res.status(201).json({
        success: true,
        message: `Successfully uploaded ${savedImages.length} images`,
        data: { 
          images: savedImages,
          errors: errors.length > 0 ? errors : undefined
        }
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        error: error.message
      });
    }
  }

  // Update gallery image
  static async updateImage(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      // Add updatedBy field
      if (req.user) {
        updateData.updatedBy = req.user.id;
      }

      const image = await Gallery.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      res.json({
        success: true,
        message: 'Image updated successfully',
        data: { image }
      });
    } catch (error) {
      console.error('Update image error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete gallery image
  static async deleteImage(req, res) {
    try {
      const { id } = req.params;
      const image = await Gallery.findById(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      // Delete from Cloudinary
      if (image.cloudinaryId) {
        await deleteFromCloudinary(image.cloudinaryId);
      }
      if (image.thumbnailCloudinaryId) {
        await deleteFromCloudinary(image.thumbnailCloudinaryId);
      }

      await Gallery.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      console.error('Delete image error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Bulk delete images
  static async bulkDelete(req, res) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image IDs provided'
        });
      }

      const images = await Gallery.find({ _id: { $in: ids } });
      
      // Delete from Cloudinary
      for (const image of images) {
        if (image.cloudinaryId) {
          await deleteFromCloudinary(image.cloudinaryId);
        }
        if (image.thumbnailCloudinaryId) {
          await deleteFromCloudinary(image.thumbnailCloudinaryId);
        }
      }

      const result = await Gallery.deleteMany({ _id: { $in: ids } });

      res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} images`,
        data: { deletedCount: result.deletedCount }
      });
    } catch (error) {
      console.error('Bulk delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete images'
      });
    }
  }

  // Update display order (bulk reorder)
  static async reorderImages(req, res) {
    try {
      const { updates } = req.body; // Array of { id, displayOrder }

      if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid update data'
        });
      }

      const bulkOps = updates.map(({ id, displayOrder }) => ({
        updateOne: {
          filter: { _id: id },
          update: { displayOrder }
        }
      }));

      await Gallery.bulkWrite(bulkOps);

      res.json({
        success: true,
        message: 'Display order updated successfully'
      });
    } catch (error) {
      console.error('Reorder images error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reorder images'
      });
    }
  }

  // Toggle image status
  static async toggleImageStatus(req, res) {
    try {
      const { id } = req.params;
      const image = await Gallery.findById(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      image.isActive = !image.isActive;
      if (req.user) {
        image.updatedBy = req.user.id;
      }
      await image.save();

      res.json({
        success: true,
        message: `Image ${image.isActive ? 'activated' : 'deactivated'} successfully`,
        data: { image }
      });
    } catch (error) {
      console.error('Toggle image status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Toggle featured status
  static async toggleFeatured(req, res) {
    try {
      const { id } = req.params;
      const image = await Gallery.findById(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      image.isFeatured = !image.isFeatured;
      if (req.user) {
        image.updatedBy = req.user.id;
      }
      await image.save();

      res.json({
        success: true,
        message: `Image ${image.isFeatured ? 'featured' : 'unfeatured'} successfully`,
        data: { image }
      });
    } catch (error) {
      console.error('Toggle featured error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get gallery categories with counts
  static async getCategories(req, res) {
    try {
      const categories = [
        { value: 'company_events', label: 'Company Events', icon: 'event', color: '#1976d2' },
        { value: 'projects', label: 'Projects', icon: 'construction', color: '#2e7d32' },
        { value: 'team_photos', label: 'Team Photos', icon: 'people', color: '#ed6c02' },
        { value: 'facilities', label: 'Facilities', icon: 'business', color: '#9c27b0' },
        { value: 'achievements', label: 'Achievements', icon: 'emoji_events', color: '#d32f2f' },
        { value: 'training', label: 'Training', icon: 'school', color: '#0288d1' },
        { value: 'awards', label: 'Awards', icon: 'military_tech', color: '#f57c00' },
        { value: 'client_visits', label: 'Client Visits', icon: 'handshake', color: '#795548' },
        { value: 'other', label: 'Other', icon: 'photo_library', color: '#607d8b' }
      ];

      // Get counts for each category
      const categoryCounts = await Gallery.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      const categoriesWithCounts = categories.map(cat => {
        const countData = categoryCounts.find(c => c._id === cat.value);
        return {
          ...cat,
          count: countData ? countData.count : 0
        };
      });
      
      res.json({
        success: true,
        data: { categories: categoriesWithCounts }
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get gallery statistics
  static async getStats(req, res) {
    try {
      const stats = await Gallery.getGalleryStats();
      
      // Get recent uploads
      const recentUploads = await Gallery.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title image thumbnail category createdAt');

      res.json({
        success: true,
        data: { 
          ...stats,
          recentUploads
        }
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Increment view count
  static async incrementView(req, res) {
    try {
      const { id } = req.params;
      const image = await Gallery.findById(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      await image.incrementViews();

      res.json({
        success: true,
        data: { views: image.stats.views }
      });
    } catch (error) {
      console.error('Increment view error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Increment download count
  static async incrementDownload(req, res) {
    try {
      const { id } = req.params;
      const image = await Gallery.findById(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      await image.incrementDownloads();

      res.json({
        success: true,
        data: { downloads: image.stats.downloads }
      });
    } catch (error) {
      console.error('Increment download error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = GalleryController;
