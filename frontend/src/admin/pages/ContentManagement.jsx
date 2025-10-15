import React, { useState, useEffect } from 'react';
import './Management.css';

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/content', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setContent(data.data.content);
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading content...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Website Content Management</h2>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Section</th>
              <th>Key</th>
              <th>English Value</th>
              <th>Arabic Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {content.map((item) => (
              <tr key={item._id}>
                <td><strong>{item.section}</strong></td>
                <td>{item.content_key}</td>
                <td>{item.content_value_en.substring(0, 50)}...</td>
                <td style={{direction: 'rtl'}}>{item.content_value_ar.substring(0, 50)}...</td>
                <td>
                  <button className="btn-edit">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentManagement;
