import { useState, useEffect, useCallback } from 'react';

const useDashboard = (autoRefresh = true, refreshInterval = 30000) => {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalClients: 0,
    activeJobs: 0,
    pendingCVs: 0,
    galleryImages: 0,
    contactEnquiries: 0
  });

  const [extendedStats, setExtendedStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_BASE_URL = 'http://localhost:5001/api/admin';

  // Get auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      
      // Debug: Log the received data
      console.log('useDashboard - Received data:', data);
      console.log('useDashboard - Stats:', data.data?.stats);
      
      if (data.success) {
        setStats(data.data.stats);
        setExtendedStats(data.data.extendedStats);
        setActivities(data.data.activities || []);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recent activity
  const fetchRecentActivity = useCallback(async (limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/recent-activity?limit=${limit}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
      }

      const data = await response.json();
      
      if (data.success) {
        setActivities(data.data.activities || []);
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    }
  }, []);

  // Fetch system overview
  const fetchOverview = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch overview');
      }

      const data = await response.json();
      
      if (data.success) {
        setOverview(data.data.overview);
      }
    } catch (err) {
      console.error('Error fetching overview:', err);
    }
  }, []);

  // Refresh all dashboard data
  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchRecentActivity(),
      fetchOverview()
    ]);
    setLoading(false);
  }, [fetchStats, fetchRecentActivity, fetchOverview]);

  // Initial fetch
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchStats();
      fetchRecentActivity();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchStats, fetchRecentActivity]);

  // Calculate trends (mock implementation - you can enhance this)
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return { trend: 'neutral', value: 0 };
    
    const change = ((current - previous) / previous) * 100;
    
    if (change > 0) return { trend: 'up', value: Math.abs(change).toFixed(1) };
    if (change < 0) return { trend: 'down', value: Math.abs(change).toFixed(1) };
    return { trend: 'neutral', value: 0 };
  };

  return {
    // Data
    stats,
    extendedStats,
    activities,
    overview,
    
    // State
    loading,
    error,
    lastUpdated,
    
    // Actions
    refreshDashboard,
    fetchStats,
    fetchRecentActivity,
    fetchOverview,
    
    // Utilities
    calculateTrend
  };
};

export default useDashboard;

