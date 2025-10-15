const { sendEmail, sendBulkEmail } = require('../config/mailer');
const { APP_CONSTANTS } = require('../config/constants');

class EmailService {
  // Send contact form notification
  static async sendContactFormNotification(inquiryData) {
    try {
      const recipients = [process.env.ADMIN_EMAIL || 'admin@manpowercompany.com'];
      
      await sendEmail(
        recipients[0],
        APP_CONSTANTS.EMAIL_TEMPLATES.CONTACT_FORM,
        {
          name: inquiryData.personalInfo.name,
          email: inquiryData.personalInfo.email,
          phone: inquiryData.personalInfo.phone,
          company: inquiryData.personalInfo.company,
          subject: inquiryData.subject,
          message: inquiryData.message,
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Contact form notification sent' };
    } catch (error) {
      console.error('Failed to send contact form notification:', error);
      throw new Error('Failed to send contact form notification');
    }
  }

  // Send job application notification
  static async sendJobApplicationNotification(applicationData) {
    try {
      const recipients = [process.env.ADMIN_EMAIL || 'admin@manpowercompany.com'];
      
      await sendEmail(
        recipients[0],
        APP_CONSTANTS.EMAIL_TEMPLATES.JOB_APPLICATION,
        {
          name: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
          email: applicationData.personalInfo.email,
          phone: applicationData.personalInfo.phone,
          position: applicationData.jobPosting.title,
          experience: applicationData.experience.totalYears,
          location: applicationData.location.preferredCity,
          cvUrl: applicationData.documents.cv.url,
          message: applicationData.message,
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Job application notification sent' };
    } catch (error) {
      console.error('Failed to send job application notification:', error);
      throw new Error('Failed to send job application notification');
    }
  }

  // Send admin notification
  static async sendAdminNotification(action, adminUser, details) {
    try {
      const recipients = [process.env.ADMIN_EMAIL || 'admin@manpowercompany.com'];
      
      await sendEmail(
        recipients[0],
        APP_CONSTANTS.EMAIL_TEMPLATES.ADMIN_NOTIFICATION,
        {
          action,
          adminUser: adminUser.fullName,
          timestamp: new Date().toLocaleString(),
          details,
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Admin notification sent' };
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      throw new Error('Failed to send admin notification');
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(user, resetToken) {
    try {
      await sendEmail(
        user.personalInfo.email,
        APP_CONSTANTS.EMAIL_TEMPLATES.PASSWORD_RESET,
        {
          name: user.fullName,
          resetToken,
          companyName: process.env.COMPANY_NAME || 'Manpower Company',
          resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        }
      );

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(user) {
    try {
      await sendEmail(
        user.personalInfo.email,
        APP_CONSTANTS.EMAIL_TEMPLATES.WELCOME,
        {
          name: user.fullName,
          companyName: process.env.COMPANY_NAME || 'Manpower Company',
          loginUrl: `${process.env.FRONTEND_URL}/admin/login`
        }
      );

      return { success: true, message: 'Welcome email sent' };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  // Send bulk email
  static async sendBulkNotification(recipients, template, variables) {
    try {
      const results = await sendBulkEmail(recipients, template, variables);
      
      return {
        success: true,
        message: 'Bulk email sent',
        results
      };
    } catch (error) {
      console.error('Failed to send bulk email:', error);
      throw new Error('Failed to send bulk email');
    }
  }

  // Send email verification
  static async sendEmailVerification(user, verificationToken) {
    try {
      await sendEmail(
        user.personalInfo.email,
        'emailVerification',
        {
          name: user.fullName,
          verificationToken,
          companyName: process.env.COMPANY_NAME || 'Manpower Company',
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
        }
      );

      return { success: true, message: 'Email verification sent' };
    } catch (error) {
      console.error('Failed to send email verification:', error);
      throw new Error('Failed to send email verification');
    }
  }

  // Send interview invitation
  static async sendInterviewInvitation(application, interviewData) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'interviewInvitation',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          position: application.jobPosting.title,
          interviewDate: interviewData.scheduledDate,
          interviewTime: interviewData.scheduledDate,
          location: interviewData.location,
          interviewer: interviewData.interviewer,
          notes: interviewData.notes,
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Interview invitation sent' };
    } catch (error) {
      console.error('Failed to send interview invitation:', error);
      throw new Error('Failed to send interview invitation');
    }
  }

  // Send application status update
  static async sendApplicationStatusUpdate(application, status, notes) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'applicationStatusUpdate',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          position: application.jobPosting.title,
          status,
          notes,
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Application status update sent' };
    } catch (error) {
      console.error('Failed to send application status update:', error);
      throw new Error('Failed to send application status update');
    }
  }

  // Send contract notification
  static async sendContractNotification(contractData) {
    try {
      const recipients = [process.env.ADMIN_EMAIL || 'admin@manpowercompany.com'];
      
      await sendEmail(
        recipients[0],
        'contractNotification',
        {
          contractTitle: contractData.title,
          clientName: contractData.client.name,
          contractValue: contractData.value,
          startDate: contractData.timeline.startDate,
          endDate: contractData.timeline.endDate,
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Contract notification sent' };
    } catch (error) {
      console.error('Failed to send contract notification:', error);
      throw new Error('Failed to send contract notification');
    }
  }

  // Send system alert
  static async sendSystemAlert(alertType, message, details) {
    try {
      const recipients = [process.env.ADMIN_EMAIL || 'admin@manpowercompany.com'];
      
      await sendEmail(
        recipients[0],
        'systemAlert',
        {
          alertType,
          message,
          details,
          timestamp: new Date().toLocaleString(),
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'System alert sent' };
    } catch (error) {
      console.error('Failed to send system alert:', error);
      throw new Error('Failed to send system alert');
    }
  }

  // ==================== CAREER MANAGEMENT EMAIL NOTIFICATIONS ====================

  // Send new application confirmation to candidate
  static async sendApplicationConfirmation(application, job) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'applicationConfirmation',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          applicationId: application.applicationId,
          jobTitle: job.title.en,
          jobCode: job.jobCode,
          submittedDate: new Date(application.submittedAt).toLocaleDateString(),
          companyName: process.env.COMPANY_NAME || 'Manpower Company',
          trackingUrl: `${process.env.FRONTEND_URL}/track-application/${application.applicationId}`
        }
      );

      return { success: true, message: 'Application confirmation sent' };
    } catch (error) {
      console.error('Failed to send application confirmation:', error);
      throw new Error('Failed to send application confirmation');
    }
  }

  // Send new application notification to HR/Recruiter
  static async sendNewApplicationToRecruiter(application, job, recruiter) {
    try {
      const recipientEmail = recruiter?.email || process.env.HR_EMAIL || process.env.ADMIN_EMAIL;
      
      await sendEmail(
        recipientEmail,
        'newApplicationRecruiter',
        {
          recruiterName: recruiter?.fullName || 'HR Team',
          candidateName: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          applicationId: application.applicationId,
          jobTitle: job.title.en,
          jobCode: job.jobCode,
          experience: `${application.professional.totalExperience} years`,
          expectedSalary: application.professional.expectedSalary,
          education: application.education[0]?.level || 'Not specified',
          submittedDate: new Date(application.submittedAt).toLocaleDateString(),
          reviewUrl: `${process.env.ADMIN_URL}/applications/${application._id}`,
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'New application notification sent to recruiter' };
    } catch (error) {
      console.error('Failed to send new application to recruiter:', error);
      throw new Error('Failed to send new application to recruiter');
    }
  }

  // Send interview invitation to candidate
  static async sendInterviewSchedule(application, job, interview) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'interviewSchedule',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          jobTitle: job.title.en,
          interviewType: interview.type.replace('_', ' ').toUpperCase(),
          interviewDate: new Date(interview.scheduledDate).toLocaleDateString(),
          interviewTime: interview.scheduledTime,
          duration: interview.duration,
          location: interview.location.type === 'online' ? 'Online (link will be sent separately)' : interview.location.address,
          meetingLink: interview.location.meetingLink || '',
          interviewers: interview.interviewers.map(i => i.name).join(', '),
          notes: interview.notes || '',
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Interview invitation sent' };
    } catch (error) {
      console.error('Failed to send interview schedule:', error);
      throw new Error('Failed to send interview schedule');
    }
  }

  // Send interview reminder
  static async sendInterviewReminder(application, job, interview, hoursBefore = 24) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'interviewReminder',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          jobTitle: job.title.en,
          interviewDate: new Date(interview.scheduledDate).toLocaleDateString(),
          interviewTime: interview.scheduledTime,
          hoursBefore,
          location: interview.location.type === 'online' ? 'Online' : interview.location.address,
          meetingLink: interview.location.meetingLink || '',
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Interview reminder sent' };
    } catch (error) {
      console.error('Failed to send interview reminder:', error);
      throw new Error('Failed to send interview reminder');
    }
  }

  // Send interview reschedule notification
  static async sendInterviewReschedule(application, job, interview, reason) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'interviewReschedule',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          jobTitle: job.title.en,
          newInterviewDate: new Date(interview.scheduledDate).toLocaleDateString(),
          newInterviewTime: interview.scheduledTime,
          reason: reason || 'Scheduling conflict',
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Interview reschedule notification sent' };
    } catch (error) {
      console.error('Failed to send interview reschedule:', error);
      throw new Error('Failed to send interview reschedule');
    }
  }

  // Send interview cancellation
  static async sendInterviewCancellation(application, job, interview, reason) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'interviewCancellation',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          jobTitle: job.title.en,
          interviewDate: new Date(interview.scheduledDate).toLocaleDateString(),
          reason: reason || 'Position filled',
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Interview cancellation sent' };
    } catch (error) {
      console.error('Failed to send interview cancellation:', error);
      throw new Error('Failed to send interview cancellation');
    }
  }

