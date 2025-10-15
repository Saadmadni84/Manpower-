const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = [
  'assets/uploads/clients',
  'assets/uploads/services', 
  'assets/uploads/gallery',
  'assets/uploads/cvs'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    
    switch (req.route.path) {
      case '/clients/upload-logo':
        uploadPath = path.join(__dirname, '..', 'assets/uploads/clients');
        break;
      case '/services/upload-image':
        uploadPath = path.join(__dirname, '..', 'assets/uploads/services');
        break;
      case '/gallery/upload':
        uploadPath = path.join(__dirname, '..', 'assets/uploads/gallery');
        break;
      case '/careers/upload-cv':
        uploadPath = path.join(__dirname, '..', 'assets/uploads/cvs');
        break;
      default:
        uploadPath = path.join(__dirname, '..', 'assets/uploads');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// File filter for CVs
const cvFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.includes('pdf') || 
                   file.mimetype.includes('msword') || 
                   file.mimetype.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed for CVs!'));
  }
};

// Multer configurations
const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: imageFilter
});

const uploadCV = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for CVs
  },
  fileFilter: cvFilter
});

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB for images, 10MB for CVs.'
      });
    }
  }
  
  if (error.message.includes('Only')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

module.exports = {
  uploadImage,
  uploadCV,
  handleUploadError
};
