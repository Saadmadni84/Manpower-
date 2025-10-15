import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 8,
    activeClients: 45,
    totalJobs: 23,
    pendingApplications: 156,
    newEnquiries: 12,
    galleryImages: 234,
    totalContracts: 67,
    monthlyRevenue: 'SAR 2.5M'
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'job', title: 'New job application received', time: '5 minutes ago', icon: 'briefcase' },
    { id: 2, type: 'enquiry', title: 'Contact form submission', time: '15 minutes ago', icon: 'mail' },
    { id: 3, type: 'client', title: 'New client added: Saudi Aramco', time: '1 hour ago', icon: 'users' },
    { id: 4, type: 'contract', title: 'Contract signed: Airport Services', time: '2 hours ago', icon: 'document' },
    { id: 5, type: 'service', title: 'Service updated: Facility Management', time: '3 hours ago', icon: 'lightning' }
  ]);

  const [quickActions] = useState([
    { title: 'Add New Service', icon: 'plus', color: '#2563eb', path: '/admin/services' },
    { title: 'View Applications', icon: 'briefcase', color: '#10b981', path: '/admin/careers' },
    { title: 'Manage Clients', icon: 'users', color: '#f59e0b', path: '/admin/clients' },
    { title: 'Upload Gallery', icon: 'photo', color: '#8b5cf6', path: '/admin/gallery' }
  ]);

  const getIcon = (iconName, color = 'currentColor') => {
    const icons = {
      briefcase: <svg width="24" height="24" viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"/><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/></svg>,
      mail: <svg width="24" height="24" viewBox="0 0 20 20" fill={color}><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>,
      users: <svg width="24" height="24" viewBox="0 0 20 20" fill={color}><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>,
      document: <svg width="24" height="24" viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>,
      lightning: <svg width="24" height="24" viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>,
      plus: <svg width="24" height="24" viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/></svg>,
      photo: <svg width="24" height="24" viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg>
    };
    return icons[iconName] || icons.document;
  };

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div>
          <h2>Welcome back, Admin!</h2>
          <p>Here's what's happening with your manpower supply company today.</p>
        </div>
        <div className="welcome-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalServices}</h3>
            <p>Total Services</p>
            <span className="stat-trend positive">+2 this month</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.activeClients}</h3>
            <p>Active Clients</p>
            <span className="stat-trend positive">+5 this month</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"/>
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalJobs}</h3>
            <p>Active Jobs</p>
            <span className="stat-trend positive">+7 this week</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingApplications}</h3>
            <p>Pending Applications</p>
            <span className="stat-trend neutral">12 new today</span>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        {/* Recent Activities */}
        <div className="dashboard-card activities-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button className="btn-text">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {getIcon(activity.icon)}
                </div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button 
                key={index}
                className="quick-action-btn"
                style={{ '--action-color': action.color }}
              >
                <div className="quick-action-icon">
                  {getIcon(action.icon, action.color)}
                </div>
                <span>{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="dashboard-row">
        <div className="dashboard-card small-stat-card">
          <h4>New Enquiries</h4>
          <div className="big-number">{stats.newEnquiries}</div>
          <p>This week</p>
        </div>

        <div className="dashboard-card small-stat-card">
          <h4>Gallery Images</h4>
          <div className="big-number">{stats.galleryImages}</div>
          <p>Total uploaded</p>
        </div>

        <div className="dashboard-card small-stat-card">
          <h4>Total Contracts</h4>
          <div className="big-number">{stats.totalContracts}</div>
          <p>Since inception</p>
        </div>

        <div className="dashboard-card small-stat-card">
          <h4>Monthly Revenue</h4>
          <div className="big-number">{stats.monthlyRevenue}</div>
          <p>Current month</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
