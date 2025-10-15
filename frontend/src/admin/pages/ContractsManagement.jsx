import React from 'react';
import './Management.css';

const ContractsManagement = () => {
  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Contracts & Achievements Management</h2>
        <button className="btn-primary">+ Add New Contract</button>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>Contracts Management</h3>
        <p>Add and manage your company contracts and achievements</p>
      </div>
    </div>
  );
};

export default ContractsManagement;
