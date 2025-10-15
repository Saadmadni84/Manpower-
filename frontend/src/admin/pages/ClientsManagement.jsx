import React, { useState, useEffect } from 'react';
import './Management.css';

const ClientsManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    name: '',
    industry: '',
    contract_start: '',
    is_active: true
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/clients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setClients(data.data.clients);
          // Auto-seed if empty
          if ((data.data.clients || []).length === 0) {
            const seedRes = await fetch('http://localhost:5001/api/admin/clients/ensure-seeded', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (seedRes.ok) {
              await fetchClients();
              return;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/admin/clients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchClients();
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const openAdd = () => {
    setForm({ name: '', industry: '', contract_start: '', is_active: true });
    setEditingId(null);
    setShowAdd(true);
  };

  const openEdit = (client) => {
    setEditingId(client._id);
    setForm({
      name: client.name || '',
      industry: client.industry || '',
      contract_start: client.contract_start ? new Date(client.contract_start).toISOString().slice(0, 10) : '',
      is_active: !!client.is_active
    });
    setShowEdit(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitAdd = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const resp = await fetch('http://localhost:5001/api/admin/clients', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (resp.ok) {
        setShowAdd(false);
        await fetchClients();
      }
    } catch (err) {
      console.error('Create client error:', err);
    }
  };

  const submitEdit = async () => {
    if (!editingId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const resp = await fetch(`http://localhost:5001/api/admin/clients/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (resp.ok) {
        setShowEdit(false);
        setEditingId(null);
        await fetchClients();
      }
    } catch (err) {
      console.error('Update client error:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading clients...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Clients Management</h2>
        <button className="btn-primary" onClick={openAdd}>+ Add New Client</button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>Contract Start</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td><strong>{client.name}</strong></td>
                <td>{client.industry}</td>
                <td>{client.contract_start ? new Date(client.contract_start).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span className={`status-badge ${client.is_active ? 'active' : 'inactive'}`}>
                    {client.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn-edit" onClick={() => openEdit(client)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(client._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clients.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No clients yet</h3>
          <p>Add your first client to get started</p>
        </div>
      )}

      {(showAdd || showEdit) && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>{showAdd ? 'Add New Client' : 'Edit Client'}</h3>
              <button className="modal-close" onClick={() => { setShowAdd(false); setShowEdit(false); }}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="Client name" />
              </div>
              <div className="form-row">
                <label>Industry</label>
                <input name="industry" value={form.industry} onChange={handleFormChange} placeholder="e.g., Oil & Gas" />
              </div>
              <div className="form-row">
                <label>Contract Start</label>
                <input type="date" name="contract_start" value={form.contract_start} onChange={handleFormChange} />
              </div>
              <div className="form-row">
                <label>
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleFormChange} /> Active
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setShowAdd(false); setShowEdit(false); }}>Cancel</button>
              {showAdd ? (
                <button className="btn-primary" onClick={submitAdd}>Create</button>
              ) : (
                <button className="btn-primary" onClick={submitEdit}>Save Changes</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsManagement;
