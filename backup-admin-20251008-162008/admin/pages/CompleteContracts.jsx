import React, { useState } from 'react';

const CompleteContracts = () => {
  const [contracts, setContracts] = useState([
    { id: 1, title: 'NEOM Construction Project', client: 'NEOM', value: 'SAR 15M', status: 'Ongoing', startDate: '2024-01-15', endDate: '2025-12-31' },
    { id: 2, title: 'Red Sea Airport Operations', client: 'Red Sea Global', value: 'SAR 8M', status: 'Ongoing', startDate: '2024-03-01', endDate: '2025-06-30' },
    { id: 3, title: 'Diriyah Heritage Services', client: 'Diriyah Gate', value: 'SAR 12M', status: 'Completed', startDate: '2023-06-01', endDate: '2024-05-31' },
    { id: 4, title: 'Qiddiya Entertainment Staff', client: 'Qiddiya', value: 'SAR 6M', status: 'Ongoing', startDate: '2024-08-01', endDate: '2025-12-31' },
    { id: 5, title: 'Royal Commission Office Support', client: 'Royal Commission', value: 'SAR 4M', status: 'Completed', startDate: '2023-09-01', endDate: '2024-08-31' }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Excellence in Service Award 2024', description: 'Recognized for outstanding manpower services', date: '2024-01-15', category: 'Award' },
    { id: 2, title: 'ISO 9001:2015 Certification', description: 'Quality management system certification', date: '2023-11-20', category: 'Certification' },
    { id: 3, title: '1000+ Successful Placements', description: 'Milestone achievement in workforce placement', date: '2024-03-10', category: 'Milestone' },
    { id: 4, title: 'Best Manpower Company 2023', description: 'Industry recognition for excellence', date: '2023-12-05', category: 'Award' }
  ]);

  const [activeTab, setActiveTab] = useState('contracts');
  const [showContractModal, setShowContractModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const [contractFormData, setContractFormData] = useState({
    title: '',
    client: '',
    value: '',
    status: 'Ongoing',
    startDate: '',
    endDate: ''
  });

  const [achievementFormData, setAchievementFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'Award'
  });

  const handleAddContract = () => {
    setEditingContract(null);
    setContractFormData({ title: '', client: '', value: '', status: 'Ongoing', startDate: '', endDate: '' });
    setShowContractModal(true);
  };

  const handleEditContract = (contract) => {
    setEditingContract(contract);
    setContractFormData(contract);
    setShowContractModal(true);
  };

  const handleDeleteContract = (id) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  const handleSubmitContract = (e) => {
    e.preventDefault();
    if (editingContract) {
      setContracts(contracts.map(c => c.id === editingContract.id ? { ...contractFormData, id: c.id } : c));
    } else {
      setContracts([...contracts, { ...contractFormData, id: Date.now() }]);
    }
    setShowContractModal(false);
  };

  const handleAddAchievement = () => {
    setEditingAchievement(null);
    setAchievementFormData({ title: '', description: '', date: '', category: 'Award' });
    setShowAchievementModal(true);
  };

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setAchievementFormData(achievement);
    setShowAchievementModal(true);
  };

  const handleDeleteAchievement = (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      setAchievements(achievements.filter(a => a.id !== id));
    }
  };

  const handleSubmitAchievement = (e) => {
    e.preventDefault();
    if (editingAchievement) {
      setAchievements(achievements.map(a => a.id === editingAchievement.id ? { ...achievementFormData, id: a.id } : a));
    } else {
      setAchievements([...achievements, { ...achievementFormData, id: Date.now() }]);
    }
    setShowAchievementModal(false);
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
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>Contracts & Achievements</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage contracts and company achievements</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('contracts')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'contracts' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'white',
              color: activeTab === 'contracts' ? 'white' : '#64748b',
              border: activeTab === 'contracts' ? 'none' : '2px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📋 Contracts ({contracts.length})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'achievements' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'white',
              color: activeTab === 'achievements' ? 'white' : '#64748b',
              border: activeTab === 'achievements' ? 'none' : '2px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🏆 Achievements ({achievements.length})
          </button>
        </div>
      </div>

      {activeTab === 'contracts' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={handleAddContract}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              ➕ Add New Contract
            </button>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '2px solid #e2e8f0'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Contract</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Client</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Value</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Duration</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(contract => (
                  <tr key={contract.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{contract.title}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{contract.client}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#059669', fontWeight: '600' }}>{contract.value}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: contract.status === 'Ongoing' ? '#dbeafe' : '#d1fae5',
                        color: contract.status === 'Ongoing' ? '#2563eb' : '#059669'
                      }}>
                        {contract.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
                      {contract.startDate} - {contract.endDate}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditContract(contract)}
                          style={{
                            padding: '6px 12px',
                            background: '#e0e7ff',
                            color: '#4f46e5',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteContract(contract.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={handleAddAchievement}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}
            >
              ➕ Add New Achievement
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '2px solid #e2e8f0'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {achievement.title}
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: achievement.category === 'Award' ? '#dbeafe' : 
                               achievement.category === 'Certification' ? '#d1fae5' : '#fef3c7',
                    color: achievement.category === 'Award' ? '#2563eb' : 
                           achievement.category === 'Certification' ? '#059669' : '#d97706'
                  }}>
                    {achievement.category}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.6' }}>
                  {achievement.description}
                </p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
                  {achievement.date}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <button
                    onClick={() => handleEditAchievement(achievement)}
                    style={{
                      padding: '8px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#f59e0b'
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteAchievement(achievement.id)}
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
        </div>
      )}

      {/* Contract Modal */}
      {showContractModal && (
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
          onClick={() => setShowContractModal(false)}
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
                {editingContract ? 'Edit Contract' : 'Add New Contract'}
              </h3>
              <button
                onClick={() => setShowContractModal(false)}
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
            <form onSubmit={handleSubmitContract} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Contract Title
                  </label>
                  <input
                    type="text"
                    value={contractFormData.title}
                    onChange={e => setContractFormData({...contractFormData, title: e.target.value})}
                    required
                    placeholder="e.g., NEOM Construction Project"
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
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Client
                  </label>
                  <input
                    type="text"
                    value={contractFormData.client}
                    onChange={e => setContractFormData({...contractFormData, client: e.target.value})}
                    required
                    placeholder="e.g., NEOM"
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
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Contract Value
                  </label>
                  <input
                    type="text"
                    value={contractFormData.value}
                    onChange={e => setContractFormData({...contractFormData, value: e.target.value})}
                    required
                    placeholder="e.g., SAR 15M"
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
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Status
                  </label>
                  <select
                    value={contractFormData.status}
                    onChange={e => setContractFormData({...contractFormData, status: e.target.value})}
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
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={contractFormData.startDate}
                    onChange={e => setContractFormData({...contractFormData, startDate: e.target.value})}
                    required
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
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={contractFormData.endDate}
                    onChange={e => setContractFormData({...contractFormData, endDate: e.target.value})}
                    required
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
                  onClick={() => setShowContractModal(false)}
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
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {editingContract ? 'Update Contract' : 'Add Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {showAchievementModal && (
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
          onClick={() => setShowAchievementModal(false)}
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
                {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
              </h3>
              <button
                onClick={() => setShowAchievementModal(false)}
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
            <form onSubmit={handleSubmitAchievement} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Achievement Title
                </label>
                <input
                  type="text"
                  value={achievementFormData.title}
                  onChange={e => setAchievementFormData({...achievementFormData, title: e.target.value})}
                  required
                  placeholder="e.g., Excellence in Service Award 2024"
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
                  Description
                </label>
                <textarea
                  value={achievementFormData.description}
                  onChange={e => setAchievementFormData({...achievementFormData, description: e.target.value})}
                  required
                  rows="3"
                  placeholder="Brief description of the achievement"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={achievementFormData.date}
                    onChange={e => setAchievementFormData({...achievementFormData, date: e.target.value})}
                    required
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
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Category
                  </label>
                  <select
                    value={achievementFormData.category}
                    onChange={e => setAchievementFormData({...achievementFormData, category: e.target.value})}
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
                    <option value="Award">Award</option>
                    <option value="Certification">Certification</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Recognition">Recognition</option>
                  </select>
                </div>
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
                  onClick={() => setShowAchievementModal(false)}
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
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  {editingAchievement ? 'Update Achievement' : 'Add Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteContracts;
