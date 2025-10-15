const Joi = require('joi');

// Common validation schemas
const commonSchemas = {
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  email: Joi.string().email().lowercase().trim().required(),
  phone: Joi.string().pattern(/^[+]?[0-9\s\-\(\)]+$/).min(10).max(20),
  password: Joi.string().min(6).max(128).required(),
  name: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(2000),
  shortDescription: Joi.string().trim().max(500),
  url: Joi.string().uri().trim(),
  date: Joi.date(),
  status: Joi.string().valid('active', 'inactive', 'draft', 'pending', 'approved', 'rejected'),
  language: Joi.string().valid('en', 'ar').default('en'),
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('-createdAt'),
    search: Joi.string().trim().max(100)
  }
};

// Company validation schemas
const companySchemas = {
  create: Joi.object({
    name: commonSchemas.name,
    description: commonSchemas.description.required(),
    shortDescription: commonSchemas.shortDescription,
    establishedYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    totalEmployees: Joi.number().integer().min(0).required(),
    email: commonSchemas.email,
    phone: commonSchemas.phone.required(),
    address: Joi.string().trim().max(500).required(),
    website: commonSchemas.url,
    socialMedia: Joi.object({
      facebook: commonSchemas.url,
      twitter: commonSchemas.url,
      linkedin: commonSchemas.url,
      instagram: commonSchemas.url,
      youtube: commonSchemas.url
    }),
    mission: Joi.string().trim().max(1000),
    vision: Joi.string().trim().max(1000),
    values: Joi.array().items(Joi.object({
      title: Joi.string().trim().max(100).required(),
      description: Joi.string().trim().max(500).required()
    }))
  }),
  
  update: Joi.object({
    name: commonSchemas.name,
    description: commonSchemas.description,
    shortDescription: commonSchemas.shortDescription,
    establishedYear: Joi.number().integer().min(1900).max(new Date().getFullYear()),
    totalEmployees: Joi.number().integer().min(0),
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    address: Joi.string().trim().max(500),
    website: commonSchemas.url,
    socialMedia: Joi.object({
      facebook: commonSchemas.url,
      twitter: commonSchemas.url,
      linkedin: commonSchemas.url,
      instagram: commonSchemas.url,
      youtube: commonSchemas.url
    }),
    mission: Joi.string().trim().max(1000),
    vision: Joi.string().trim().max(1000),
    values: Joi.array().items(Joi.object({
      title: Joi.string().trim().max(100).required(),
      description: Joi.string().trim().max(500).required()
    }))
  })
};

// Service validation schemas
const serviceSchemas = {
  create: Joi.object({
    title: commonSchemas.name,
    description: commonSchemas.description.required(),
    shortDescription: commonSchemas.shortDescription,
    category: commonSchemas.name.required(),
    industry: commonSchemas.id.required(),
    features: Joi.array().items(Joi.object({
      title: Joi.string().trim().max(100).required(),
      description: Joi.string().trim().max(500).required(),
      icon: Joi.string().trim().max(100)
    })),
    benefits: Joi.array().items(Joi.string().trim().max(200)),
    requirements: Joi.array().items(Joi.string().trim().max(200)),
    serviceType: Joi.string().valid('temporary', 'permanent', 'contract', 'project-based').default('contract'),
    duration: Joi.string().valid('short-term', 'long-term', 'flexible').default('flexible'),
    location: Joi.string().trim().max(100).default('All locations'),
    isFeatured: Joi.boolean().default(false)
  }),
  
  update: Joi.object({
    title: commonSchemas.name,
    description: commonSchemas.description,
    shortDescription: commonSchemas.shortDescription,
    category: commonSchemas.name,
    industry: commonSchemas.id,
    features: Joi.array().items(Joi.object({
      title: Joi.string().trim().max(100).required(),
      description: Joi.string().trim().max(500).required(),
      icon: Joi.string().trim().max(100)
    })),
    benefits: Joi.array().items(Joi.string().trim().max(200)),
    requirements: Joi.array().items(Joi.string().trim().max(200)),
    serviceType: Joi.string().valid('temporary', 'permanent', 'contract', 'project-based'),
    duration: Joi.string().valid('short-term', 'long-term', 'flexible'),
    location: Joi.string().trim().max(100),
    isFeatured: Joi.boolean()
  })
};

