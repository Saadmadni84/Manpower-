import React, { useState } from 'react';
import '../../styles/management.css';

const EnquiriesManagement = () => {
  const [enquiries] = useState([
    { id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@company.com', subject: 'Service Inquiry', message: 'Need manpower for construction project', date: '2025-01-15', status: 'unread' },
    { id: 2, name: 'Mohammed Saleh', email: 'mohammed@company.com', subject: 'Partnership Opportunity', message: 'Interested in collaboration', date: '2025-01-14', status: 'read' },
    { id: 3, name: 'Khalid Hassan', email: 'khalid@company.com', subject: 'Job Application Support', message: 'Questions about job postings', date: '2025-01-13', status: 'replied' }
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'unread': return <span className="badge-warning">Unread</span>;
      case 'read': return <span className="badge-info">Read</span>;
      case 'replied': return <span className="badge-success">Replied</span>;
      default: return <span className="badge-gray">{status}</span>;
    }
  };

  return (
    <div className="enquiries-management">
      <div className="page-header">
        <div>
          <h2>Contact Enquiries</h2>
          <p>Manage customer inquiries and messages</p>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(enquiry => (
              <tr key={enquiry.id}>
                <td><strong>{enquiry.name}</strong></td>
                <td>{enquiry.email}</td>
                <td>{enquiry.subject}</td>
                <td>{enquiry.message.substring(0, 40)}...</td>
                <td>{enquiry.date}</td>
                <td>{getStatusBadge(enquiry.status)}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon btn-edit" title="View">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                    </button>
                    <button className="btn-icon btn-delete" title="Delete">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiriesManagement;
