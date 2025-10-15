import React from 'react';

const CompleteDashboard = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        borderRadius: '16px',
        padding: '30px',
        color: 'white',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>Welcome back, Admin!</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Here's what's happening with your manpower supply company today.</p>
        </div>
        <div style={{
          padding: '12px 20px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            ⚡
          </div>
          <div>
            <h3 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 4px 0', color: '#1e293b' }}>8</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Total Services</p>
            <span style={{ fontSize: '13px', background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '6px' }}>
              +2 this month
            </span>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            👥
          </div>
          <div>
            <h3 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 4px 0', color: '#1e293b' }}>45</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Active Clients</p>
            <span style={{ fontSize: '13px', background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '6px' }}>
              +5 this month
            </span>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            💼
          </div>
          <div>
            <h3 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 4px 0', color: '#1e293b' }}>23</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Active Jobs</p>
            <span style={{ fontSize: '13px', background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '6px' }}>
              +7 this week
            </span>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            📋
          </div>
          <div>
            <h3 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 4px 0', color: '#1e293b' }}>156</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Pending Applications</p>
            <span style={{ fontSize: '13px', background: '#e0e7ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '6px' }}>
              12 new today
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0',
        marginBottom: '30px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px 0' }}>Quick Actions</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { title: 'Add New Service', icon: '➕', color: '#2563eb' },
            { title: 'View Applications', icon: '💼', color: '#10b981' },
            { title: 'Manage Clients', icon: '👥', color: '#f59e0b' },
            { title: 'Upload Gallery', icon: '🖼️', color: '#8b5cf6' }
          ].map((action, index) => (
            <button
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '24px 16px',
                border: '2px dashed #e2e8f0',
                background: '#f8fafc',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: '600',
                color: '#475569'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                {action.icon}
              </div>
              <span>{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', margin: '0 0 12px 0' }}>New Enquiries</h4>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#2563eb', marginBottom: '8px' }}>12</div>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>This week</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', margin: '0 0 12px 0' }}>Gallery Images</h4>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#2563eb', marginBottom: '8px' }}>234</div>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Total uploaded</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', margin: '0 0 12px 0' }}>Total Contracts</h4>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#2563eb', marginBottom: '8px' }}>67</div>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Since inception</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', margin: '0 0 12px 0' }}>Monthly Revenue</h4>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#2563eb', marginBottom: '8px' }}>SAR 2.5M</div>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Current month</p>
        </div>
      </div>
    </div>
  );
};

export default CompleteDashboard;
