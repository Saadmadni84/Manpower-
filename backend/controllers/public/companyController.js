const Company = require('../../models/Company');
const { catchAsync, AppError } = require('../../middleware/errorHandler');

// Get public company information
const getCompanyInfo = catchAsync(async (req, res) => {
  const company = await Company.getActiveCompany();
  
  if (!company) {
    throw new AppError('Company information not found', 404);
  }

  res.json({
    success: true,
    data: {
      company: company.toPublicJSON()
    }
  });
});

// Get company SEO information
const getCompanySEO = catchAsync(async (req, res) => {
  const company = await Company.getCompanyForSEO();
  
  if (!company) {
    throw new AppError('Company information not found', 404);
  }

  res.json({
    success: true,
    data: {
      seo: {
        name: company.name,
        description: company.description,
        logo: company.logo,
        socialMedia: company.socialMedia,
        metaTitle: company.seo?.metaTitle,
        metaDescription: company.seo?.metaDescription,
        metaKeywords: company.seo?.metaKeywords,
        ogTitle: company.seo?.ogTitle,
        ogDescription: company.seo?.ogDescription,
        ogImage: company.seo?.ogImage
      }
    }
  });
});

// Get company statistics
const getCompanyStats = catchAsync(async (req, res) => {
  const company = await Company.getActiveCompany();
  
  if (!company) {
    throw new AppError('Company information not found', 404);
  }

  res.json({
    success: true,
    data: {
      stats: {
        establishedYear: company.establishedYear,
        yearsOfExperience: company.yearsOfExperience,
        totalEmployees: company.totalEmployees,
        calculatedYearsOfExperience: company.calculatedYearsOfExperience
      }
    }
  });
});

// Get company achievements
const getCompanyAchievements = catchAsync(async (req, res) => {
  const company = await Company.getActiveCompany();
  
  if (!company) {
    throw new AppError('Company information not found', 404);
  }

  res.json({
    success: true,
    data: {
      achievements: company.achievements
    }
  });
});

// Get company values
const getCompanyValues = catchAsync(async (req, res) => {
  const company = await Company.getActiveCompany();
  
  if (!company) {
    throw new AppError('Company information not found', 404);
  }

  res.json({
    success: true,
    data: {
      values: company.values
    }
  });
});

// Get company mission and vision
const getCompanyMissionVision = catchAsync(async (req, res) => {
  const company = await Company.getActiveCompany();
  
  if (!company) {
    throw new AppError('Company information not found', 404);
  }

  res.json({
    success: true,
    data: {
      mission: company.mission,
      vision: company.vision
    }
  });
});

module.exports = {
  getCompanyInfo,
  getCompanySEO,
  getCompanyStats,
  getCompanyAchievements,
  getCompanyValues,
  getCompanyMissionVision
};
