import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const subscribe = async (subscriptionData) => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await axios.post(
        `${API_BASE_URL}/api/newsletter/subscribe`,
        subscriptionData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setMessage(response.data.message || 'Successfully subscribed to newsletter!');
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'Failed to subscribe');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to subscribe to newsletter';
      setError(errorMessage);
      console.error('Newsletter subscription error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (email, reason = 'User request') => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await axios.post(
        `${API_BASE_URL}/api/newsletter/unsubscribe?reason=${encodeURIComponent(reason)}`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setMessage(response.data.message || 'Successfully unsubscribed from newsletter');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Failed to unsubscribe');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to unsubscribe';
      setError(errorMessage);
      console.error('Newsletter unsubscription error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${API_BASE_URL}/api/footer/newsletter/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'Failed to fetch newsletter stats');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch newsletter statistics';
      setError(errorMessage);
      console.error('Newsletter stats error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  return {
    loading,
    message,
    error,
    subscribe,
    unsubscribe,
    getStats,
    clearMessages
  };
};

export default useNewsletter;
