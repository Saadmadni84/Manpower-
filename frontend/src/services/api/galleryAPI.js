import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const ADMIN_API_BASE = `${API_BASE_URL}/api/admin`;

// Create axios instance
const apiClient = axios.create({
  baseURL: ADMIN_API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('adminToken');
      localStorage.removeItem('authToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const galleryAPI = {
  // Get all images with pagination and filters
  getAllImages: async (params = {}) => {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isFeatured,
      isActive,
      startDate,
      endDate
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    if (category && category !== 'all') {
      queryParams.append('category', category);
    }

    if (search) {
      queryParams.append('search', search);
    }

    if (isFeatured !== undefined) {
      queryParams.append('isFeatured', isFeatured.toString());
    }

    if (isActive !== undefined) {
      queryParams.append('isActive', isActive.toString());
    }

    if (startDate) {
      queryParams.append('startDate', startDate);
    }

    if (endDate) {
      queryParams.append('endDate', endDate);
    }

    const response = await apiClient.get(`/gallery?${queryParams}`);
    return response.data;
  },

  // Get single image by ID
  getImageById: async (id) => {
    const response = await apiClient.get(`/gallery/${id}`);
    return response.data;
  },

  // Get categories with counts
  getCategories: async () => {
    const response = await apiClient.get('/gallery/categories');
    return response.data;
  },

  // Get gallery statistics
  getStats: async () => {
    const response = await apiClient.get('/gallery/stats');
    return response.data;
  },

  // Upload single image
  uploadImage: async (imageData) => {
    const formData = new FormData();
    
    // Add image file
    formData.append('image', imageData.file);
    
    // Add metadata
    formData.append('title', JSON.stringify(imageData.title || { en: '', ar: '' }));
    formData.append('description', JSON.stringify(imageData.description || { en: '', ar: '' }));
    formData.append('category', imageData.category || 'other');
    formData.append('tags', JSON.stringify(imageData.tags || []));
    formData.append('keywords', JSON.stringify(imageData.keywords || []));
    formData.append('displayOrder', imageData.displayOrder || 0);
    formData.append('isFeatured', imageData.isFeatured || false);
    formData.append('displayOnHomepage', imageData.displayOnHomepage || false);
    formData.append('photoDate', imageData.photoDate || '');
    formData.append('eventName', imageData.eventName || '');
    formData.append('location', imageData.location || '');
    formData.append('altText', JSON.stringify(imageData.altText || { en: '', ar: '' }));

    const response = await apiClient.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Bulk upload images
  bulkUpload: async (files, metadata = {}) => {
    const formData = new FormData();
    
    // Add all image files
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    // Add shared metadata
    formData.append('category', metadata.category || 'other');
    formData.append('tags', JSON.stringify(metadata.tags || []));
    formData.append('keywords', JSON.stringify(metadata.keywords || []));
    formData.append('eventName', metadata.eventName || '');
    formData.append('location', metadata.location || '');
    formData.append('photoDate', metadata.photoDate || '');
    formData.append('isFeatured', metadata.isFeatured || false);
    formData.append('displayOnHomepage', metadata.displayOnHomepage || false);

    const response = await apiClient.post('/gallery/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update image
  updateImage: async (id, imageData) => {
    const response = await apiClient.put(`/gallery/${id}`, imageData);
    return response.data;
  },

  // Delete image
  deleteImage: async (id) => {
    const response = await apiClient.delete(`/gallery/${id}`);
    return response.data;
  },

  // Bulk delete images
  bulkDelete: async (ids) => {
    const response = await apiClient.post('/gallery/bulk-delete', { ids });
    return response.data;
  },

  // Reorder images
  reorderImages: async (updates) => {
    const response = await apiClient.put('/gallery/reorder', { updates });
    return response.data;
  },

  // Toggle image status
  toggleStatus: async (id) => {
    const response = await apiClient.patch(`/gallery/${id}/toggle`);
    return response.data;
  },

  // Toggle featured status
  toggleFeatured: async (id) => {
    const response = await apiClient.patch(`/gallery/${id}/featured`);
    return response.data;
  },

  // Increment view count
  incrementView: async (id) => {
    const response = await apiClient.post(`/gallery/${id}/view`);
    return response.data;
  },

  // Increment download count
  incrementDownload: async (id) => {
    const response = await apiClient.post(`/gallery/${id}/download`);
    return response.data;
  }
};

export default galleryAPI;