  // Send application status update to candidate
  static async sendStatusUpdate(application, job, newStatus, notes) {
    try {
      const statusMessages = {
        screening: 'Your application is being reviewed by our team.',
        interview_scheduled: 'Congratulations! We would like to invite you for an interview.',
        interviewed: 'Thank you for interviewing with us. We will be in touch soon.',
        technical_test: 'Please complete the technical assessment we have sent.',
        reference_check: 'We are conducting reference checks.',
        offer_made: 'Congratulations! We are pleased to extend you an offer.',
        hired: 'Welcome to the team! We look forward to working with you.',
        rejected: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.',
        withdrawn: 'We have received your request to withdraw your application.'
      };

      await sendEmail(
        application.personalInfo.email,
        'statusUpdate',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          jobTitle: job.title.en,
          applicationId: application.applicationId,
          status: newStatus.replace('_', ' ').toUpperCase(),
          statusMessage: statusMessages[newStatus] || 'Your application status has been updated.',
          notes: notes || '',
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Status update sent' };
    } catch (error) {
      console.error('Failed to send status update:', error);
      throw new Error('Failed to send status update');
    }
  }

  // Send job offer to candidate
  static async sendJobOffer(application, job, offerDetails) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'jobOffer',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          jobTitle: job.title.en,
          salary: offerDetails.salary,
          benefits: offerDetails.benefits,
          startDate: offerDetails.startDate,
          offerExpiryDate: offerDetails.expiryDate,
          offerLetterUrl: offerDetails.offerLetterUrl,
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Job offer sent' };
    } catch (error) {
      console.error('Failed to send job offer:', error);
      throw new Error('Failed to send job offer');
    }
  }

  // Send rejection email
  static async sendRejectionEmail(application, job, feedback) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'applicationRejection',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          jobTitle: job.title.en,
          feedback: feedback || 'We appreciate your interest and encourage you to apply for future positions.',
          companyName: process.env.COMPANY_NAME || 'Manpower Company',
          careersUrl: `${process.env.FRONTEND_URL}/careers`
        }
      );

      return { success: true, message: 'Rejection email sent' };
    } catch (error) {
      console.error('Failed to send rejection email:', error);
      throw new Error('Failed to send rejection email');
    }
  }

  // Send welcome/onboarding email to new hire
  static async sendOnboardingEmail(application, job, onboardingDetails) {
    try {
      await sendEmail(
        application.personalInfo.email,
        'onboarding',
        {
          name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          jobTitle: job.title.en,
          startDate: onboardingDetails.startDate,
          reportingTime: onboardingDetails.reportingTime,
          reportingLocation: onboardingDetails.location,
          contactPerson: onboardingDetails.contactPerson,
          contactEmail: onboardingDetails.contactEmail,
          documents: onboardingDetails.requiredDocuments || [],
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Onboarding email sent' };
    } catch (error) {
      console.error('Failed to send onboarding email:', error);
      throw new Error('Failed to send onboarding email');
    }
  }

  // Send bulk notification to applicants
  static async sendBulkApplicationUpdate(applications, subject, message) {
    try {
      const recipients = applications.map(app => ({
        email: app.personalInfo.email,
        name: `${app.personalInfo.firstName} ${app.personalInfo.lastName}`
      }));

      const emailPromises = recipients.map(recipient =>
        sendEmail(
          recipient.email,
          'bulkUpdate',
          {
            name: recipient.name,
            subject,
            message,
            companyName: process.env.COMPANY_NAME || 'Manpower Company'
          }
        )
      );

      await Promise.all(emailPromises);

      return { success: true, message: `Bulk update sent to ${recipients.length} applicants` };
    } catch (error) {
      console.error('Failed to send bulk application update:', error);
      throw new Error('Failed to send bulk application update');
    }
  }

  // Send recruiter assignment notification
  static async sendRecruiterAssignment(recruiter, applications, job) {
    try {
      await sendEmail(
        recruiter.email,
        'recruiterAssignment',
        {
          recruiterName: recruiter.fullName,
          jobTitle: job.title.en,
          jobCode: job.jobCode,
          applicationCount: applications.length,
          applicantNames: applications.map(app => 
            `${app.personalInfo.firstName} ${app.personalInfo.lastName}`
          ).slice(0, 5).join(', ') + (applications.length > 5 ? '...' : ''),
          reviewUrl: `${process.env.ADMIN_URL}/applications?job=${job._id}`,
          companyName: process.env.COMPANY_NAME || 'Manpower Company'
        }
      );

      return { success: true, message: 'Recruiter assignment notification sent' };
    } catch (error) {
      console.error('Failed to send recruiter assignment:', error);
      throw new Error('Failed to send recruiter assignment');
    }
  }
}

module.exports = EmailService;
