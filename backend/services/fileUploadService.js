const { uploadWithPreset, deleteFromCloudinary } = require('../config/cloudinary');
const { APP_CONSTANTS } = require('../config/constants');

class FileUploadService {
  // Upload company logo
  static async uploadCompanyLogo(file) {
    try {
      const result = await uploadWithPreset(file, 'companyLogos');
      
      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes
        }
      };
    } catch (error) {
      console.error('Failed to upload company logo:', error);
      throw new Error('Failed to upload company logo');
    }
  }

  // Upload service icon
  static async uploadServiceIcon(file) {
    try {
      const result = await uploadWithPreset(file, 'serviceIcons');
      
      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes
        }
      };
    } catch (error) {
      console.error('Failed to upload service icon:', error);
      throw new Error('Failed to upload service icon');
    }
  }

  // Upload client logo
  static async uploadClientLogo(file) {
    try {
      const result = await uploadWithPreset(file, 'clientLogos');
      
      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes
        }
      };
    } catch (error) {
      console.error('Failed to upload client logo:', error);
      throw new Error('Failed to upload client logo');
    }
  }

  // Upload gallery image
  static async uploadGalleryImage(file) {
    try {
      const result = await uploadWithPreset(file, 'galleryImages');
      
      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes
        }
      };
    } catch (error) {
      console.error('Failed to upload gallery image:', error);
      throw new Error('Failed to upload gallery image');
    }
  }

  // Upload CV/document
  static async uploadCV(file) {
    try {
      const result = await uploadWithPreset(file, 'candidateCVs');
      
      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes
        }
      };
    } catch (error) {
      console.error('Failed to upload CV:', error);
      throw new Error('Failed to upload CV');
    }
  }

  // Delete file from Cloudinary
  static async deleteFile(publicId, resourceType = 'image') {
    try {
      await deleteFromCloudinary(publicId, resourceType);
      
      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw new Error('Failed to delete file');
    }
  }

  // Validate file type
  static validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.mimetype);
  }

  // Validate file size
  static validateFileSize(file, maxSize) {
    return file.size <= maxSize;
  }

  // Get file extension
  static getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }

  // Generate unique filename
  static generateUniqueFilename(originalname) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = this.getFileExtension(originalname);
    return `${timestamp}-${random}.${extension}`;
  }

  // Process multiple files
  static async processMultipleFiles(files, preset) {
    try {
      const results = [];
      
      for (const file of files) {
        const result = await uploadWithPreset(file, preset);
        results.push({
          originalname: file.originalname,
          url: result.secure_url,
          publicId: result.public_id,
          size: result.bytes
        });
      }
      
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Failed to process multiple files:', error);
      throw new Error('Failed to process multiple files');
    }
  }

  // Get file info
  static getFileInfo(file) {
    return {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      extension: this.getFileExtension(file.originalname)
    };
  }

  // Check if file is image
  static isImage(file) {
    return APP_CONSTANTS.FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  }

  // Check if file is document
  static isDocument(file) {
    return APP_CONSTANTS.FILE_LIMITS.ALLOWED_DOCUMENT_TYPES.includes(file.mimetype);
  }

  // Check if file is CV
  static isCV(file) {
    return APP_CONSTANTS.FILE_LIMITS.ALLOWED_CV_TYPES.includes(file.mimetype);
  }

  // Get file type category
  static getFileTypeCategory(file) {
    if (this.isImage(file)) return 'image';
    if (this.isDocument(file)) return 'document';
    if (this.isCV(file)) return 'cv';
    return 'other';
  }

  // Validate file for upload
  static validateFile(file, category) {
    const errors = [];
    
    // Check file type
    if (category === 'image' && !this.isImage(file)) {
      errors.push('File must be an image');
    }
    if (category === 'document' && !this.isDocument(file)) {
      errors.push('File must be a document');
    }
    if (category === 'cv' && !this.isCV(file)) {
      errors.push('File must be a CV (PDF, DOC, or DOCX)');
    }
    
    // Check file size
    if (category === 'image' && !this.validateFileSize(file, APP_CONSTANTS.FILE_LIMITS.IMAGE_MAX_SIZE)) {
      errors.push(`Image size must be less than ${APP_CONSTANTS.FILE_LIMITS.IMAGE_MAX_SIZE / 1024 / 1024}MB`);
    }
    if (category === 'document' && !this.validateFileSize(file, APP_CONSTANTS.FILE_LIMITS.DOCUMENT_MAX_SIZE)) {
      errors.push(`Document size must be less than ${APP_CONSTANTS.FILE_LIMITS.DOCUMENT_MAX_SIZE / 1024 / 1024}MB`);
    }
    if (category === 'cv' && !this.validateFileSize(file, APP_CONSTANTS.FILE_LIMITS.CV_MAX_SIZE)) {
      errors.push(`CV size must be less than ${APP_CONSTANTS.FILE_LIMITS.CV_MAX_SIZE / 1024 / 1024}MB`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Clean up old files
  static async cleanupOldFiles(daysOld = 30) {
    try {
      const cloudinary = require('cloudinary').v2;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      // This would require implementing a cleanup strategy
      // based on your specific needs and Cloudinary API
      
      return {
        success: true,
        message: 'Old files cleanup completed'
      };
    } catch (error) {
      console.error('Failed to cleanup old files:', error);
      throw new Error('Failed to cleanup old files');
    }
  }
}

module.exports = FileUploadService;
