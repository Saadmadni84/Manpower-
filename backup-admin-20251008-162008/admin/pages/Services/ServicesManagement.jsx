import React, { useState, useEffect } from 'react';
import './ServicesManagement.css';

const ServicesManagement = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Airport Operations', description: 'Comprehensive airport ground handling services', icon: '✈️', active: true },
    { id: 2, name: 'Corporate Offices', description: 'Professional office support staff', icon: '🏢', active: true },
    { id: 3, name: 'Catering Services', description: 'Food and beverage service personnel', icon: '🍽️', active: true },
    { id: 4, name: 'Logistics', description: 'Warehouse and logistics support', icon: '📦', active: true },
    { id: 5, name: 'Construction', description: 'Skilled and unskilled labor', icon: '🏗️', active: true },
    { id: 6, name: 'Facility Management', description: 'Building maintenance and operations', icon: '🛠️', active: true }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    active: true
  });

  const handleAdd = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', icon: '', active: true });
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData(service);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...formData, id: s.id } : s));
    } else {
      setServices([...services, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleToggleActive = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="services-management">
      <div className="page-header">
        <div>
          <h2>Services Management</h2>
          <p>Manage your company's service offerings</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Add New Service
        </button>
      </div>

      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className={`service-card ${!service.active ? 'inactive' : ''}`}>
            <div className="service-icon-large">{service.icon}</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="service-status">
              {service.active ? (
                <span className="badge-success">Active</span>
              ) : (
                <span className="badge-gray">Inactive</span>
              )}
            </div>
            <div className="service-actions">
              <button className="btn-icon btn-edit" onClick={() => handleEdit(service)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </button>
              <button className="btn-icon btn-toggle" onClick={() => handleToggleActive(service.id)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                </svg>
              </button>
              <button className="btn-icon btn-delete" onClick={() => handleDelete(service.id)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g., Airport Operations"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                  rows="3"
                  placeholder="Brief description of the service"
                />
              </div>
              <div className="form-group">
                <label>Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={e => setFormData({...formData, icon: e.target.value})}
                  placeholder="✈️"
                  maxLength="2"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={e => setFormData({...formData, active: e.target.checked})}
                  />
                  <span>Active Service</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
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
