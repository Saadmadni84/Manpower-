import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/clients-management';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  const getToken = () => localStorage.getItem('adminToken');

  const fetchClients = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, {
        params,
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setClients(response.data.data.clients);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch clients');
      console.error('Fetch clients error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setStats(response.data.data);
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  }, []);

  const createClient = useCallback(async (clientData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(clientData).forEach(key => {
        if (key === 'logo' && clientData[key] instanceof File) {
          formData.append('logo', clientData[key]);
        } else if (typeof clientData[key] === 'object') {
          formData.append(key, JSON.stringify(clientData[key]));
        } else {
          formData.append(key, clientData[key]);
        }
      });

      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchClients();
      await fetchStats();
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  }, [fetchClients, fetchStats]);

  const updateClient = useCallback(async (id, clientData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(clientData).forEach(key => {
        if (key === 'logo' && clientData[key] instanceof File) {
          formData.append('logo', clientData[key]);
        } else if (typeof clientData[key] === 'object') {
          formData.append(key, JSON.stringify(clientData[key]));
        } else {
          formData.append(key, clientData[key]);
        }
      });

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchClients();
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update client');
    } finally {
      setLoading(false);
    }
  }, [fetchClients]);

  const deleteClient = useCallback(async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      await fetchClients();
      await fetchStats();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete client');
    } finally {
      setLoading(false);
    }
  }, [fetchClients, fetchStats]);

  const toggleFeatured = useCallback(async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/feature-toggle`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      await fetchClients();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to toggle featured status');
    }
  }, [fetchClients]);

  const bulkAction = useCallback(async (action, clientIds) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/bulk-actions`, {
        action,
        clientIds
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      await fetchClients();
      await fetchStats();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to perform bulk action');
    } finally {
      setLoading(false);
    }
  }, [fetchClients, fetchStats]);

  const exportClients = useCallback(async (format = 'csv', filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/export`, {
        params: { format, ...filters },
        headers: { Authorization: `Bearer ${getToken()}` },
        responseType: format === 'csv' ? 'blob' : 'json'
      });

      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `clients-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to export clients');
    }
  }, []);

  useEffect(() => {
    fetchClients();
    fetchStats();
  }, [fetchClients, fetchStats]);

  return {
    clients,
    stats,
    loading,
    error,
    pagination,
    fetchClients,
    fetchStats,
    createClient,
    updateClient,
    deleteClient,
    toggleFeatured,
    bulkAction,
    exportClients
  };
};

export default useClients;

