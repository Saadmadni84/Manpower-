const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
const { configureCloudinary } = require('../../config/cloudinary');
configureCloudinary();

// Allowed image types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_COUNT = 20; // Maximum files in bulk upload

// Memory storage for processing before Cloudinary upload
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${ALLOWED_IMAGE_TYPES.join(', ')} are allowed.`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_COUNT
  }
});

// Single image upload
const uploadSingle = upload.single('image');

// Multiple images upload
const uploadMultiple = upload.array('images', MAX_FILES_COUNT);

// Handle multer errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: `Too many files. Maximum ${MAX_FILES_COUNT} files allowed`
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Generate thumbnail from image buffer
const generateThumbnail = async (imageBuffer, maxWidth = 300, maxHeight = 300) => {
  try {
    const thumbnail = await sharp(imageBuffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    return thumbnail;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    throw new Error('Failed to generate thumbnail');
  }
};

// Compress image
const compressImage = async (imageBuffer, quality = 85) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    
    let compressor = sharp(imageBuffer);
    
    // Resize if image is too large
    if (metadata.width > 2000 || metadata.height > 2000) {
      compressor = compressor.resize(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Compress based on format
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      compressor = compressor.jpeg({ quality });
    } else if (metadata.format === 'png') {
      compressor = compressor.png({ quality });
    } else if (metadata.format === 'webp') {
      compressor = compressor.webp({ quality });
    }
    
    return await compressor.toBuffer();
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error('Failed to compress image');
  }
};

// Get image metadata
const getImageMetadata = async (imageBuffer) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    console.error('Get metadata error:', error);
    throw new Error('Failed to get image metadata');
  }
};

// Upload to Cloudinary (fallback to local storage if Cloudinary fails)
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      // Fallback to local storage
      return uploadToLocal(buffer, options).then(resolve).catch(reject);
    }
    
    const uploadOptions = {
      folder: options.folder || 'gallery',
      resource_type: 'image',
      transformation: options.transformation || [],
      ...options
    };
    
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload failed, falling back to local storage:', error.message);
          // Fallback to local storage
          uploadToLocal(buffer, options).then(resolve).catch(reject);
        } else {
          resolve(result);
        }
      }
    );
    
    uploadStream.end(buffer);
  });
};

// Upload to local storage
const uploadToLocal = async (buffer, options = {}) => {
  const fs = require('fs').promises;
  const path = require('path');
  
  // Ensure upload directory exists
  const uploadDir = path.join(__dirname, '..', 'assets/uploads/gallery');
  await fs.mkdir(uploadDir, { recursive: true });
  
  // Generate filename
  const filename = `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
  const filepath = path.join(uploadDir, filename);
  
  // Write file
  await fs.writeFile(filepath, buffer);
  
  // Return local file info
  return {
    public_id: filename,
    secure_url: `/uploads/gallery/${filename}`,
    url: `/uploads/gallery/${filename}`,
    width: null,
    height: null,
    format: 'jpg',
    resource_type: 'image'
  };
};

// Process single image upload
const processSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    const file = req.file;
    
    // Get image metadata
    const metadata = await getImageMetadata(file.buffer);
    
    // Compress image if needed
    const compressedBuffer = await compressImage(file.buffer);
    
    // Generate thumbnail
    const thumbnailBuffer = await generateThumbnail(file.buffer);
    
    // Upload main image to Cloudinary
    const mainImageResult = await uploadToCloudinary(compressedBuffer, {
      folder: 'gallery/images',
      public_id: `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}`
    });
    
    // Upload thumbnail to Cloudinary
    const thumbnailResult = await uploadToCloudinary(thumbnailBuffer, {
      folder: 'gallery/thumbnails',
      public_id: `thumb_${Date.now()}_${Math.random().toString(36).substring(7)}`
    });
    
    // Attach processed data to request
    req.processedImage = {
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      dimensions: {
        width: metadata.width,
        height: metadata.height
      },
      image: mainImageResult.secure_url,
      cloudinaryId: mainImageResult.public_id,
      cloudinaryUrl: mainImageResult.secure_url,
      thumbnail: thumbnailResult.secure_url,
      thumbnailCloudinaryId: thumbnailResult.public_id,
      thumbnailCloudinaryUrl: thumbnailResult.secure_url
    };
    
    next();
  } catch (error) {
    console.error('Process single image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process image',
      error: error.message
    });
  }
};

// Process multiple images upload
const processMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }
    
    const files = req.files;
    const processedImages = [];
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Get image metadata
        const metadata = await getImageMetadata(file.buffer);
        
        // Compress image if needed
        const compressedBuffer = await compressImage(file.buffer);
        
        // Generate thumbnail
        const thumbnailBuffer = await generateThumbnail(file.buffer);
        
        // Upload main image to Cloudinary
        const mainImageResult = await uploadToCloudinary(compressedBuffer, {
          folder: 'gallery/images',
          public_id: `gallery_${Date.now()}_${i}_${Math.random().toString(36).substring(7)}`
        });
        
        // Upload thumbnail to Cloudinary
        const thumbnailResult = await uploadToCloudinary(thumbnailBuffer, {
          folder: 'gallery/thumbnails',
          public_id: `thumb_${Date.now()}_${i}_${Math.random().toString(36).substring(7)}`
        });
        
        processedImages.push({
          originalFilename: file.originalname,
          mimeType: file.mimetype,
          fileSize: file.size,
          dimensions: {
            width: metadata.width,
            height: metadata.height
          },
          image: mainImageResult.secure_url,
          cloudinaryId: mainImageResult.public_id,
          cloudinaryUrl: mainImageResult.secure_url,
          thumbnail: thumbnailResult.secure_url,
          thumbnailCloudinaryId: thumbnailResult.public_id,
          thumbnailCloudinaryUrl: thumbnailResult.secure_url
        });
      } catch (error) {
        console.error(`Failed to process image ${file.originalname}:`, error);
        processedImages.push({
          originalFilename: file.originalname,
          error: error.message,
          success: false
        });
      }
    }
    
    // Attach processed data to request
    req.processedImages = processedImages;
    
    next();
  } catch (error) {
    console.error('Process multiple images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process images',
      error: error.message
    });
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Delete from Cloudinary error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Validate image dimensions
const validateDimensions = (minWidth = 0, minHeight = 0, maxWidth = 5000, maxHeight = 5000) => {
  return async (req, res, next) => {
    try {
      if (req.file) {
        const metadata = await getImageMetadata(req.file.buffer);
        
        if (metadata.width < minWidth || metadata.height < minHeight) {
          return res.status(400).json({
            success: false,
            message: `Image dimensions too small. Minimum ${minWidth}x${minHeight}px required`
          });
        }
        
        if (metadata.width > maxWidth || metadata.height > maxHeight) {
          return res.status(400).json({
            success: false,
            message: `Image dimensions too large. Maximum ${maxWidth}x${maxHeight}px allowed`
          });
        }
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  processSingleImage,
  processMultipleImages,
  generateThumbnail,
  compressImage,
  getImageMetadata,
  uploadToCloudinary,
  uploadToLocal,
  deleteFromCloudinary,
  validateDimensions
};

