import React from 'react';
import JobForm from './JobForm';
import './Modal.css';

const EditJobModal = ({ isOpen, job, onClose, onSubmit, isLoading }) => {
  if (!isOpen || !job) return null;

  const handleSubmit = async (formData) => {
    try {
      await onSubmit(job._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Job</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <JobForm
            initialData={job}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;

