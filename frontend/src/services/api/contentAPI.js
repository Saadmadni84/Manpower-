import axiosInstance from './axiosConfig';

export const contentAPI = {
  getPages: async () => {
    const response = await axiosInstance.get('/content/pages');
    return response.data;
  },

  getPageById: async (id) => {
    const response = await axiosInstance.get(`/content/pages/${id}`);
    return response.data;
  },

  getPageBySlug: async (slug) => {
    const response = await axiosInstance.get(`/content/pages/slug/${slug}`);
    return response.data;
  },

  createPage: async (pageData) => {
    const response = await axiosInstance.post('/content/pages', pageData);
    return response.data;
  },

  updatePage: async (id, pageData) => {
    const response = await axiosInstance.put(`/content/pages/${id}`, pageData);
    return response.data;
  },

  deletePage: async (id) => {
    const response = await axiosInstance.delete(`/content/pages/${id}`);
    return response.data;
  },

  getSettings: async () => {
    const response = await axiosInstance.get('/content/settings');
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await axiosInstance.put('/content/settings', settingsData);
    return response.data;
  },

  getSEO: async (pageId) => {
    const response = await axiosInstance.get(`/content/seo/${pageId}`);
    return response.data;
  },

  updateSEO: async (pageId, seoData) => {
    const response = await axiosInstance.put(`/content/seo/${pageId}`, seoData);
    return response.data;
  }
};

