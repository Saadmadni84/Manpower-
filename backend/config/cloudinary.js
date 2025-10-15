const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  console.log('Cloudinary configured successfully');
  return cloudinary;
};

// Upload configuration presets
const uploadPresets = {
  companyLogos: {
    folder: 'manpower/company-logos',
    transformation: {
      width: 300,
      height: 300,
      crop: 'scale',
      quality: 'auto',
      format: 'auto'
    }
  },
  serviceIcons: {
    folder: 'manpower/service-icons',
    transformation: {
      width: 100,
      height: 100,
      crop: 'scale',
      quality: 'auto',
      format: 'auto'
    }
  },
  clientLogos: {
    folder: 'manpower/client-logos',
    transformation: {
      width: 200,
      height: 200,
      crop: 'scale',
      quality: 'auto',
      format: 'auto'
    }
  },
  galleryImages: {
    folder: 'manpower/gallery',
    transformation: {
      width: 1200,
      height: 800,
      crop: 'limit',
      quality: 'auto',
      format: 'auto'
    }
  },
  candidateCVs: {
    folder: 'manpower/candidate-cvs',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx']
  }
};

// Helper function to upload with specific preset
const uploadWithPreset = async (file, presetName) => {
  const preset = uploadPresets[presetName];
  if (!preset) {
    throw new Error(`Upload preset '${presetName}' not found`);
  }

  const options = {
    folder: preset.folder,
    resource_type: preset.resource_type || 'image',
    ...preset.transformation
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  configureCloudinary,
  uploadWithPreset,
  deleteFromCloudinary,
  uploadPresets
};
