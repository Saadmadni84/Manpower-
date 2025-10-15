import React, { useState } from 'react';

const CompleteClients = () => {
  const [clients, setClients] = useState([
    { id: 1, name: 'Saudi Aramco', logo: '🛢️', industry: 'Oil & Gas', active: true },
    { id: 2, name: 'NEOM', logo: '🏗️', industry: 'Construction', active: true },
    { id: 3, name: 'Red Sea Global', logo: '🏖️', industry: 'Tourism', active: true },
    { id: 4, name: 'Diriyah Gate', logo: '🏛️', industry: 'Heritage', active: true },
    { id: 5, name: 'Qiddiya', logo: '🎢', industry: 'Entertainment', active: true },
    { id: 6, name: 'Royal Commission', logo: '👑', industry: 'Government', active: true }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    industry: '',
    active: true
  });

  const handleAdd = () => {
    setEditingClient(null);
    setFormData({ name: '', logo: '', industry: '', active: true });
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
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>Client Management</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage your company's client portfolio</p>
        </div>
        <button
          onClick={handleAdd}
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
          ➕ Add New Client
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {clients.map(client => (
          <div
            key={client.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '2px solid #e2e8f0',
              opacity: client.active ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>{client.logo}</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
              {client.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0' }}>
              {client.industry}
            </p>
            <div style={{ marginBottom: '20px' }}>
              {client.active ? (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: '#d1fae5',
                  color: '#059669',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Active Client
                </span>
              ) : (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Inactive
                </span>
              )}
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9'
            }}>
              <button
                onClick={() => handleEdit(client)}
                style={{
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#10b981'
                }}
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(client.id)}
                style={{
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#ef4444'
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  borderRadius: '8px',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g., Saudi Aramco"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                >
                  <option value="">Select Industry</option>
                  <option value="Oil & Gas">Oil & Gas</option>
                  <option value="Construction">Construction</option>
                  <option value="Tourism">Tourism</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Government">Government</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Technology">Technology</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Logo (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={e => setFormData({...formData, logo: e.target.value})}
                  placeholder="🛢️"
                  maxLength="2"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#475569' }}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={e => setFormData({...formData, active: e.target.checked})}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span>Active Client</span>
                </label>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                paddingTop: '24px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'white',
                    color: '#64748b',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
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

export default CompleteClients;
