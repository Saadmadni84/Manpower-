import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalClients: 0,
    activeJobs: 0,
    pendingCVs: 0,
    galleryImages: 0,
    contactEnquiries: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data.stats);
          setActivities(data.data.activities);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add New Service',
      description: 'Create a new manpower service',
      icon: '⚡',
      color: '#3b82f6',
      action: () => navigate('/admin/services?action=add')
    },
    {
      title: 'Add New Client',
      description: 'Register a new client company',
      icon: '👥',
      color: '#10b981',
      action: () => navigate('/admin/clients?action=add')
    },
    {
      title: 'Post New Job',
      description: 'Create a new job opening',
      icon: '💼',
      color: '#f59e0b',
      action: () => navigate('/admin/careers?action=add')
    },
    {
      title: 'Upload Gallery Image',
      description: 'Add new images to gallery',
      icon: '🖼️',
      color: '#8b5cf6',
      action: () => navigate('/admin/gallery?action=upload')
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'cv': return '📄';
      case 'enquiry': return '📧';
      case 'job': return '💼';
      default: return '📝';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome to your admin panel. Here's what's happening with your company.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon services">⚡</div>
          <div className="stat-content">
            <h3>{stats.totalServices}</h3>
            <p>Active Services</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon clients">👥</div>
          <div className="stat-content">
            <h3>{stats.totalClients}</h3>
            <p>Active Clients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon jobs">💼</div>
          <div className="stat-content">
            <h3>{stats.activeJobs}</h3>
            <p>Active Jobs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cvs">📄</div>
          <div className="stat-content">
            <h3>{stats.pendingCVs}</h3>
            <p>Pending CVs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon gallery">🖼️</div>
          <div className="stat-content">
            <h3>{stats.galleryImages}</h3>
            <p>Gallery Images</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon enquiries">📧</div>
          <div className="stat-content">
            <h3>{stats.contactEnquiries}</h3>
            <p>New Enquiries</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="action-card"
                onClick={action.action}
                style={{ '--action-color': action.color }}
              >
                <div className="action-icon">{action.icon}</div>
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities">
          <h3>Recent Activities</h3>
          <div className="activities-list">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activities">
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
