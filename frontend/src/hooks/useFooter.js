import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const useFooter = () => {
  const [footerContent, setFooterContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFooterContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/footer/content`);
      
      if (response.data.success) {
        setFooterContent(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch footer content');
      }
    } catch (err) {
      console.error('Error fetching footer content:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch footer content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const updateFooterSection = async (section, content) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/footer/content/${section}`,
        { content },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setFooterContent(prev => ({
          ...prev,
          [section]: response.data.data.content
        }));
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'Failed to update footer section');
      }
    } catch (err) {
      console.error('Error updating footer section:', err);
      throw err;
    }
  };

  return {
    footerContent,
    loading,
    error,
    fetchFooterContent,
    updateFooterSection
  };
};

export default useFooter;
