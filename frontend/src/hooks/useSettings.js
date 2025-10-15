import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_ADMIN_API_URL || '/api/admin';

const useSettings = (category = null) => {
  const [settings, setSettings] = useState([]);
  const [allSettings, setAllSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Create axios config with auth token
  const getAxiosConfig = () => {
    const token = getAuthToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch all settings
  const fetchAllSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/settings`, getAxiosConfig());
      
      if (response.data.success) {
        setAllSettings(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch settings');
      console.error('Error fetching all settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch settings by category
  const fetchSettings = useCallback(async (cat) => {
    const targetCategory = cat || category;
    
    if (!targetCategory) {
      return fetchAllSettings();
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/settings/${targetCategory}`,
        getAxiosConfig()
      );
      
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, [category, fetchAllSettings]);

  // Update settings for a category
  const updateSettings = useCallback(async (cat, settingsData) => {
    const targetCategory = cat || category;
    
    if (!targetCategory) {
      throw new Error('Category is required for updating settings');
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}/settings/${targetCategory}`,
        { settings: settingsData },
        getAxiosConfig()
      );
      
      if (response.data.success) {
        setSettings(response.data.data);
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update settings';
      setError(errorMsg);
      console.error('Error updating settings:', err);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [category]);

  // Update a single setting
  const updateSetting = useCallback(async (cat, key, value, options = {}) => {
    const targetCategory = cat || category;
    
    if (!targetCategory) {
      throw new Error('Category is required for updating setting');
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}/settings/${targetCategory}/${key}`,
        { value, ...options },
        getAxiosConfig()
      );
      
      if (response.data.success) {
        // Update the setting in the local state
        setSettings(prevSettings => 
          prevSettings.map(s => 
            s.key === key ? response.data.data : s
          )
        );
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update setting';
      setError(errorMsg);
      console.error('Error updating setting:', err);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [category]);

  // Reset category settings to defaults
  const resetSettings = useCallback(async (cat) => {
    const targetCategory = cat || category;
    
    if (!targetCategory) {
      throw new Error('Category is required for resetting settings');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/settings/reset/${targetCategory}`,
        {},
        getAxiosConfig()
      );
      
      if (response.data.success) {
        setSettings(response.data.data);
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset settings';
      setError(errorMsg);
      console.error('Error resetting settings:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Test email configuration
  const testEmail = useCallback(async (testEmailAddress) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/settings/test-email`,
        { testEmail: testEmailAddress },
        getAxiosConfig()
      );
      
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send test email';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get system information
  const getSystemInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/settings/system/info`,
        getAxiosConfig()
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch system info';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create backup
  const createBackup = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/settings/backup/create`,
        {},
        getAxiosConfig()
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create backup';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get backup history
  const getBackupHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/settings/backup/history`,
        getAxiosConfig()
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch backup history';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize default settings
  const initializeSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/settings/initialize`,
        {},
        getAxiosConfig()
      );
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to initialize settings';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get setting value by key
  const getSettingValue = useCallback((key, defaultValue = null) => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : defaultValue;
  }, [settings]);

  // Get setting object by key
  const getSetting = useCallback((key) => {
    return settings.find(s => s.key === key) || null;
  }, [settings]);

  // Load settings on mount if category is provided
  useEffect(() => {
    if (category) {
      fetchSettings(category);
    }
  }, [category, fetchSettings]);

  return {
    settings,
    allSettings,
    loading,
    error,
    saving,
    fetchSettings,
    fetchAllSettings,
    updateSettings,
    updateSetting,
    resetSettings,
    testEmail,
    getSystemInfo,
    createBackup,
    getBackupHistory,
    initializeSettings,
    getSettingValue,
    getSetting
  };
};

export default useSettings;
