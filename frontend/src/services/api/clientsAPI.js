import axiosInstance from './axiosConfig';

export const clientsAPI = {
  getClients: async (params = {}) => {
    const response = await axiosInstance.get('/clients', { params });
    return response.data;
  },

  getClientById: async (id) => {
    const response = await axiosInstance.get(`/clients/${id}`);
    return response.data;
  },

  createClient: async (clientData) => {
    const response = await axiosInstance.post('/clients', clientData);
    return response.data;
  },

  updateClient: async (id, clientData) => {
    const response = await axiosInstance.put(`/clients/${id}`, clientData);
    return response.data;
  },

  deleteClient: async (id) => {
    const response = await axiosInstance.delete(`/clients/${id}`);
    return response.data;
  },

  getClientLogo: async (clientId) => {
    const response = await axiosInstance.get(`/clients/${clientId}/logo`);
    return response.data;
  },

  uploadClientLogo: async (clientId, logoFile) => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    const response = await axiosInstance.post(`/clients/${clientId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

