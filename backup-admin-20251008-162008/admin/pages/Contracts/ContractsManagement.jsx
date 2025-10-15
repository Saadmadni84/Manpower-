import React, { useState } from 'react';
import '../../styles/management.css';

const ContractsManagement = () => {
  const [contracts] = useState([
    { id: 1, title: 'Airport Ground Services Contract', client: 'King Abdulaziz Airport', value: 'SAR 5M', startDate: '2024-01-01', endDate: '2024-12-31', status: 'Active' },
    { id: 2, title: 'Facility Management Services', client: 'Saudi Aramco', value: 'SAR 8M', startDate: '2024-02-01', endDate: '2025-01-31', status: 'Active' },
    { id: 3, title: 'Construction Labor Supply', client: 'NEOM', value: 'SAR 12M', startDate: '2023-06-01', endDate: '2024-05-31', status: 'Completed' }
  ]);

  return (
    <div className="contracts-management">
      <div className="page-header">
        <div>
          <h2>Contracts & Achievements</h2>
          <p>Manage contracts and project milestones</p>
        </div>
        <button className="btn-primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Add New Contract
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Contract Title</th>
              <th>Client</th>
              <th>Value</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(contract => (
              <tr key={contract.id}>
                <td><strong>{contract.title}</strong></td>
                <td>{contract.client}</td>
                <td><strong style={{color: '#10b981'}}>{contract.value}</strong></td>
                <td>{contract.startDate}</td>
                <td>{contract.endDate}</td>
                <td>
                  {contract.status === 'Active' ? (
                    <span className="badge-success">{contract.status}</span>
                  ) : (
                    <span className="badge-gray">{contract.status}</span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon btn-edit">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
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

export default ContractsManagement;
