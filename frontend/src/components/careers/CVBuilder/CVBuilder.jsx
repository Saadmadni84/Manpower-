import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import TextArea from '../../ui/Input/TextArea';
import Card from '../../ui/Card/Card';
import styles from './CVBuilder.module.css';

const CVBuilder = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: ''
    },
    professionalSummary: '',
    experience: [
      {
        id: 1,
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        degree: '',
        institution: '',
        location: '',
        graduationYear: '',
        gpa: ''
      }
    ],
    skills: [],
    languages: [],
    certifications: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const steps = [
    { id: 1, title: 'Personal Information', icon: '👤' },
    { id: 2, title: 'Professional Summary', icon: '📝' },
    { id: 3, title: 'Work Experience', icon: '💼' },
    { id: 4, title: 'Education', icon: '🎓' },
    { id: 5, title: 'Skills & Languages', icon: '🛠️' },
    { id: 6, title: 'Preview & Download', icon: '📄' }
  ];

  const handlePersonalInfoChange = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    const newId = Math.max(...cvData.experience.map(exp => exp.id)) + 1;
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: newId,
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const removeExperience = (id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    const newId = Math.max(...cvData.education.map(edu => edu.id)) + 1;
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: newId,
        degree: '',
        institution: '',
        location: '',
        graduationYear: '',
        gpa: ''
      }]
    }));
  };

  const removeEducation = (id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setCvData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setCvData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const downloadCV = () => {
    // In a real application, this would generate and download a PDF
    const cvContent = `
      ${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}
      ${cvData.personalInfo.email} | ${cvData.personalInfo.phone}
      
      PROFESSIONAL SUMMARY
      ${cvData.professionalSummary}
      
      EXPERIENCE
      ${cvData.experience.map(exp => `
        ${exp.position} at ${exp.company}
        ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
        ${exp.description}
      `).join('\n')}
      
      EDUCATION
      ${cvData.education.map(edu => `
        ${edu.degree} from ${edu.institution}
        ${edu.graduationYear}
      `).join('\n')}
      
      SKILLS
      ${cvData.skills.join(', ')}
      
      LANGUAGES
      ${cvData.languages.join(', ')}
      
      CERTIFICATIONS
      ${cvData.certifications.join(', ')}
    `;
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h3>Personal Information</h3>
            <div className={styles.formGrid}>
              <Input
                label="First Name"
                value={cvData.personalInfo.firstName}
                onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                placeholder="Enter your first name"
              />
              <Input
                label="Last Name"
                value={cvData.personalInfo.lastName}
                onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                placeholder="Enter your last name"
              />
              <Input
                label="Email"
                type="email"
                value={cvData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
              <Input
                label="Phone"
                type="tel"
                value={cvData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="+966 50 123 4567"
              />
              <Input
                label="Address"
                value={cvData.personalInfo.address}
                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                placeholder="Your address"
              />
              <Input
                label="LinkedIn (Optional)"
                value={cvData.personalInfo.linkedin}
                onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h3>Professional Summary</h3>
            <TextArea
              label="Tell us about yourself"
              value={cvData.professionalSummary}
              onChange={(e) => setCvData(prev => ({ ...prev, professionalSummary: e.target.value }))}
              placeholder="Write a brief summary of your professional background, skills, and career objectives..."
              rows={6}
            />
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3>Work Experience</h3>
              <Button variant="outline" size="small" onClick={addExperience}>
                Add Experience
              </Button>
            </div>
            {cvData.experience.map((exp, index) => (
              <Card key={exp.id} className={styles.experienceCard}>
                <div className={styles.cardHeader}>
                  <h4>Experience #{index + 1}</h4>
                  {cvData.experience.length > 1 && (
                    <Button 
                      variant="danger" 
                      size="small" 
                      onClick={() => removeExperience(exp.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className={styles.formGrid}>
                  <Input
                    label="Position/Job Title"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                    placeholder="e.g., Software Engineer"
                  />
                  <Input
                    label="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                  <Input
                    label="Location"
                    value={exp.location}
                    onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                    placeholder="City, Country"
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                  <div className={styles.checkboxGroup}>
                    <label>
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => handleExperienceChange(exp.id, 'current', e.target.checked)}
                      />
                      Currently working here
                    </label>
                  </div>
                </div>
                <TextArea
                  label="Job Description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                />
              </Card>
            ))}
          </div>
        );

      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3>Education</h3>
              <Button variant="outline" size="small" onClick={addEducation}>
                Add Education
              </Button>
            </div>
            {cvData.education.map((edu, index) => (
              <Card key={edu.id} className={styles.educationCard}>
                <div className={styles.cardHeader}>
                  <h4>Education #{index + 1}</h4>
                  {cvData.education.length > 1 && (
                    <Button 
                      variant="danger" 
                      size="small" 
                      onClick={() => removeEducation(edu.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className={styles.formGrid}>
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                    placeholder="e.g., Bachelor of Engineering"
                  />
                  <Input
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                    placeholder="University/School name"
                  />
                  <Input
                    label="Location"
                    value={edu.location}
                    onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                    placeholder="City, Country"
                  />
                  <Input
                    label="Graduation Year"
                    value={edu.graduationYear}
                    onChange={(e) => handleEducationChange(edu.id, 'graduationYear', e.target.value)}
                    placeholder="2020"
                  />
                  <Input
                    label="GPA (Optional)"
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(edu.id, 'gpa', e.target.value)}
                    placeholder="3.5/4.0"
                  />
                </div>
              </Card>
            ))}
          </div>
        );

      case 5:
        return (
          <div className={styles.stepContent}>
            <h3>Skills & Languages</h3>
            
            <div className={styles.skillsSection}>
              <h4>Skills</h4>
              <div className={styles.addItem}>
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button variant="primary" size="small" onClick={addSkill}>
                  Add Skill
                </Button>
              </div>
              <div className={styles.itemsList}>
                {cvData.skills.map((skill, index) => (
                  <div key={index} className={styles.item}>
                    <span>{skill}</span>
                    <button onClick={() => removeSkill(index)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.skillsSection}>
              <h4>Languages</h4>
              <div className={styles.addItem}>
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="e.g., Arabic (Native), English (Fluent)"
                  onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                />
                <Button variant="primary" size="small" onClick={addLanguage}>
                  Add Language
                </Button>
              </div>
              <div className={styles.itemsList}>
                {cvData.languages.map((language, index) => (
                  <div key={index} className={styles.item}>
                    <span>{language}</span>
                    <button onClick={() => removeLanguage(index)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.skillsSection}>
              <h4>Certifications</h4>
              <div className={styles.addItem}>
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Enter certification"
                  onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                />
                <Button variant="primary" size="small" onClick={addCertification}>
                  Add Certification
                </Button>
              </div>
              <div className={styles.itemsList}>
                {cvData.certifications.map((cert, index) => (
                  <div key={index} className={styles.item}>
                    <span>{cert}</span>
                    <button onClick={() => removeCertification(index)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3>Preview & Download</h3>
              <Button variant="primary" onClick={downloadCV}>
                Download CV
              </Button>
            </div>
            <div className={styles.cvPreview}>
              <div className={styles.cvHeader}>
                <h2>{cvData.personalInfo.firstName} {cvData.personalInfo.lastName}</h2>
                <p>{cvData.personalInfo.email} | {cvData.personalInfo.phone}</p>
                {cvData.personalInfo.address && <p>{cvData.personalInfo.address}</p>}
              </div>
              
              {cvData.professionalSummary && (
                <div className={styles.cvSection}>
                  <h3>Professional Summary</h3>
                  <p>{cvData.professionalSummary}</p>
                </div>
              )}

              {cvData.experience.some(exp => exp.position) && (
                <div className={styles.cvSection}>
                  <h3>Experience</h3>
                  {cvData.experience.filter(exp => exp.position).map((exp, index) => (
                    <div key={index} className={styles.cvItem}>
                      <h4>{exp.position} at {exp.company}</h4>
                      <p className={styles.cvDates}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate} | {exp.location}
                      </p>
                      {exp.description && <p>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {cvData.education.some(edu => edu.degree) && (
                <div className={styles.cvSection}>
                  <h3>Education</h3>
                  {cvData.education.filter(edu => edu.degree).map((edu, index) => (
                    <div key={index} className={styles.cvItem}>
                      <h4>{edu.degree} from {edu.institution}</h4>
                      <p>{edu.graduationYear} | {edu.location}</p>
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              )}

              {cvData.skills.length > 0 && (
                <div className={styles.cvSection}>
                  <h3>Skills</h3>
                  <p>{cvData.skills.join(', ')}</p>
                </div>
              )}

              {cvData.languages.length > 0 && (
                <div className={styles.cvSection}>
                  <h3>Languages</h3>
                  <p>{cvData.languages.join(', ')}</p>
                </div>
              )}

              {cvData.certifications.length > 0 && (
                <div className={styles.cvSection}>
                  <h3>Certifications</h3>
                  <p>{cvData.certifications.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.cvBuilder}>
      <div className={styles.builderContainer}>
        {/* Progress Steps */}
        <div className={styles.progressSteps}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.step} ${currentStep === step.id ? styles.active : ''} ${currentStep > step.id ? styles.completed : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <span className={styles.stepIcon}>{step.icon}</span>
              <span className={styles.stepTitle}>{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className={styles.stepContainer}>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <span className={styles.stepIndicator}>
            Step {currentStep} of {steps.length}
          </span>
          
          <Button
            variant="primary"
            onClick={nextStep}
            disabled={currentStep === steps.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
