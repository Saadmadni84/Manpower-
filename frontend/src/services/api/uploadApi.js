import axios from './axiosConfig';

// File Upload API
export const uploadImage = async (file, type = 'general') => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    
    const response = await axios.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadDocument = async (file, type = 'document') => {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    
    const response = await axios.post('/api/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadMultipleImages = async (files, type = 'gallery') => {
  try {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });
    formData.append('type', type);
    
    const response = await axios.post('/api/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await axios.delete(`/api/upload/${fileId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFileInfo = async (fileId) => {
  try {
    const response = await axios.get(`/api/upload/${fileId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