// Client validation schemas
const clientSchemas = {
  create: Joi.object({
    name: commonSchemas.name,
    description: commonSchemas.description,
    shortDescription: commonSchemas.shortDescription,
    contactPerson: Joi.string().trim().max(200),
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    website: commonSchemas.url,
    industry: commonSchemas.id,
    clientType: Joi.string().valid('corporate', 'government', 'private', 'international').default('corporate'),
    location: Joi.object({
      city: Joi.string().trim().max(100).required(),
      region: Joi.string().trim().max(100).required(),
      country: Joi.string().trim().max(100).default('Saudi Arabia')
    }),
    isFeatured: Joi.boolean().default(false)
  }),
  
  update: Joi.object({
    name: commonSchemas.name,
    description: commonSchemas.description,
    shortDescription: commonSchemas.shortDescription,
    contactPerson: Joi.string().trim().max(200),
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    website: commonSchemas.url,
    industry: commonSchemas.id,
    clientType: Joi.string().valid('corporate', 'government', 'private', 'international'),
    location: Joi.object({
      city: Joi.string().trim().max(100),
      region: Joi.string().trim().max(100),
      country: Joi.string().trim().max(100)
    }),
    isFeatured: Joi.boolean()
  })
};

// Job posting validation schemas
const jobPostingSchemas = {
  create: Joi.object({
    title: commonSchemas.name,
    description: commonSchemas.description.required(),
    shortDescription: commonSchemas.shortDescription,
    category: commonSchemas.id.required(),
    industry: commonSchemas.id.required(),
    jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'temporary', 'freelance').default('full-time'),
    employmentType: Joi.string().valid('permanent', 'contract', 'project-based', 'seasonal').default('contract'),
    location: Joi.object({
      city: Joi.string().trim().max(100).required(),
      region: Joi.string().trim().max(100).required(),
      address: Joi.string().trim().max(200),
      isRemote: Joi.boolean().default(false)
    }),
    salary: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
      currency: Joi.string().default('SAR'),
      period: Joi.string().valid('hourly', 'daily', 'monthly', 'yearly').default('monthly'),
      isNegotiable: Joi.boolean().default(true),
      benefits: Joi.array().items(Joi.string().trim().max(200))
    }),
    experience: Joi.object({
      min: Joi.number().min(0).default(0),
      max: Joi.number().min(0),
      unit: Joi.string().valid('months', 'years').default('years')
    }),
    education: Joi.object({
      level: Joi.string().valid('none', 'high-school', 'diploma', 'bachelor', 'master', 'phd').default('high-school'),
      field: Joi.string().trim().max(100),
      isMandatory: Joi.boolean().default(false)
    }),
    skills: Joi.array().items(Joi.object({
      name: Joi.string().trim().max(100).required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').default('intermediate'),
      isRequired: Joi.boolean().default(false)
    })),
    requirements: Joi.array().items(Joi.string().trim().max(200)),
    responsibilities: Joi.array().items(Joi.string().trim().max(200)),
    qualifications: Joi.array().items(Joi.string().trim().max(200)),
    applicationDeadline: commonSchemas.date.required(),
    startDate: commonSchemas.date.required(),
    numberOfPositions: Joi.number().integer().min(1).default(1),
    isUrgent: Joi.boolean().default(false),
    isFeatured: Joi.boolean().default(false)
  }),
  
  update: Joi.object({
    title: commonSchemas.name,
    description: commonSchemas.description,
    shortDescription: commonSchemas.shortDescription,
    category: commonSchemas.id,
    industry: commonSchemas.id,
    jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'temporary', 'freelance'),
    employmentType: Joi.string().valid('permanent', 'contract', 'project-based', 'seasonal'),
    location: Joi.object({
      city: Joi.string().trim().max(100),
      region: Joi.string().trim().max(100),
      address: Joi.string().trim().max(200),
      isRemote: Joi.boolean()
    }),
    salary: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
      currency: Joi.string(),
      period: Joi.string().valid('hourly', 'daily', 'monthly', 'yearly'),
      isNegotiable: Joi.boolean(),
      benefits: Joi.array().items(Joi.string().trim().max(200))
    }),
    experience: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
      unit: Joi.string().valid('months', 'years')
    }),
    education: Joi.object({
      level: Joi.string().valid('none', 'high-school', 'diploma', 'bachelor', 'master', 'phd'),
      field: Joi.string().trim().max(100),
      isMandatory: Joi.boolean()
    }),
    skills: Joi.array().items(Joi.object({
      name: Joi.string().trim().max(100).required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert'),
      isRequired: Joi.boolean()
    })),
    requirements: Joi.array().items(Joi.string().trim().max(200)),
    responsibilities: Joi.array().items(Joi.string().trim().max(200)),
    qualifications: Joi.array().items(Joi.string().trim().max(200)),
    applicationDeadline: commonSchemas.date,
    startDate: commonSchemas.date,
    numberOfPositions: Joi.number().integer().min(1),
    isUrgent: Joi.boolean(),
    isFeatured: Joi.boolean()
  })
};

