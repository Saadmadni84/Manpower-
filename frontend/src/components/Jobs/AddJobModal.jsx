import React from 'react';
import JobForm from './JobForm';
import './Modal.css';

const AddJobModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  if (!isOpen) return null;

  const handleSubmit = async (formData) => {
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Job</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <JobForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddJobModal;

