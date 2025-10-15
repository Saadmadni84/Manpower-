const nodemailer = require('nodemailer');
const Settings = require('../models/Settings');

/**
 * Get email configuration from settings
 */
async function getEmailConfig() {
  try {
    const emailSettings = await Settings.getByCategory('email', true);
    
    const config = {};
    emailSettings.forEach(setting => {
      config[setting.key] = setting.value;
    });
    
    return config;
  } catch (error) {
    console.error('Error fetching email config:', error);
    return null;
  }
}

/**
 * Create email transporter based on settings
 */
async function createEmailTransporter() {
  const config = await getEmailConfig();
  
  if (!config || !config.smtp_host) {
    console.error('Email configuration not found');
    return null;
  }
  
  const transportConfig = {
    host: config.smtp_host,
    port: parseInt(config.smtp_port) || 587,
    secure: config.encryption_type === 'SSL', // true for 465, false for other ports
    auth: {
      user: config.smtp_username,
      pass: config.smtp_password
    }
  };
  
  // Add TLS config if specified
  if (config.encryption_type === 'TLS') {
    transportConfig.tls = {
      rejectUnauthorized: false
    };
  }
  
  return nodemailer.createTransport(transportConfig);
}

/**
 * Send email using configured transporter
 */
async function sendEmail(options) {
  try {
    const transporter = await createEmailTransporter();
    
    if (!transporter) {
      throw new Error('Email transporter not configured');
    }
    
    const config = await getEmailConfig();
    
    const mailOptions = {
      from: `"${config.from_name || 'Manpower Company'}" <${config.from_email}>`,
      to: options.to,
      subject: options.subject,
      html: options.html || options.text,
      text: options.text
    };
    
    // Add CC if provided
    if (options.cc) {
      mailOptions.cc = options.cc;
    }
    
    // Add BCC if provided
    if (options.bcc) {
      mailOptions.bcc = options.bcc;
    }
    
    // Add attachments if provided
    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test email configuration
 */
async function testEmailConfig(testEmail) {
  try {
    const result = await sendEmail({
      to: testEmail,
      subject: 'Email Configuration Test',
      html: `
        <h1>Email Configuration Test</h1>
        <p>This is a test email to verify your SMTP configuration.</p>
        <p>If you received this email, your email settings are working correctly!</p>
        <br>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `
    });
    
    return result;
  } catch (error) {
    console.error('Email test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get email template
 */
async function getEmailTemplate(templateKey) {
  try {
    const template = await Settings.getSetting('email', templateKey, false);
    return template ? template.value : null;
  } catch (error) {
    console.error('Error fetching email template:', error);
    return null;
  }
}

/**
 * Send templated email
 */
async function sendTemplatedEmail(templateKey, recipient, variables = {}) {
  try {
    let template = await getEmailTemplate(templateKey);
    
    if (!template) {
      throw new Error(`Template ${templateKey} not found`);
    }
    
    // Replace variables in template
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, variables[key]);
    });
    
    return await sendEmail({
      to: recipient,
      subject: variables.subject || 'Notification',
      html: template
    });
  } catch (error) {
    console.error('Error sending templated email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send notification emails to admins
 */
async function sendAdminNotification(subject, message, adminEmails = []) {
  try {
    if (adminEmails.length === 0) {
      console.log('No admin emails provided for notification');
      return { success: false, error: 'No recipients' };
    }
    
    return await sendEmail({
      to: adminEmails.join(','),
      subject: `[Admin Notification] ${subject}`,
      html: `
        <h2>${subject}</h2>
        <p>${message}</p>
        <br>
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from your admin panel.
        </p>
      `
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  getEmailConfig,
  createEmailTransporter,
  sendEmail,
  testEmailConfig,
  getEmailTemplate,
  sendTemplatedEmail,
  sendAdminNotification
};
