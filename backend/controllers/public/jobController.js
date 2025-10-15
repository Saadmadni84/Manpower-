const JobPosting = require('../../models/JobPosting');
const JobCategory = require('../../models/JobCategory');
const Industry = require('../../models/Industry');
const JobApplication = require('../../models/JobApplication');
const { createAuditLog } = require('../../models/AuditLog');
const { catchAsync, AppError } = require('../../middleware/errorHandler');

// Get all active job postings
const getJobPostings = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, category, industry, location, jobType, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query
  const query = {};
  if (category) query.category = category;
  if (industry) query.industry = industry;
  if (location) query['location.city'] = location;
  if (jobType) query.jobType = jobType;
  if (search) {
    query.$text = { $search: search };
  }

  const [jobs, total] = await Promise.all([
    JobPosting.find(query)
      .populate('category', 'name slug')
      .populate('industry', 'name slug')
      .populate('client', 'name logo')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    JobPosting.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Get single job posting
const getJobPosting = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const job = await JobPosting.getJobBySlug(slug)
    .populate('category', 'name slug')
    .populate('industry', 'name slug')
    .populate('client', 'name logo');

  if (!job) {
    throw new AppError('Job posting not found', 404);
  }

  res.json({
    success: true,
    data: {
      job: job.toPublicJSON()
    }
  });
});

// Get featured job postings
const getFeaturedJobs = catchAsync(async (req, res) => {
  const { limit = 5 } = req.query;

  const jobs = await JobPosting.getFeaturedJobs()
    .populate('category', 'name slug')
    .populate('industry', 'name slug')
    .populate('client', 'name logo')
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: {
      jobs
    }
  });
});

// Get job categories
const getJobCategories = catchAsync(async (req, res) => {
  const categories = await JobCategory.getPublicCategories();

  res.json({
    success: true,
    data: {
      categories
    }
  });
});

// Get industries
const getIndustries = catchAsync(async (req, res) => {
  const industries = await Industry.getPublicCategories();

  res.json({
    success: true,
    data: {
      industries
    }
  });
});

// Search jobs
const searchJobs = catchAsync(async (req, res) => {
  const { q, category, industry, location, jobType, minSalary, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filters = {};
  if (category) filters.category = category;
  if (industry) filters.industry = industry;
  if (location) filters.location = location;
  if (jobType) filters.jobType = jobType;
  if (minSalary) filters.minSalary = parseInt(minSalary);

  const [jobs, total] = await Promise.all([
    JobPosting.searchJobs(q, filters)
      .populate('category', 'name slug')
      .populate('industry', 'name slug')
      .populate('client', 'name logo')
      .skip(skip)
      .limit(parseInt(limit)),
    JobPosting.countDocuments({
      status: 'published',
      applicationDeadline: { $gt: new Date() },
      ...(q ? { $text: { $search: q } } : {}),
      ...filters
    })
  ]);

  res.json({
    success: true,
    data: {
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Apply for job
const applyForJob = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const applicationData = req.body;

  // Check if job exists and is open for applications
  const job = await JobPosting.findById(jobId);
  if (!job) {
    throw new AppError('Job posting not found', 404);
  }

  if (!job.isApplicationOpen()) {
    throw new AppError('This job is no longer accepting applications', 400);
  }

  // Check if user has already applied for this job
  const existingApplication = await JobApplication.findOne({
    jobPosting: jobId,
    'personalInfo.email': applicationData.personalInfo.email
  });

  if (existingApplication) {
    throw new AppError('You have already applied for this job', 400);
  }

  // Create job application
  const application = new JobApplication({
    ...applicationData,
    jobPosting: jobId
  });

  await application.save();

  // Update job statistics
  await job.incrementApplicationCount();

  // Log application submission
  await createAuditLog({
    action: 'Job application submitted',
    entity: { type: 'JobApplication', id: application._id.toString() },
    operation: 'create',
    user: {
      id: null, // Public application
      email: application.personalInfo.email,
      name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
      role: 'public'
    },
    request: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      method: req.method,
      url: req.originalUrl
    },
    data: {
      description: `Application submitted for job: ${job.title}`
    }
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: {
      applicationId: application._id
    }
  });
});

// Get job statistics
const getJobStatistics = catchAsync(async (req, res) => {
  const [
    totalJobs,
    activeJobs,
    featuredJobs,
    categories,
    industries
  ] = await Promise.all([
    JobPosting.countDocuments({ status: 'published' }),
    JobPosting.countDocuments({ 
      status: 'published',
      applicationDeadline: { $gt: new Date() }
    }),
    JobPosting.countDocuments({ 
      status: 'published',
      isFeatured: true,
      applicationDeadline: { $gt: new Date() }
    }),
    JobCategory.countDocuments({ status: 'active' }),
    Industry.countDocuments({ status: 'active' })
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalJobs,
        activeJobs,
        featuredJobs,
        categories,
        industries
      }
    }
  });
});

module.exports = {
  getJobPostings,
  getJobPosting,
  getFeaturedJobs,
  getJobCategories,
  getIndustries,
  searchJobs,
  applyForJob,
  getJobStatistics
};
