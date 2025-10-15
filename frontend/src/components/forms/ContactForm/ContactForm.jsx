import React, { useState } from 'react';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import TextArea from '../../ui/Input/TextArea';
import Select from '../../ui/Select/Select';
import { contactAPI } from '../../../services/api/contactAPI';
import { useNotificationContext } from '../../../context/NotificationContext';
import styles from './ContactForm.module.css';

const ContactForm = () => {
  const { success, error } = useNotificationContext();
  
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      nationality: ''
    },
    subject: '',
    message: '',
    serviceType: 'General Inquiry',
    inquiryType: 'general',
    priority: 'medium',
    location: {
      city: '',
      region: '',
      country: 'Saudi Arabia'
    },
    projectDetails: {
      budget: '',
      timeline: '',
      requirements: '',
      previousExperience: '',
      preferredStartDate: ''
    },
    additionalInfo: {
      source: 'website',
      referrer: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      pageUrl: window.location.href
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object updates
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Personal Info validation
    if (!formData.personalInfo.name.trim()) {
      newErrors['personalInfo.name'] = 'Name is required';
    }
    
    if (!formData.personalInfo.email.trim()) {
      newErrors['personalInfo.email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
      newErrors['personalInfo.email'] = 'Email is invalid';
    }
    
    if (!formData.personalInfo.phone.trim()) {
      newErrors['personalInfo.phone'] = 'Phone number is required';
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.personalInfo.phone.replace(/[\s\-()]/g, ''))) {
      newErrors['personalInfo.phone'] = 'Phone number is invalid';
    }
    
    // Subject and message validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    // Location validation
    if (!formData.location.city.trim()) {
      newErrors['location.city'] = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await contactAPI.sendMessage(formData);
      
      if (response.success) {
        success('Your enquiry has been submitted successfully! We will get back to you soon.');
        
        // Reset form
        setFormData({
          personalInfo: {
            name: '',
            email: '',
            phone: '',
            company: '',
            position: '',
            nationality: ''
          },
          subject: '',
          message: '',
          serviceType: 'General Inquiry',
          inquiryType: 'general',
          priority: 'medium',
          location: {
            city: '',
            region: '',
            country: 'Saudi Arabia'
          },
          projectDetails: {
            budget: '',
            timeline: '',
            requirements: '',
            previousExperience: '',
            preferredStartDate: ''
          },
          additionalInfo: {
            source: 'website',
            referrer: '',
            utmSource: '',
            utmMedium: '',
            utmCampaign: '',
            pageUrl: window.location.href
          }
        });
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      error('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypeOptions = [
    { value: 'General Inquiry', label: 'General Inquiry' },
    { value: 'Airport Operations', label: 'Airport Operations' },
    { value: 'Corporate Offices', label: 'Corporate Offices' },
    { value: 'Catering Services', label: 'Catering Services' },
    { value: 'Logistics & Warehousing', label: 'Logistics & Warehousing' },
    { value: 'Construction & Engineering', label: 'Construction & Engineering' },
    { value: 'Facility Management', label: 'Facility Management' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Job Application', label: 'Job Application' },
    { value: 'Complaint', label: 'Complaint' },
    { value: 'Feedback', label: 'Feedback' }
  ];

  const inquiryTypeOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'service-request', label: 'Service Request' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'job-application', label: 'Job Application' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'quote-request', label: 'Quote Request' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Personal Information Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <div className={styles.row}>
          <Input
            name="personalInfo.name"
            label="Full Name *"
            value={formData.personalInfo.name}
            onChange={handleChange}
            error={errors['personalInfo.name']}
            required
          />
          <Input
            name="personalInfo.email"
            type="email"
            label="Email Address *"
            value={formData.personalInfo.email}
            onChange={handleChange}
            error={errors['personalInfo.email']}
            required
          />
        </div>
        
        <div className={styles.row}>
          <Input
            name="personalInfo.phone"
            type="tel"
            label="Phone Number *"
            value={formData.personalInfo.phone}
            onChange={handleChange}
            error={errors['personalInfo.phone']}
            required
          />
          <Input
            name="personalInfo.nationality"
            label="Nationality"
            value={formData.personalInfo.nationality}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.row}>
          <Input
            name="personalInfo.company"
            label="Company"
            value={formData.personalInfo.company}
            onChange={handleChange}
          />
          <Input
            name="personalInfo.position"
            label="Position"
            value={formData.personalInfo.position}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Location Information Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Location Information</h3>
        <div className={styles.row}>
          <Input
            name="location.city"
            label="City *"
            value={formData.location.city}
            onChange={handleChange}
            error={errors['location.city']}
            required
          />
          <Input
            name="location.region"
            label="Region"
            value={formData.location.region}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Inquiry Details Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Inquiry Details</h3>
        <div className={styles.row}>
          <Select
            name="serviceType"
            label="Service Type *"
            value={formData.serviceType}
            onChange={handleChange}
            options={serviceTypeOptions}
            required
          />
          <Select
            name="inquiryType"
            label="Inquiry Type *"
            value={formData.inquiryType}
            onChange={handleChange}
            options={inquiryTypeOptions}
            required
          />
        </div>
        
        <div className={styles.row}>
          <Input
            name="subject"
            label="Subject *"
            value={formData.subject}
            onChange={handleChange}
            error={errors.subject}
            required
          />
          <Select
            name="priority"
            label="Priority"
            value={formData.priority}
            onChange={handleChange}
            options={priorityOptions}
          />
        </div>
        
        <TextArea
          name="message"
          label="Message *"
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          rows={5}
          required
          placeholder="Please provide detailed information about your inquiry..."
        />
      </div>

      {/* Project Details Section (Conditional) */}
      {(formData.inquiryType === 'service-request' || formData.inquiryType === 'quote-request') && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Project Details</h3>
          <div className={styles.row}>
            <Input
              name="projectDetails.budget"
              label="Budget Range"
              value={formData.projectDetails.budget}
              onChange={handleChange}
              placeholder="e.g., $10,000 - $50,000"
            />
            <Input
              name="projectDetails.timeline"
              label="Project Timeline"
              value={formData.projectDetails.timeline}
              onChange={handleChange}
              placeholder="e.g., 3 months, ASAP"
            />
          </div>
          
          <div className={styles.row}>
            <Input
              name="projectDetails.preferredStartDate"
              type="date"
              label="Preferred Start Date"
              value={formData.projectDetails.preferredStartDate}
              onChange={handleChange}
            />
          </div>
          
          <TextArea
            name="projectDetails.requirements"
            label="Specific Requirements"
            value={formData.projectDetails.requirements}
            onChange={handleChange}
            rows={3}
            placeholder="Please describe your specific requirements..."
          />
          
          <TextArea
            name="projectDetails.previousExperience"
            label="Previous Experience"
            value={formData.projectDetails.previousExperience}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about your previous experience with similar services..."
          />
        </div>
      )}

      {/* Additional Information Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Additional Information</h3>
        <div className={styles.row}>
          <Input
            name="additionalInfo.referrer"
            label="How did you hear about us?"
            value={formData.additionalInfo.referrer}
            onChange={handleChange}
            placeholder="e.g., Google search, referral from friend"
          />
        </div>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="large"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Sending...' : 'Send Enquiry'}
      </Button>
    </form>
  );
};

export default ContactForm;

