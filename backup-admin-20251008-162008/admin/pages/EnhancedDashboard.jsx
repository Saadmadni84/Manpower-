import React, { useState, useEffect } from 'react';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalClients: 0,
    activeJobs: 0,
    pendingCVs: 0,
    galleryImages: 0,
    contactEnquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats from database
    setTimeout(() => {
      setStats({
        totalServices: 8,
        totalClients: 45,
        activeJobs: 23,
        pendingCVs: 156,
        galleryImages: 234,
        contactEnquiries: 12
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: '⚡',
      color: '#2563eb',
      bgColor: '#dbeafe'
    },
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: '👥',
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: '💼',
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Pending CVs',
      value: stats.pendingCVs,
      icon: '📋',
      color: '#8b5cf6',
      bgColor: '#e9d5ff'
    },
    {
      title: 'Gallery Images',
      value: stats.galleryImages,
      icon: '🖼️',
      color: '#ef4444',
      bgColor: '#fee2e2'
    },
    {
      title: 'Contact Enquiries',
      value: stats.contactEnquiries,
      icon: '📧',
      color: '#06b6d4',
      bgColor: '#cffafe'
    }
  ];

  const recentActivities = [
    { action: 'New CV submitted', time: '2 minutes ago', type: 'success' },
    { action: 'Contact enquiry received', time: '15 minutes ago', type: 'info' },
    { action: 'Job posting updated', time: '1 hour ago', type: 'warning' },
    { action: 'Gallery image uploaded', time: '2 hours ago', type: 'success' },
    { action: 'Client information updated', time: '3 hours ago', type: 'info' }
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        marginBottom: '32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            margin: '0 0 12px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            مرحباً بك في لوحة الإدارة
          </h1>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            margin: '0 0 8px 0',
            opacity: 0.9
          }}>
            Welcome to Admin Dashboard
          </h2>
          <p style={{ 
            fontSize: '16px', 
            margin: '0 0 20px 0', 
            opacity: 0.8 
          }}>
            Saudi Manpower Supply Company - Management Portal
          </p>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '12px 24px',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {new Date().toLocaleDateString('ar-SA', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {statCards.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px 24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '18px',
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}>
                {stat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: '36px', 
                  fontWeight: '700', 
                  margin: '0 0 4px 0', 
                  color: '#1e293b' 
                }}>
                  {stat.value.toLocaleString()}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b', 
                  margin: '0 0 8px 0' 
                }}>
                  {stat.title}
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: '#d1fae5',
                  color: '#059669',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  +12% this month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Quick Actions */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1e293b', 
            margin: '0 0 24px 0' 
          }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {[
              { title: 'Add New Service', icon: '⚡', color: '#2563eb', path: '/admin/services' },
              { title: 'Upload Gallery', icon: '🖼️', color: '#8b5cf6', path: '/admin/gallery' },
              { title: 'Post New Job', icon: '💼', color: '#f59e0b', path: '/admin/careers' },
              { title: 'Add Client', icon: '👥', color: '#10b981', path: '/admin/clients' },
              { title: 'View Enquiries', icon: '📧', color: '#ef4444', path: '/admin/enquiries' },
              { title: 'Edit Content', icon: '📝', color: '#06b6d4', path: '/admin/content' }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => window.location.href = action.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '24px 16px',
                  border: '2px dashed #e2e8f0',
                  background: '#f8fafc',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.background = `${action.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {action.icon}
                </div>
                <span style={{ textAlign: 'center' }}>{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1e293b', 
            margin: '0 0 24px 0' 
          }}>
            Recent Activities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: activity.type === 'success' ? '#d1fae5' : 
                             activity.type === 'warning' ? '#fef3c7' : '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  {activity.type === 'success' ? '✅' : 
                   activity.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#1e293b', 
                    margin: '0 0 4px 0' 
                  }}>
                    {activity.action}
                  </p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#64748b', 
                    margin: 0 
                  }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
