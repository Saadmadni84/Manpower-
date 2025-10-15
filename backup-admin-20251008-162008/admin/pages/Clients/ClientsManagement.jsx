import React, { useState } from 'react';
import '../../styles/management.css';
import './ClientsManagement.css';

const ClientsManagement = () => {
  const [clients, setClients] = useState([
    { id: 1, name: 'Saudi Aramco', logo: '🛢️', industry: 'Oil & Gas', since: '2010', active: true },
    { id: 2, name: 'King Abdulaziz Airport', logo: '✈️', industry: 'Aviation', since: '2012', active: true },
    { id: 3, name: 'Riyadh Metro', logo: '🚇', industry: 'Transport', since: '2015', active: true },
    { id: 4, name: 'NEOM', logo: '🏗️', industry: 'Construction', since: '2020', active: true },
    { id: 5, name: 'Red Sea Development', logo: '🏖️', industry: 'Tourism', since: '2019', active: true }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    industry: '',
    since: '',
    active: true
  });

  const handleAdd = () => {
    setEditingClient(null);
    setFormData({ name: '', logo: '', industry: '', since: '', active: true });
    setShowModal(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData(client);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...formData, id: c.id } : c));
    } else {
      setClients([...clients, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="clients-management">
      <div className="page-header">
        <div>
          <h2>Clients Management</h2>
          <p>Manage your client portfolio and relationships</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Add New Client
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Client Name</th>
              <th>Industry</th>
              <th>Client Since</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>
                  <div className="client-logo">{client.logo}</div>
                </td>
                <td><strong>{client.name}</strong></td>
                <td>{client.industry}</td>
                <td>{client.since}</td>
                <td>
                  {client.active ? (
                    <span className="badge-success">Active</span>
                  ) : (
                    <span className="badge-gray">Inactive</span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon btn-edit" onClick={() => handleEdit(client)}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(client.id)}>
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Client Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g., Saudi Aramco"
                />
              </div>
              <div className="form-group">
                <label>Logo (Emoji or URL)</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={e => setFormData({...formData, logo: e.target.value})}
                  placeholder="🛢️"
                />
              </div>
              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                  placeholder="e.g., Oil & Gas"
                />
              </div>
              <div className="form-group">
                <label>Client Since (Year)</label>
                <input
                  type="text"
                  value={formData.since}
                  onChange={e => setFormData({...formData, since: e.target.value})}
                  placeholder="2020"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={e => setFormData({...formData, active: e.target.checked})}
                  />
                  <span>Active Client</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingClient ? 'Update Client' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsManagement;
