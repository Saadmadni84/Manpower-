import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const API_BASE_URL = process.env.REACT_APP_ADMIN_API_URL || '/api/admin';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    fullName: '',
    phone: '',
    department: ''
  });

  const getAuthToken = () => localStorage.getItem('adminToken');

  const getAxiosConfig = () => ({
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`, getAxiosConfig());
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage('error', 'Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        full_name: newUser.fullName,
        phone: newUser.phone,
        department: newUser.department
      };

      const response = await axios.post(
        `${API_BASE_URL}/users`,
        userData,
        getAxiosConfig()
      );

      if (response.data.success) {
        showMessage('success', 'Admin user created successfully');
        setShowAddModal(false);
        setNewUser({
          username: '',
          email: '',
          password: '',
          role: 'admin',
          fullName: '',
          phone: '',
          department: ''
        });
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${userId}`,
        updates,
        getAxiosConfig()
      );

      if (response.data.success) {
        showMessage('success', 'User updated successfully');
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/users/${userId}/toggle-status`,
        { is_active: !currentStatus },
        getAxiosConfig()
      );

      if (response.data.success) {
        showMessage('success', response.data.message);
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this admin user?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/users/${userId}`,
        getAxiosConfig()
      );

      if (response.data.success) {
        showMessage('success', 'User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete user');
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewUser(prev => ({ ...prev, password }));
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'super_admin':
        return 'badge-danger';
      case 'admin':
        return 'badge-primary';
      case 'editor':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading admin users...</p>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-header">
        <div>
          <h2>Admin Users Management</h2>
          <p className="settings-description">
            Manage admin users, roles, and permissions
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i> Add New Admin
        </button>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Admin Users Table */}
      <div className="settings-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                  No admin users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={user.is_active}
                        onChange={() => handleToggleStatus(user._id, user.is_active)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => setEditingUser(user)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteUser(user._id)}
                        title="Delete"
                        disabled={user.role === 'super_admin'}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Admin User</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-field">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  required
                  minLength="3"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">Password *</label>
                <div className="password-input-group">
                  <input
                    type="text"
                    id="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={generatePassword}
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Admin User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Descriptions */}
      <div className="settings-group" style={{ marginTop: '30px' }}>
        <h3>Admin Roles & Permissions</h3>
        <div className="role-descriptions">
          <div className="role-card">
            <div className="role-header">
              <span className="badge badge-danger">SUPER ADMIN</span>
            </div>
            <p>Full access to all features including user management, security settings, and system configuration.</p>
          </div>

          <div className="role-card">
            <div className="role-header">
              <span className="badge badge-primary">ADMIN</span>
            </div>
            <p>Access to all content management features. Cannot manage users or critical security settings.</p>
          </div>

          <div className="role-card">
            <div className="role-header">
              <span className="badge badge-info">EDITOR</span>
            </div>
            <p>Content management only. Can create, edit, and publish content but cannot delete or manage settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
