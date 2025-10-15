import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const useInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInterviews: 0
  });

  // Fetch all interviews with filters
  const fetchInterviews = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/interviews`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        setInterviews(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch interviews');
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch today's interviews
  const fetchTodayInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/interviews/today`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch today\'s interviews');
      console.error('Error fetching today\'s interviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch upcoming interviews
  const fetchUpcomingInterviews = useCallback(async (days = 7) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/interviews/upcoming`, {
        params: { days },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch upcoming interviews');
      console.error('Error fetching upcoming interviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch my interviews
  const fetchMyInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/interviews/my-interviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your interviews');
      console.error('Error fetching my interviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single interview
  const fetchInterviewById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/admin/career/interviews/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch interview');
      console.error('Error fetching interview:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create interview
  const createInterview = useCallback(async (interviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/admin/career/interviews`,
        interviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchInterviews(); // Refresh the interviews list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create interview');
      console.error('Error creating interview:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInterviews]);

  // Update interview
  const updateInterview = useCallback(async (id, interviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(
        `${API_URL}/admin/career/interviews/${id}`,
        interviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchInterviews(); // Refresh the interviews list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update interview');
      console.error('Error updating interview:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInterviews]);

  // Reschedule interview
  const rescheduleInterview = useCallback(async (id, newDate, newTime, reason) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/admin/career/interviews/${id}/reschedule`,
        { newDate, newTime, reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchInterviews(); // Refresh the interviews list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reschedule interview');
      console.error('Error rescheduling interview:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInterviews]);

  // Cancel interview
  const cancelInterview = useCallback(async (id, reason) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/admin/career/interviews/${id}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchInterviews(); // Refresh the interviews list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel interview');
      console.error('Error cancelling interview:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInterviews]);

  // Add feedback
  const addInterviewFeedback = useCallback(async (id, feedbackData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/admin/career/interviews/${id}/feedback`,
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchInterviews(); // Refresh the interviews list
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add feedback');
      console.error('Error adding feedback:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInterviews]);

  // Delete interview
  const deleteInterview = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.delete(`${API_URL}/admin/career/interviews/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        await fetchInterviews(); // Refresh the interviews list
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete interview');
      console.error('Error deleting interview:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInterviews]);

  return {
    interviews,
    loading,
    error,
    pagination,
    fetchInterviews,
    fetchTodayInterviews,
    fetchUpcomingInterviews,
    fetchMyInterviews,
    fetchInterviewById,
    createInterview,
    updateInterview,
    rescheduleInterview,
    cancelInterview,
    addInterviewFeedback,
    deleteInterview
  };
};

export default useInterviews;

