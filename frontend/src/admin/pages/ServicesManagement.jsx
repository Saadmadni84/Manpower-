import React, { useState, useEffect } from 'react';
import './Management.css';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    short_description_en: '',
    short_description_ar: '',
    icon: '⚡',
    display_order: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setServices(data.data.services);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingService 
        ? `http://localhost:5001/api/admin/services/${editingService._id}`
        : 'http://localhost:5001/api/admin/services';
      
      const response = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchServices();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title_en: service.title_en,
      title_ar: service.title_ar,
      description_en: service.description_en,
      description_ar: service.description_ar,
      short_description_en: service.short_description_en || '',
      short_description_ar: service.short_description_ar || '',
      icon: service.icon,
      display_order: service.display_order
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/admin/services/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      short_description_en: '',
      short_description_ar: '',
      icon: '⚡',
      display_order: 0
    });
    setEditingService(null);
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Services Management</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add New Service
        </button>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title_en}</h3>
            <p className="service-arabic">{service.title_ar}</p>
            <p className="service-description">{service.short_description_en}</p>
            <div className="service-status">
              <span className={`status-badge ${service.is_active ? 'active' : 'inactive'}`}>
                {service.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="service-actions">
              <button className="btn-edit" onClick={() => handleEdit(service)}>Edit</button>
              <button className="btn-toggle" onClick={() => handleToggleStatus(service._id)}>
                {service.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button className="btn-delete" onClick={() => handleDelete(service._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title (English)</label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Title (Arabic)</label>
                  <input
                    type="text"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Description (English)</label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                    required
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Description (Arabic)</label>
                  <textarea
                    value={formData.description_ar}
                    onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                    required
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Short Description (English)</label>
                  <input
                    type="text"
                    value={formData.short_description_en}
                    onChange={(e) => setFormData({...formData, short_description_en: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Short Description (Arabic)</label>
                  <input
                    type="text"
                    value={formData.short_description_ar}
                    onChange={(e) => setFormData({...formData, short_description_ar: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Icon (Emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingService ? 'Update' : 'Create'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
