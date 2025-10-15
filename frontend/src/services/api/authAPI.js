import axiosInstance from './axiosConfig';

export const authAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  validateToken: async () => {
    const response = await axiosInstance.get('/auth/validate');
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data;
  },

  adminLogin: async (credentials) => {
    const response = await axiosInstance.post('/auth/admin/login', credentials);
    return response.data;
  }
};

// Export individual functions for backward compatibility
export const adminLogin = authAPI.adminLogin;

