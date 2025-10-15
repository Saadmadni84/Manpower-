import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const useApplications = (initialFilters = {}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
    applicationsPerPage: 20
  });
  const [filters, setFilters] = useState(initialFilters);
  const [statistics, setStatistics] = useState(null);

  // Fetch all applications with filters
  const fetchApplications = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...filters, ...customFilters };
      const response = await axios.get(`${API_URL}/admin/career/applications`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        setApplications(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch single application
  const fetchApplicationById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch application');
      console.error('Error fetching application:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit application (public)
  const submitApplication = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/admin/career/applications/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
      console.error('Error submitting application:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update application
  const updateApplication = useCallback(async (id, applicationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(
        `${API_URL}/admin/career/applications/${id}`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchApplications(); // Refresh the applications list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application');
      console.error('Error updating application:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications]);

  // Update application status
  const updateApplicationStatus = useCallback(async (id, status, notes = '', sendNotification = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.patch(
        `${API_URL}/admin/career/applications/${id}/status`,
        { status, notes, sendNotification },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchApplications(); // Refresh the applications list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status');
      console.error('Error updating application status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications]);

  // Add evaluation
  const addEvaluation = useCallback(async (id, evaluationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/admin/career/applications/${id}/evaluation`,
        evaluationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add evaluation');
      console.error('Error adding evaluation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add communication log
  const addCommunication = useCallback(async (id, communicationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/admin/career/applications/${id}/communication`,
        communicationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add communication');
      console.error('Error adding communication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Assign recruiter
  const assignRecruiter = useCallback(async (id, recruiterId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.patch(
        `${API_URL}/admin/career/applications/${id}/assign-recruiter`,
        { recruiterId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchApplications(); // Refresh the applications list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign recruiter');
      console.error('Error assigning recruiter:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications]);

  // Schedule interview
  const scheduleInterview = useCallback(async (id, interviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/admin/career/applications/${id}/schedule-interview`,
        interviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchApplications(); // Refresh the applications list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule interview');
      console.error('Error scheduling interview:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications]);

  // Bulk update applications
  const bulkUpdateApplications = useCallback(async (applicationIds, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.patch(
        `${API_URL}/admin/career/applications/bulk/update`,
        { applicationIds, updates },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchApplications(); // Refresh the applications list
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to bulk update applications');
      console.error('Error bulk updating applications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications]);

  // Delete application
  const deleteApplication = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.delete(`${API_URL}/admin/career/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        await fetchApplications(); // Refresh the applications list
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete application');
      console.error('Error deleting application:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications]);

  // Fetch application statistics
  const fetchApplicationStatistics = useCallback(async (jobId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = jobId ? { jobId } : {};
      const response = await axios.get(`${API_URL}/admin/career/applications/statistics/overview`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        setStatistics(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
      console.error('Error fetching application statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Export applications to CSV
  const exportApplications = useCallback(async (jobId = null, status = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      if (jobId) params.jobId = jobId;
      if (status) params.status = status;

      const response = await axios.get(`${API_URL}/admin/career/applications/export/csv`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export applications');
      console.error('Error exporting applications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Auto-fetch on filter change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchApplications();
    }
  }, [filters, fetchApplications]);

  return {
    applications,
    loading,
    error,
    pagination,
    filters,
    statistics,
    fetchApplications,
    fetchApplicationById,
    submitApplication,
    updateApplication,
    updateApplicationStatus,
    addEvaluation,
    addCommunication,
    assignRecruiter,
    scheduleInterview,
    bulkUpdateApplications,
    deleteApplication,
    fetchApplicationStatistics,
    exportApplications,
    updateFilters,
    resetFilters
  };
};

export default useApplications;

