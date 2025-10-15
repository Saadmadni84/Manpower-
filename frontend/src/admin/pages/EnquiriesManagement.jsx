import React, { useState, useEffect } from 'react';
import './Management.css';

const EnquiriesManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/enquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEnquiries(data.data.enquiries);
        }
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/enquiries/export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'enquiries.csv';
        a.click();
      }
    } catch (error) {
      console.error('Error exporting enquiries:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading enquiries...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Contact Enquiries</h2>
        <button className="btn-primary" onClick={handleExport}>📥 Export to CSV</button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Service Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan="8" style={{textAlign: 'center', padding: '40px'}}>
                  No enquiries yet
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => (
                <tr key={enquiry._id}>
                  <td><strong>{enquiry.name}</strong></td>
                  <td>{enquiry.email}</td>
                  <td>{enquiry.phone}</td>
                  <td>{enquiry.subject}</td>
                  <td>{enquiry.service_type}</td>
                  <td>
                    <span className={`status-badge ${enquiry.status === 'new' ? 'active' : 'inactive'}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td>{new Date(enquiry.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-edit">View</button>
                      <button className="btn-delete">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiriesManagement;