// Job application validation schemas
const jobApplicationSchemas = {
  create: Joi.object({
    jobPosting: commonSchemas.id.required(),
    personalInfo: Joi.object({
      firstName: commonSchemas.name,
      lastName: commonSchemas.name,
      email: commonSchemas.email,
      phone: commonSchemas.phone,
      dateOfBirth: commonSchemas.date,
      nationality: Joi.string().trim().max(100),
      gender: Joi.string().valid('male', 'female', 'other').default('male')
    }).required(),
    experience: Joi.object({
      totalYears: Joi.number().min(0).default(0),
      relevantYears: Joi.number().min(0).default(0),
      previousJobs: Joi.array().items(Joi.object({
        company: Joi.string().trim().max(200).required(),
        position: Joi.string().trim().max(200).required(),
        startDate: commonSchemas.date.required(),
        endDate: commonSchemas.date,
        isCurrent: Joi.boolean().default(false),
        description: Joi.string().trim().max(1000),
        achievements: Joi.array().items(Joi.string().trim().max(200))
      }))
    }),
    education: Joi.object({
      highestLevel: Joi.string().valid('high-school', 'diploma', 'bachelor', 'master', 'phd').default('high-school'),
      qualifications: Joi.array().items(Joi.object({
        degree: Joi.string().trim().max(200).required(),
        field: Joi.string().trim().max(200).required(),
        institution: Joi.string().trim().max(200).required(),
        graduationYear: Joi.number().integer().min(1900).max(new Date().getFullYear()),
        gpa: Joi.number().min(0).max(4)
      }))
    }),
    skills: Joi.array().items(Joi.object({
      name: Joi.string().trim().max(100).required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').default('intermediate'),
      yearsOfExperience: Joi.number().min(0),
      isCertified: Joi.boolean().default(false)
    })),
    languages: Joi.array().items(Joi.object({
      language: Joi.string().trim().max(100).required(),
      proficiency: Joi.string().valid('basic', 'intermediate', 'advanced', 'native').default('intermediate'),
      speaking: Joi.string().valid('basic', 'intermediate', 'advanced', 'native').default('intermediate'),
      writing: Joi.string().valid('basic', 'intermediate', 'advanced', 'native').default('intermediate')
    })),
    location: Joi.object({
      currentCity: Joi.string().trim().max(100),
      currentRegion: Joi.string().trim().max(100),
      preferredCity: Joi.string().trim().max(100),
      preferredRegion: Joi.string().trim().max(100),
      isWillingToRelocate: Joi.boolean().default(false),
      availableStartDate: commonSchemas.date
    }),
    salaryExpectation: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
      currency: Joi.string().default('SAR'),
      isNegotiable: Joi.boolean().default(true)
    }),
    message: Joi.string().trim().max(2000)
  })
};

