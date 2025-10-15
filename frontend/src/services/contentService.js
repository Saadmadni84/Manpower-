import api from '../config/api';

const contentService = {
  // Get all pages
  getAllPages: async () => {
    try {
      const response = await api.get('/admin/content/pages');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get specific page content
  getPageContent: async (page, includeDrafts = false) => {
    try {
      const response = await api.get(`/admin/content/pages/${page}`, {
        params: { includeDrafts }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update page section
  updatePageSection: async (page, section, data) => {
    try {
      const response = await api.put(`/admin/content/content/${page}/${section}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk update content
  bulkUpdateContent: async (updates) => {
    try {
      const response = await api.post('/admin/content/content/bulk-update', { updates });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload media
  uploadMedia: async (file, folder = 'website-content') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await api.post('/admin/content/upload-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload multiple media
  uploadMultipleMedia: async (files, folder = 'website-content') => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('folder', folder);

      const response = await api.post('/admin/content/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete media
  deleteMedia: async (publicId) => {
    try {
      const response = await api.delete('/admin/content/delete-media', {
        data: { publicId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Preview page
  previewPage: async (page, language = 'en') => {
    try {
      const response = await api.get(`/admin/content/preview/${page}`, {
        params: { language }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Publish content
  publishContent: async (contentIds, page) => {
    try {
      const response = await api.post('/admin/content/publish', {
        contentIds,
        page
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Save draft
  saveDraft: async (data) => {
    try {
      const response = await api.post('/admin/content/save-draft', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get drafts
  getDrafts: async (page) => {
    try {
      const response = await api.get('/admin/content/drafts', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get content history
  getContentHistory: async (contentId) => {
    try {
      const response = await api.get(`/admin/content/history/${contentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Revert to version
  revertToVersion: async (contentId, versionIndex) => {
    try {
      const response = await api.post(`/admin/content/revert/${contentId}`, {
        versionIndex
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update page metadata
  updatePageMetadata: async (page, metadata) => {
    try {
      const response = await api.put(`/admin/content/pages/${page}/metadata`, metadata);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search content
  searchContent: async (query, filters = {}) => {
    try {
      const response = await api.get('/admin/content/search', {
        params: { query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default contentService;
