const multer = require('multer');
const path = require('path');
const { APP_CONSTANTS } = require('../config/constants');
const { configureCloudinary, uploadWithPreset } = require('../config/cloudinary');

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Memory storage for Cloudinary uploads
const memoryStorage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type based on field name
  if (file.fieldname === 'cv' || file.fieldname === 'resume') {
    if (APP_CONSTANTS.FILE_LIMITS.ALLOWED_CV_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for CV. Only PDF, DOC, and DOCX files are allowed.'), false);
    }
  } else if (file.fieldname === 'image' || file.fieldname === 'logo' || file.fieldname === 'icon') {
    if (APP_CONSTANTS.FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for image. Only JPEG, PNG, GIF, and WebP files are allowed.'), false);
    }
  } else if (file.fieldname === 'document' || file.fieldname === 'certificate') {
    if (APP_CONSTANTS.FILE_LIMITS.ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for document. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
    }
  } else {
    // Default to image types for other fields
    if (APP_CONSTANTS.FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'), false);
    }
  }
};

// File size limit function
const fileSizeLimit = (req, file, cb) => {
  if (file.fieldname === 'cv' || file.fieldname === 'resume') {
    if (file.size > APP_CONSTANTS.FILE_LIMITS.CV_MAX_SIZE) {
      cb(new Error('CV file size exceeds the maximum limit of 10MB.'), false);
    } else {
      cb(null, true);
    }
  } else if (file.fieldname === 'image' || file.fieldname === 'logo' || file.fieldname === 'icon') {
    if (file.size > APP_CONSTANTS.FILE_LIMITS.IMAGE_MAX_SIZE) {
      cb(new Error('Image file size exceeds the maximum limit of 5MB.'), false);
    } else {
      cb(null, true);
    }
  } else if (file.fieldname === 'document' || file.fieldname === 'certificate') {
    if (file.size > APP_CONSTANTS.FILE_LIMITS.DOCUMENT_MAX_SIZE) {
      cb(new Error('Document file size exceeds the maximum limit of 20MB.'), false);
    } else {
      cb(null, true);
    }
  } else {
    // Default to image size limit
    if (file.size > APP_CONSTANTS.FILE_LIMITS.IMAGE_MAX_SIZE) {
      cb(new Error('File size exceeds the maximum limit of 5MB.'), false);
    } else {
      cb(null, true);
    }
  }
};

// Multer configuration for local storage
const uploadLocal = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: APP_CONSTANTS.FILE_LIMITS.DOCUMENT_MAX_SIZE,
    files: 10
  }
});

// Multer configuration for Cloudinary uploads
const uploadCloudinary = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: APP_CONSTANTS.FILE_LIMITS.DOCUMENT_MAX_SIZE,
    files: 10
  }
});

// Middleware for single file upload (local)
const uploadSingleLocal = (fieldName) => {
  return uploadLocal.single(fieldName);
};

// Middleware for multiple files upload (local)
const uploadMultipleLocal = (fieldName, maxCount = 10) => {
  return uploadLocal.array(fieldName, maxCount);
};

// Middleware for single file upload (Cloudinary)
const uploadSingleCloudinary = (fieldName) => {
  return uploadCloudinary.single(fieldName);
};

// Middleware for multiple files upload (Cloudinary)
const uploadMultipleCloudinary = (fieldName, maxCount = 10) => {
  return uploadCloudinary.array(fieldName, maxCount);
};

// Middleware for mixed fields upload (Cloudinary)
const uploadFieldsCloudinary = (fields) => {
  return uploadCloudinary.fields(fields);
};

// Middleware for mixed fields upload (local)
const uploadFieldsLocal = (fields) => {
  return uploadLocal.fields(fields);
};

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files'
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

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file, preset) => {
  try {
    const result = await uploadWithPreset(file.buffer, preset);
    return result;
  } catch (error) {
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
};

// Helper function to process uploaded files
const processUploadedFiles = async (files, presets) => {
  const processedFiles = [];
  
  if (Array.isArray(files)) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preset = presets[i] || 'galleryImages';
      
      try {
        const result = await uploadToCloudinary(file, preset);
        processedFiles.push({
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format
        });
      } catch (error) {
        console.error(`Failed to process file ${file.originalname}:`, error);
        throw error;
      }
    }
  } else if (files) {
    const result = await uploadToCloudinary(files, presets[0] || 'galleryImages');
    processedFiles.push({
      originalname: files.originalname,
      mimetype: files.mimetype,
      size: files.size,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    });
  }
  
  return processedFiles;
};

// Middleware to handle file uploads with Cloudinary
const handleCloudinaryUpload = (preset) => {
  return async (req, res, next) => {
    try {
      if (req.files) {
        const files = Array.isArray(req.files) ? req.files : [req.files];
        const presets = Array(files.length).fill(preset);
        const processedFiles = await processUploadedFiles(files, presets);
        req.uploadedFiles = processedFiles;
      } else if (req.file) {
        const processedFiles = await processUploadedFiles(req.file, [preset]);
        req.uploadedFiles = processedFiles;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware to handle multiple file uploads with different presets
const handleMultipleCloudinaryUpload = (presets) => {
  return async (req, res, next) => {
    try {
      if (req.files) {
        const files = Array.isArray(req.files) ? req.files : [req.files];
        const processedFiles = await processUploadedFiles(files, presets);
        req.uploadedFiles = processedFiles;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware to validate file requirements
const validateFileRequirements = (requirements) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const requirement of requirements) {
      const { field, required, maxSize, allowedTypes } = requirement;
      
      if (required && !req.files && !req.file) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (req.files && req.files[field]) {
        const files = Array.isArray(req.files[field]) ? req.files[field] : [req.files[field]];
        
        for (const file of files) {
          if (maxSize && file.size > maxSize) {
            errors.push(`${field} file size exceeds ${maxSize} bytes`);
          }
          
          if (allowedTypes && !allowedTypes.includes(file.mimetype)) {
            errors.push(`${field} file type not allowed`);
          }
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'File validation failed',
        errors
      });
    }
    
    next();
  };
};

module.exports = {
  // Local upload middleware
  uploadSingleLocal,
  uploadMultipleLocal,
  uploadFieldsLocal,
  
  // Cloudinary upload middleware
  uploadSingleCloudinary,
  uploadMultipleCloudinary,
  uploadFieldsCloudinary,
  
  // Upload processing middleware
  handleCloudinaryUpload,
  handleMultipleCloudinaryUpload,
  handleUploadError,
  
  // Validation middleware
  validateFileRequirements,
  
  // Helper functions
  uploadToCloudinary,
  processUploadedFiles
};