// Contact inquiry validation schemas
const contactInquirySchemas = {
  create: Joi.object({
    personalInfo: Joi.object({
      name: commonSchemas.name,
      email: commonSchemas.email,
      phone: commonSchemas.phone,
      company: Joi.string().trim().max(200),
      position: Joi.string().trim().max(200)
    }).required(),
    subject: Joi.string().trim().max(200).required(),
    message: Joi.string().trim().max(5000).required(),
    inquiryType: Joi.string().valid('general', 'service-request', 'partnership', 'job-application', 'complaint', 'feedback').default('general'),
    location: Joi.object({
      city: Joi.string().trim().max(100),
      region: Joi.string().trim().max(100),
      country: Joi.string().trim().max(100).default('Saudi Arabia')
    }),
    additionalInfo: Joi.object({
      budget: Joi.string().trim().max(100),
      timeline: Joi.string().trim().max(100),
      requirements: Joi.string().trim().max(1000),
      source: Joi.string().valid('website', 'referral', 'social-media', 'advertisement', 'other').default('website'),
      referrer: Joi.string().trim().max(200)
    })
  })
};

// Admin user validation schemas
const adminUserSchemas = {
  create: Joi.object({
    personalInfo: Joi.object({
      firstName: commonSchemas.name,
      lastName: commonSchemas.name,
      email: commonSchemas.email,
      phone: commonSchemas.phone
    }).required(),
    password: commonSchemas.password,
    role: Joi.string().valid('super_admin', 'admin', 'manager', 'staff').default('staff'),
    permissions: Joi.array().items(Joi.string()),
    profile: Joi.object({
      bio: Joi.string().trim().max(500),
      department: Joi.string().trim().max(100),
      position: Joi.string().trim().max(100),
      timezone: Joi.string().default('Asia/Riyadh'),
      language: commonSchemas.language
    })
  }),
  
  update: Joi.object({
    personalInfo: Joi.object({
      firstName: commonSchemas.name,
      lastName: commonSchemas.name,
      email: commonSchemas.email,
      phone: commonSchemas.phone
    }),
    role: Joi.string().valid('super_admin', 'admin', 'manager', 'staff'),
    permissions: Joi.array().items(Joi.string()),
    profile: Joi.object({
      bio: Joi.string().trim().max(500),
      department: Joi.string().trim().max(100),
      position: Joi.string().trim().max(100),
      timezone: Joi.string(),
      language: commonSchemas.language
    })
  }),
  
  login: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password
  }).required(),
  
  changePassword: Joi.object({
    currentPassword: commonSchemas.password,
    newPassword: commonSchemas.password,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  }).required()
};

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req[property] = value;
    next();
  };
};

// Validation middleware functions
const validateService = validate(serviceSchemas.create);
const validateClient = validate(clientSchemas.create);
const validateContract = validate(commonSchemas.id); // Basic validation for now
const validateLocation = validate(commonSchemas.id); // Basic validation for now
const validateIndustry = validate(commonSchemas.id); // Basic validation for now
const validateAdminUser = validate(adminUserSchemas.create);
const validateLanguage = validate(commonSchemas.id); // Basic validation for now

// Export all schemas and validation middleware
module.exports = {
  // Common schemas
  commonSchemas,
  
  // Entity-specific schemas
  companySchemas,
  serviceSchemas,
  clientSchemas,
  jobPostingSchemas,
  jobApplicationSchemas,
  contactInquirySchemas,
  adminUserSchemas,
  
  // Validation middleware
  validate,
  validateService,
  validateClient,
  validateContract,
  validateLocation,
  validateIndustry,
  validateAdminUser,
  validateLanguage
};
