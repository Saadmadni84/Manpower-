const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const cvDir = path.join(uploadsDir, 'candidate-cvs');
const documentsDir = path.join(uploadsDir, 'documents');

[uploadsDir, cvDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for CVs and application documents
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine folder based on field name
    if (file.fieldname === 'cv') {
      cb(null, cvDir);
    } else if (file.fieldname === 'coverLetter' || file.fieldname === 'additionalDocuments') {
      cb(null, documentsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${file.fieldname}-${uniqueSuffix}-${sanitizedOriginalName}`;
    cb(null, filename);
  }
});

// File filter - only accept specific document types
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`), false);
  }
};

// File size limits
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB max file size
  files: 10 // Maximum 10 files per request
};

// Single CV upload middleware
const uploadCV = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: limits.fileSize }
}).single('cv');

// Multiple documents upload middleware (CV + cover letter + additional docs)
const uploadApplicationDocuments = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
}).fields([
  { name: 'cv', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
  { name: 'additionalDocuments', maxCount: 5 }
]);

// CV only with error handling
const cvUploadMiddleware = (req, res, next) => {
  uploadCV(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error occurred
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 10MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      // Other errors
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No CV file uploaded. Please upload a valid CV.'
      });
    }
    
    next();
  });
};

// Application documents with error handling
const applicationDocumentsMiddleware = (req, res, next) => {
  uploadApplicationDocuments(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error occurred
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 10MB per file.'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum allowed: CV (1), Cover Letter (1), Additional Documents (5).'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      // Other errors
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    // Check if CV file was uploaded (required)
    if (!req.files || !req.files.cv || req.files.cv.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'CV file is required. Please upload your CV.'
      });
    }
    
    next();
  });
};

// Utility function to delete uploaded files
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve(); // File doesn't exist, consider it deleted
    }
  });
};

// Utility to delete multiple files
const deleteFiles = async (filePaths) => {
  const deletePromises = filePaths.map(filePath => deleteFile(filePath));
  return Promise.all(deletePromises);
};

// Parse CV file info from request
const parseCVFileInfo = (file) => {
  return {
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    size: file.size,
    uploadDate: new Date()
  };
};

// Parse all application files from request
const parseApplicationFiles = (files) => {
  const result = {
    cv: null,
    coverLetter: null,
    additionalDocuments: []
  };
  
  if (files.cv && files.cv.length > 0) {
    result.cv = parseCVFileInfo(files.cv[0]);
  }
  
  if (files.coverLetter && files.coverLetter.length > 0) {
    const file = files.coverLetter[0];
    result.coverLetter = {
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size
    };
  }
  
  if (files.additionalDocuments && files.additionalDocuments.length > 0) {
    result.additionalDocuments = files.additionalDocuments.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      type: 'other' // Can be updated based on actual type
    }));
  }
  
  return result;
};

module.exports = {
  cvUploadMiddleware,
  applicationDocumentsMiddleware,
  deleteFile,
  deleteFiles,
  parseCVFileInfo,
  parseApplicationFiles
};

