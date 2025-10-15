import React, { useState } from 'react';

const CompleteEnquiries = () => {
  const [enquiries, setEnquiries] = useState([
    { id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@email.com', phone: '+966501234567', subject: 'Manpower Services Inquiry', message: 'We need 50 construction workers for our project in Riyadh...', date: '2025-01-15', status: 'New', priority: 'High' },
    { id: 2, name: 'Sara Al-Mansouri', email: 'sara@email.com', phone: '+966502345678', subject: 'Office Staff Required', message: 'Looking for administrative staff for our new office...', date: '2025-01-14', status: 'Read', priority: 'Medium' },
    { id: 3, name: 'Mohammed Al-Zahra', email: 'mohammed@email.com', phone: '+966503456789', subject: 'Airport Operations', message: 'Interested in your airport ground handling services...', date: '2025-01-13', status: 'Replied', priority: 'High' },
    { id: 4, name: 'Fatima Al-Harbi', email: 'fatima@email.com', phone: '+966504567890', subject: 'Catering Services', message: 'Need catering staff for a corporate event...', date: '2025-01-12', status: 'New', priority: 'Low' },
    { id: 5, name: 'Khalid Al-Shehri', email: 'khalid@email.com', phone: '+966505678901', subject: 'Construction Project', message: 'Large construction project requiring skilled labor...', date: '2025-01-11', status: 'Read', priority: 'High' },
    { id: 6, name: 'Noura Al-Mutairi', email: 'noura@email.com', phone: '+966506789012', subject: 'Facility Management', message: 'Looking for facility management services...', date: '2025-01-10', status: 'New', priority: 'Medium' }
  ]);

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const updateEnquiryStatus = (id, status) => {
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e));
  };

  const updateEnquiryPriority = (id, priority) => {
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, priority } : e));
  };

  const deleteEnquiry = (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      setEnquiries(enquiries.filter(e => e.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
    }
  };

  const exportEnquiries = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Date', 'Status', 'Priority'],
      ...enquiries.map(e => [e.name, e.email, e.phone, e.subject, e.message, e.date, e.status, e.priority])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enquiries.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const statusMatch = filterStatus === 'All' || enquiry.status === filterStatus;
    const priorityMatch = filterPriority === 'All' || enquiry.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return { background: '#dbeafe', color: '#2563eb' };
      case 'Read': return { background: '#fef3c7', color: '#d97706' };
      case 'Replied': return { background: '#d1fae5', color: '#059669' };
      default: return { background: '#f1f5f9', color: '#64748b' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return { background: '#fee2e2', color: '#dc2626' };
      case 'Medium': return { background: '#fef3c7', color: '#d97706' };
      case 'Low': return { background: '#d1fae5', color: '#059669' };
      default: return { background: '#f1f5f9', color: '#64748b' };
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>Contact Enquiries</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage all contact form submissions</p>
        </div>
        <button
          onClick={exportEnquiries}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          📊 Export CSV
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Filters and List */}
        <div style={{ flex: 1 }}>
          {/* Filters */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#1e293b',
                background: 'white'
              }}
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Read">Read</option>
              <option value="Replied">Replied</option>
            </select>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#1e293b',
                background: 'white'
              }}
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Enquiries List */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '2px solid #e2e8f0'
          }}>
            {filteredEnquiries.map(enquiry => (
              <div
                key={enquiry.id}
                onClick={() => setSelectedEnquiry(enquiry)}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  background: selectedEnquiry?.id === enquiry.id ? '#eff6ff' : 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                      {enquiry.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>
                      {enquiry.email} • {enquiry.phone}
                    </p>
                    <p style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600', margin: 0 }}>
                      {enquiry.subject}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      ...getStatusColor(enquiry.status)
                    }}>
                      {enquiry.status}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      ...getPriorityColor(enquiry.priority)
                    }}>
                      {enquiry.priority}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px 0' }}>
                  {enquiry.message.length > 100 ? enquiry.message.substring(0, 100) + '...' : enquiry.message}
                </p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                  {enquiry.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry Details */}
        {selectedEnquiry && (
          <div style={{
            width: '400px',
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '2px solid #e2e8f0',
            height: 'fit-content',
            position: 'sticky',
            top: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Enquiry Details
              </h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  borderRadius: '8px',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Contact Information</h4>
              <p style={{ fontSize: '14px', color: '#1e293b', margin: '0 0 4px 0' }}><strong>Name:</strong> {selectedEnquiry.name}</p>
              <p style={{ fontSize: '14px', color: '#1e293b', margin: '0 0 4px 0' }}><strong>Email:</strong> {selectedEnquiry.email}</p>
              <p style={{ fontSize: '14px', color: '#1e293b', margin: '0 0 8px 0' }}><strong>Phone:</strong> {selectedEnquiry.phone}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Subject</h4>
              <p style={{ fontSize: '14px', color: '#1e293b', margin: 0 }}>{selectedEnquiry.subject}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Message</h4>
              <p style={{ fontSize: '14px', color: '#1e293b', margin: 0, lineHeight: '1.6' }}>{selectedEnquiry.message}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Date & Status</h4>
              <p style={{ fontSize: '14px', color: '#1e293b', margin: '0 0 8px 0' }}><strong>Date:</strong> {selectedEnquiry.date}</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  ...getStatusColor(selectedEnquiry.status)
                }}>
                  {selectedEnquiry.status}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  ...getPriorityColor(selectedEnquiry.priority)
                }}>
                  {selectedEnquiry.priority}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '0 0 12px 0' }}>Quick Actions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <button
                  onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'Read')}
                  style={{
                    padding: '8px 12px',
                    background: '#e0e7ff',
                    color: '#4f46e5',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Mark Read
                </button>
                <button
                  onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'Replied')}
                  style={{
                    padding: '8px 12px',
                    background: '#d1fae5',
                    color: '#059669',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Mark Replied
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <select
                  value={selectedEnquiry.priority}
                  onChange={e => updateEnquiryPriority(selectedEnquiry.id, e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#1e293b'
                  }}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <button
                  onClick={() => deleteEnquiry(selectedEnquiry.id)}
                  style={{
                    padding: '8px 12px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Reply</h4>
              <textarea
                placeholder="Type your reply here..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1e293b',
                  resize: 'vertical',
                  marginBottom: '12px'
                }}
              />
              <button
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📧 Send Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompleteEnquiries;
