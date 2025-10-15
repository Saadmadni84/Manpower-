import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const useJobs = (initialFilters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    jobsPerPage: 20
  });
  const [filters, setFilters] = useState(initialFilters);
  const [statistics, setStatistics] = useState(null);

  // Fetch all jobs with filters
  const fetchJobs = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...filters, ...customFilters };
      const response = await axios.get(`${API_URL}/admin/career/jobs`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        setJobs(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch active jobs (public)
  const fetchActiveJobs = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...customFilters };
      const response = await axios.get(`${API_URL}/admin/career/jobs/active`, { params });

      if (response.data.success) {
        setJobs(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch active jobs');
      console.error('Error fetching active jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured jobs
  const fetchFeaturedJobs = useCallback(async (limit = 6) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/jobs/featured`, {
        params: { limit }
      });

      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch featured jobs');
      console.error('Error fetching featured jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single job
  const fetchJobById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job');
      console.error('Error fetching job:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new job
  const createJob = useCallback(async (jobData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/admin/career/jobs`, jobData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        await fetchJobs(); // Refresh the jobs list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
      console.error('Error creating job:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  // Update job
  const updateJob = useCallback(async (id, jobData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${API_URL}/admin/career/jobs/${id}`, jobData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        await fetchJobs(); // Refresh the jobs list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
      console.error('Error updating job:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  // Update job status
  const updateJobStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.patch(
        `${API_URL}/admin/career/jobs/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchJobs(); // Refresh the jobs list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job status');
      console.error('Error updating job status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  // Clone job
  const cloneJob = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/admin/career/jobs/${id}/clone`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        await fetchJobs(); // Refresh the jobs list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clone job');
      console.error('Error cloning job:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  // Delete job
  const deleteJob = useCallback(async (id, force = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.delete(`${API_URL}/admin/career/jobs/${id}`, {
        params: { force },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        await fetchJobs(); // Refresh the jobs list
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
      console.error('Error deleting job:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  // Bulk update jobs
  const bulkUpdateJobs = useCallback(async (jobIds, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.patch(
        `${API_URL}/admin/career/jobs/bulk/update`,
        { jobIds, updates },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchJobs(); // Refresh the jobs list
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to bulk update jobs');
      console.error('Error bulk updating jobs:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  // Fetch job statistics
  const fetchJobStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/jobs/statistics/overview`, {
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
      console.error('Error fetching job statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch expiring jobs
  const fetchExpiringJobs = useCallback(async (days = 7) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/jobs/expiring/soon`, {
        params: { days },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expiring jobs');
      console.error('Error fetching expiring jobs:', err);
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
      fetchJobs();
    }
  }, [filters, fetchJobs]);

  return {
    jobs,
    loading,
    error,
    pagination,
    filters,
    statistics,
    fetchJobs,
    fetchActiveJobs,
    fetchFeaturedJobs,
    fetchJobById,
    createJob,
    updateJob,
    updateJobStatus,
    cloneJob,
    deleteJob,
    bulkUpdateJobs,
    fetchJobStatistics,
    fetchExpiringJobs,
    updateFilters,
    resetFilters
  };
};

export default useJobs;

