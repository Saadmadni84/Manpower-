import axiosInstance from './axiosConfig';

export const contactAPI = {
  sendMessage: async (messageData) => {
    const response = await axiosInstance.post('/api/v1/contact/submit', messageData);
    return response.data;
  },

  // Admin API methods
  getMessages: async (params = {}) => {
    const response = await axiosInstance.get('/api/admin/enquiries', { params });
    return response.data;
  },

  getMessageById: async (id) => {
    const response = await axiosInstance.get(`/api/admin/enquiries/${id}`);
    return response.data;
  },

  updateEnquiryStatus: async (id, data) => {
    const response = await axiosInstance.put(`/api/admin/enquiries/${id}/status`, data);
    return response.data;
  },

  addEnquiryNote: async (id, data) => {
    const response = await axiosInstance.post(`/api/admin/enquiries/${id}/notes`, data);
    return response.data;
  },

  respondToEnquiry: async (id, data) => {
    const response = await axiosInstance.post(`/api/admin/enquiries/${id}/respond`, data);
    return response.data;
  },

  scheduleFollowUp: async (id, data) => {
    const response = await axiosInstance.post(`/api/admin/enquiries/${id}/follow-up`, data);
    return response.data;
  },

  completeFollowUp: async (id) => {
    const response = await axiosInstance.put(`/api/admin/enquiries/${id}/follow-up/complete`);
    return response.data;
  },

  deleteEnquiry: async (id) => {
    const response = await axiosInstance.delete(`/api/admin/enquiries/${id}`);
    return response.data;
  },

  getEnquiryStats: async () => {
    const response = await axiosInstance.get('/api/admin/enquiries/stats');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axiosInstance.get('/api/admin/enquiries/dashboard-stats');
    return response.data;
  },

  exportEnquiries: async (params = {}) => {
    const response = await axiosInstance.get('/api/admin/enquiries/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  bulkUpdateEnquiries: async (data) => {
    const response = await axiosInstance.post('/api/admin/enquiries/bulk-update', data);
    return response.data;
  },

  // Public API methods
  getContactInfo: async () => {
    const response = await axiosInstance.get('/contact/info');
    return response.data;
  },

  updateContactInfo: async (contactData) => {
    const response = await axiosInstance.put('/contact/info', contactData);
    return response.data;
  }
};

