import axios from 'axios';
import { API_BASE_URL } from '../../config/apiEndpoints';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
adminApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Dashboard API
export const getDashboardStats = async () => {
  try {
    const response = await adminApi.get('/dashboard/stats');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRecentActivities = async (limit = 10) => {
  try {
    const response = await adminApi.get(`/dashboard/activities?limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMonthlyTrends = async (months = 6) => {
  try {
    const response = await adminApi.get(`/dashboard/trends?months=${months}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getServiceStats = async () => {
  try {
    const response = await adminApi.get('/dashboard/services');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLocationStats = async () => {
  try {
    const response = await adminApi.get('/dashboard/locations');
    return response;
  } catch (error) {
    throw error;
  }
};

// Company Management API
export const getCompanyInfo = async () => {
  try {
    const response = await adminApi.get('/company');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCompanyInfo = async (companyData) => {
  try {
    const response = await adminApi.put('/company', companyData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadCompanyLogo = async (logoFile) => {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    const response = await adminApi.post('/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Services Management API
export const getServices = async (params = {}) => {
  try {
    const response = await adminApi.get('/services', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await adminApi.get(`/services/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await adminApi.post('/services', serviceData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await adminApi.put(`/services/${id}`, serviceData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await adminApi.delete(`/services/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateServiceStatus = async (id, status) => {
  try {
    const response = await adminApi.patch(`/services/${id}/status`, { status });
    return response;
  } catch (error) {
    throw error;
  }
};

export const reorderServices = async (serviceIds) => {
  try {
    const response = await adminApi.patch('/services/reorder', { serviceIds });
    return response;
  } catch (error) {
    throw error;
  }
};

// Clients Management API
export const getClients = async (params = {}) => {
  try {
    const response = await adminApi.get('/clients', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getClientById = async (id) => {
  try {
    const response = await adminApi.get(`/clients/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    const response = await adminApi.post('/clients', clientData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateClient = async (id, clientData) => {
  try {
    const response = await adminApi.put(`/clients/${id}`, clientData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteClient = async (id) => {
  try {
    const response = await adminApi.delete(`/clients/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadClientLogo = async (id, logoFile) => {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    const response = await adminApi.post(`/clients/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleClientFeatured = async (id) => {
  try {
    const response = await adminApi.patch(`/clients/${id}/featured`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Jobs Management API
export const getJobs = async (params = {}) => {
  try {
    const response = await adminApi.get('/jobs', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getJobById = async (id) => {
  try {
    const response = await adminApi.get(`/jobs/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await adminApi.post('/jobs', jobData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateJob = async (id, jobData) => {
  try {
    const response = await adminApi.put(`/jobs/${id}`, jobData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await adminApi.delete(`/jobs/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateJobStatus = async (id, status) => {
  try {
    const response = await adminApi.patch(`/jobs/${id}/status`, { status });
    return response;
  } catch (error) {
    throw error;
  }
};

// Job Applications API
export const getApplications = async (params = {}) => {
  try {
    const response = await adminApi.get('/applications', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getApplicationById = async (id) => {
  try {
    const response = await adminApi.get(`/applications/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateApplicationStatus = async (id, status, notes = '') => {
  try {
    const response = await adminApi.patch(`/applications/${id}/status`, {
      status,
      notes
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const downloadApplicationCV = async (id) => {
  try {
    const response = await adminApi.get(`/applications/${id}/cv`, {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const downloadApplicationsBulk = async (applicationIds) => {
  try {
    const response = await adminApi.post('/applications/bulk-download', {
      applicationIds
    }, {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Gallery Management API
export const getGalleryCategories = async () => {
  try {
    const response = await adminApi.get('/gallery/categories');
    return response;
  } catch (error) {
    throw error;
  }
};

export const createGalleryCategory = async (categoryData) => {
  try {
    const response = await adminApi.post('/gallery/categories', categoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateGalleryCategory = async (id, categoryData) => {
  try {
    const response = await adminApi.put(`/gallery/categories/${id}`, categoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteGalleryCategory = async (id) => {
  try {
    const response = await adminApi.delete(`/gallery/categories/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getGalleryImages = async (params = {}) => {
  try {
    const response = await adminApi.get('/gallery/images', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadGalleryImages = async (images, categoryId) => {
  try {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });
    formData.append('categoryId', categoryId);
    
    const response = await adminApi.post('/gallery/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateGalleryImage = async (id, imageData) => {
  try {
    const response = await adminApi.put(`/gallery/images/${id}`, imageData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteGalleryImage = async (id) => {
  try {
    const response = await adminApi.delete(`/gallery/images/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Inquiries Management API
export const getInquiries = async (params = {}) => {
  try {
    const response = await adminApi.get('/inquiries', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInquiryById = async (id) => {
  try {
    const response = await adminApi.get(`/inquiries/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateInquiryStatus = async (id, status, notes = '') => {
  try {
    const response = await adminApi.patch(`/inquiries/${id}/status`, {
      status,
      notes
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendInquiryResponse = async (id, responseData) => {
  try {
    const response = await adminApi.post(`/inquiries/${id}/respond`, responseData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const exportInquiries = async (params = {}) => {
  try {
    const response = await adminApi.get('/inquiries/export', {
      params,
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Users Management API
export const getUsers = async (params = {}) => {
  try {
    const response = await adminApi.get('/users', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await adminApi.get(`/users/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await adminApi.post('/users', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await adminApi.put(`/users/${id}`, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await adminApi.delete(`/users/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await adminApi.patch(`/users/${id}/role`, { role });
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetUserPassword = async (id) => {
  try {
    const response = await adminApi.post(`/users/${id}/reset-password`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Settings Management API
export const getSettings = async () => {
  try {
    const response = await adminApi.get('/settings');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const response = await adminApi.put('/settings', settingsData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getEmailTemplates = async () => {
  try {
    const response = await adminApi.get('/settings/email-templates');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateEmailTemplate = async (templateId, templateData) => {
  try {
    const response = await adminApi.put(`/settings/email-templates/${templateId}`, templateData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createBackup = async () => {
  try {
    const response = await adminApi.post('/settings/backup');
    return response;
  } catch (error) {
    throw error;
  }
};

export const restoreBackup = async (backupFile) => {
  try {
    const formData = new FormData();
    formData.append('backup', backupFile);
    
    const response = await adminApi.post('/settings/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSystemHealth = async () => {
  try {
    const response = await adminApi.get('/settings/system-health');
    return response;
  } catch (error) {
    throw error;
  }
};

export const clearCache = async () => {
  try {
    const response = await adminApi.post('/settings/clear-cache');
    return response;
  } catch (error) {
    throw error;
  }
};

export default adminApi;
