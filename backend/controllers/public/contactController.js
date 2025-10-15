const ContactInquiry = require('../../models/ContactInquiry');
const { sendEmail } = require('../../config/mailer');
const { createAuditLog } = require('../../models/AuditLog');
const { catchAsync, AppError } = require('../../middleware/errorHandler');

// Submit contact inquiry
const submitContactInquiry = catchAsync(async (req, res) => {
  const inquiryData = req.body;

  // Create contact inquiry
  const inquiry = new ContactInquiry(inquiryData);
  await inquiry.save();

  // Send notification email to admin
  try {
    await sendEmail(process.env.ADMIN_EMAIL || 'admin@manpowercompany.com', 'contactForm', {
      name: inquiry.personalInfo.name,
      email: inquiry.personalInfo.email,
      phone: inquiry.personalInfo.phone,
      company: inquiry.personalInfo.company,
      subject: inquiry.subject,
      message: inquiry.message,
      companyName: process.env.COMPANY_NAME || 'Manpower Company'
    });
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }

  // Log inquiry submission
  await createAuditLog({
    action: 'Contact inquiry submitted',
    entity: { type: 'ContactInquiry', id: inquiry._id.toString() },
    operation: 'create',
    user: {
      id: null, // Public inquiry
      email: inquiry.personalInfo.email,
      name: inquiry.personalInfo.name,
      role: 'public'
    },
    request: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      method: req.method,
      url: req.originalUrl
    },
    data: {
      description: `Contact inquiry submitted: ${inquiry.subject}`
    }
  });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been submitted successfully. We will get back to you soon.',
    data: {
      inquiryId: inquiry._id
    }
  });
});

// Get contact information
const getContactInfo = catchAsync(async (req, res) => {
  const Company = require('../../models/Company');
  const company = await Company.getActiveCompany();
  
  if (!company) {
    throw new AppError('Contact information not found', 404);
  }

  res.json({
    success: true,
    data: {
      contact: {
        email: company.email,
        phone: company.phone,
        address: company.address,
        website: company.website,
        socialMedia: company.socialMedia
      }
    }
  });
});

module.exports = {
  submitContactInquiry,
  getContactInfo
};
