const nodemailer = require('nodemailer');

// Create transporter for email sending
const createTransporter = () => {
  const transporter = nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App-specific password for Gmail
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporter;
};

// Email templates
const emailTemplates = {
  contactForm: {
    subject: 'New Contact Form Submission - {{companyName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h3>Contact Details:</h3>
          <p><strong>Name:</strong> {{name}}</p>
          <p><strong>Email:</strong> {{email}}</p>
          <p><strong>Phone:</strong> {{phone}}</p>
          <p><strong>Company:</strong> {{company}}</p>
          <p><strong>Subject:</strong> {{subject}}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
            {{message}}
          </div>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This message was sent from the {{companyName}} website contact form.
        </p>
      </div>
    `
  },
  
  jobApplication: {
    subject: 'New Job Application - {{position}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Job Application Received</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h3>Applicant Details:</h3>
          <p><strong>Name:</strong> {{name}}</p>
          <p><strong>Email:</strong> {{email}}</p>
          <p><strong>Phone:</strong> {{phone}}</p>
          <p><strong>Position Applied:</strong> {{position}}</p>
          <p><strong>Experience:</strong> {{experience}} years</p>
          <p><strong>Location:</strong> {{location}}</p>
          <p><strong>CV:</strong> <a href="{{cvUrl}}" target="_blank">Download CV</a></p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
            {{message}}
          </div>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This application was submitted through the {{companyName}} careers portal.
        </p>
      </div>
    `
  },

  adminNotification: {
    subject: '{{companyName}} - Admin Panel Activity',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Admin Panel Notification</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <p><strong>Action:</strong> {{action}}</p>
          <p><strong>Performed by:</strong> {{adminUser}}</p>
          <p><strong>Time:</strong> {{timestamp}}</p>
          <p><strong>Details:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
            {{details}}
          </div>
        </div>
      </div>
    `
  }
};

// Helper function to send email
const sendEmail = async (to, templateName, variables = {}) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    // Replace variables in template
    let subject = template.subject;
    let html = template.html;
    
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, variables[key]);
      html = html.replace(regex, variables[key]);
    });

    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'Manpower Company'}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Helper function to send multiple emails
const sendBulkEmail = async (recipients, templateName, variables = {}) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendEmail(recipient, templateName, variables);
      results.push({ recipient, success: true, messageId: result.messageId });
    } catch (error) {
      results.push({ recipient, success: false, error: error.message });
    }
  }
  
  return results;
};

module.exports = {
  createTransporter,
  sendEmail,
  sendBulkEmail,
  emailTemplates
};
