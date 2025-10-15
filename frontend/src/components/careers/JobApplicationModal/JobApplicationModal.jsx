import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../common/Modal/Modal';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import TextArea from '../../ui/Input/TextArea';
import styles from './JobApplicationModal.module.css';

const JobApplicationModal = ({ isOpen, onClose, jobTitle, jobId }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: '',
    currentPosition: '',
    expectedSalary: '',
    coverLetter: '',
    cvFile: null,
    visaStatus: '',
    languages: '',
    availability: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({
        ...prev,
        cvFile: file
      }));
      setErrors(prev => ({
        ...prev,
        cvFile: ''
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        cvFile: 'Please upload a PDF file'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.experience) newErrors.experience = 'Experience level is required';
    if (!formData.visaStatus) newErrors.visaStatus = 'Visa status is required';
    if (!formData.cvFile) newErrors.cvFile = 'CV upload is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would submit to backend
      console.log('Application submitted:', {
        jobId,
        jobTitle,
        ...formData
      });
      
      // Show success message and close modal
      alert('Application submitted successfully! We will contact you soon.');
      onClose();
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        experience: '',
        currentPosition: '',
        expectedSalary: '',
        coverLetter: '',
        cvFile: null,
        visaStatus: '',
        languages: '',
        availability: ''
      });
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large">
      <div className={styles.applicationModal}>
        <div className={styles.modalHeader}>
          <h2>Apply for {jobTitle}</h2>
          <p>Fill out the form below to submit your application</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.applicationForm}>
          {/* Personal Information */}
          <div className={styles.formSection}>
            <h3>Personal Information</h3>
            <div className={styles.formRow}>
              <Input
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                placeholder="Enter your first name"
              />
              <Input
                label="Last Name *"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                placeholder="Enter your last name"
              />
            </div>
            
            <div className={styles.formRow}>
              <Input
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="your.email@example.com"
              />
              <Input
                label="Phone Number *"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="+966 50 123 4567"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className={styles.formSection}>
            <h3>Professional Information</h3>
            <div className={styles.formRow}>
              <div className={styles.selectGroup}>
                <label>Experience Level *</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`${styles.selectInput} ${errors.experience ? styles.error : ''}`}
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-1 years)</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
                {errors.experience && <span className={styles.errorText}>{errors.experience}</span>}
              </div>
              
              <Input
                label="Current Position"
                name="currentPosition"
                value={formData.currentPosition}
                onChange={handleInputChange}
                placeholder="Your current job title"
              />
            </div>
            
            <div className={styles.formRow}>
              <Input
                label="Expected Salary (SAR)"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleInputChange}
                placeholder="e.g., 5000-7000"
              />
              
              <div className={styles.selectGroup}>
                <label>Visa Status *</label>
                <select
                  name="visaStatus"
                  value={formData.visaStatus}
                  onChange={handleInputChange}
                  className={`${styles.selectInput} ${errors.visaStatus ? styles.error : ''}`}
                >
                  <option value="">Select visa status</option>
                  <option value="saudi-national">Saudi National</option>
                  <option value="iqama-holder">Iqama Holder</option>
                  <option value="visitor-visa">Visitor Visa</option>
                  <option value="work-visa">Work Visa</option>
                  <option value="need-sponsorship">Need Sponsorship</option>
                </select>
                {errors.visaStatus && <span className={styles.errorText}>{errors.visaStatus}</span>}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className={styles.formSection}>
            <h3>Additional Information</h3>
            <Input
              label="Languages Spoken"
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              placeholder="e.g., Arabic (Native), English (Fluent)"
            />
            
            <Input
              label="Availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              placeholder="e.g., Available immediately, 2 weeks notice"
            />
          </div>

          {/* Cover Letter */}
          <div className={styles.formSection}>
            <h3>Cover Letter</h3>
            <TextArea
              label="Cover Letter (Optional)"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              rows={4}
            />
          </div>

          {/* CV Upload */}
          <div className={styles.formSection}>
            <h3>CV Upload</h3>
            <div className={styles.fileUploadGroup}>
              <label>Upload CV (PDF only) *</label>
              <div className={styles.fileUpload}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className={styles.fileLabel}>
                  <span className={styles.fileIcon}>📄</span>
                  <span className={styles.fileText}>
                    {formData.cvFile ? formData.cvFile.name : 'Choose PDF file or drag and drop'}
                  </span>
                </label>
              </div>
              {errors.cvFile && <span className={styles.errorText}>{errors.cvFile}</span>}
              <p className={styles.fileHint}>Maximum file size: 5MB</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default JobApplicationModal;
