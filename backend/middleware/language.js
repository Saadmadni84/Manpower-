const { APP_CONSTANTS } = require('../config/constants');

// Language detection middleware
const detectLanguage = (req, res, next) => {
  // Check for language in query parameters
  if (req.query.lang) {
    req.language = req.query.lang.toLowerCase();
  }
  // Check for language in headers
  else if (req.headers['accept-language']) {
    const acceptLanguage = req.headers['accept-language'];
    const languages = acceptLanguage.split(',').map(lang => {
      const parts = lang.trim().split(';');
      return {
        code: parts[0].split('-')[0].toLowerCase(),
        quality: parts[1] ? parseFloat(parts[1].split('=')[1]) : 1
      };
    });
    
    // Sort by quality and get the best match
    languages.sort((a, b) => b.quality - a.quality);
    req.language = languages[0].code;
  }
  // Check for language in cookies
  else if (req.cookies && req.cookies.language) {
    req.language = req.cookies.language.toLowerCase();
  }
  // Default to English
  else {
    req.language = 'en';
  }
  
  // Validate language
  if (!APP_CONSTANTS.LANGUAGES[req.language.toUpperCase()]) {
    req.language = 'en'; // Default to English if invalid
  }
  
  next();
};

// Language validation middleware
const validateLanguage = (req, res, next) => {
  const supportedLanguages = Object.values(APP_CONSTANTS.LANGUAGES);
  
  if (req.body.language && !supportedLanguages.includes(req.body.language.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Unsupported language. Supported languages: ${supportedLanguages.join(', ')}`
    });
  }
  
  next();
};

// Language-specific response middleware
const setLanguageResponse = (req, res, next) => {
  // Set language in response headers
  res.setHeader('Content-Language', req.language);
  
  // Set language cookie
  res.cookie('language', req.language, {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  next();
};

// RTL (Right-to-Left) detection middleware
const detectRTL = (req, res, next) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  req.isRTL = rtlLanguages.includes(req.language);
  
  next();
};

// Language-specific content middleware
const getLocalizedContent = (req, res, next) => {
  // Helper function to get localized content
  req.getLocalizedContent = (content, field) => {
    if (!content) return null;
    
    // If content is a string, return as is
    if (typeof content === 'string') {
      return content;
    }
    
    // If content has translations, return the appropriate one
    if (content.translations && content.translations[req.language]) {
      return content.translations[req.language][field] || content[field];
    }
    
    // Fallback to default field
    return content[field];
  };
  
  next();
};

// Language switching middleware
const switchLanguage = (req, res, next) => {
  if (req.body.language) {
    const newLanguage = req.body.language.toLowerCase();
    
    if (APP_CONSTANTS.LANGUAGES[newLanguage.toUpperCase()]) {
      req.language = newLanguage;
      res.cookie('language', newLanguage, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
  }
  
  next();
};

// Multi-language query middleware
const handleMultiLanguageQuery = (req, res, next) => {
  // Add language filter to MongoDB queries
  req.addLanguageFilter = (query) => {
    if (req.language !== 'en') {
      // Add language-specific filters
      query.$or = query.$or || [];
      query.$or.push(
        { [`translations.${req.language}.title`]: { $exists: true } },
        { [`translations.${req.language}.description`]: { $exists: true } }
      );
    }
    return query;
  };
  
  next();
};

// Language-specific sorting middleware
const applyLanguageSorting = (req, res, next) => {
  // Helper function to sort by localized content
  req.sortByLanguage = (sortOptions) => {
    if (req.language !== 'en') {
      // Modify sort options for localized content
      const localizedSort = {};
      Object.keys(sortOptions).forEach(field => {
        if (field === 'title' || field === 'description' || field === 'name') {
          localizedSort[`translations.${req.language}.${field}`] = sortOptions[field];
        } else {
          localizedSort[field] = sortOptions[field];
        }
      });
      return localizedSort;
    }
    return sortOptions;
  };
  
  next();
};

// Language-specific pagination middleware
const handleLanguagePagination = (req, res, next) => {
  // Helper function to format pagination response
  req.formatPaginationResponse = (data, total, page, limit) => {
    return {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      language: req.language,
      isRTL: req.isRTL
    };
  };
  
  next();
};

// Language-specific error messages middleware
const setLanguageErrorMessages = (req, res, next) => {
  const errorMessages = {
    en: {
      'validation_error': 'Validation failed',
      'not_found': 'Resource not found',
      'unauthorized': 'Unauthorized access',
      'forbidden': 'Access forbidden',
      'server_error': 'Internal server error'
    },
    ar: {
      'validation_error': 'فشل في التحقق',
      'not_found': 'المورد غير موجود',
      'unauthorized': 'وصول غير مصرح به',
      'forbidden': 'الوصول محظور',
      'server_error': 'خطأ في الخادم الداخلي'
    }
  };
  
  req.getErrorMessage = (key) => {
    return errorMessages[req.language]?.[key] || errorMessages.en[key] || key;
  };
  
  next();
};

// Language-specific date formatting middleware
const setLanguageDateFormatting = (req, res, next) => {
  req.formatDate = (date, options = {}) => {
    if (!date) return null;
    
    const dateObj = new Date(date);
    const formatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    if (req.language === 'ar') {
      return dateObj.toLocaleDateString('ar-SA', formatOptions);
    } else {
      return dateObj.toLocaleDateString('en-US', formatOptions);
    }
  };
  
  next();
};

// Language-specific number formatting middleware
const setLanguageNumberFormatting = (req, res, next) => {
  req.formatNumber = (number, options = {}) => {
    if (typeof number !== 'number') return number;
    
    const formatOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options
    };
    
    if (req.language === 'ar') {
      return number.toLocaleString('ar-SA', formatOptions);
    } else {
      return number.toLocaleString('en-US', formatOptions);
    }
  };
  
  next();
};

// Combined language middleware
const languageMiddleware = [
  detectLanguage,
  validateLanguage,
  detectRTL,
  getLocalizedContent,
  handleMultiLanguageQuery,
  applyLanguageSorting,
  handleLanguagePagination,
  setLanguageErrorMessages,
  setLanguageDateFormatting,
  setLanguageNumberFormatting,
  setLanguageResponse
];

// Export all language middleware
module.exports = {
  detectLanguage,
  validateLanguage,
  setLanguageResponse,
  detectRTL,
  getLocalizedContent,
  switchLanguage,
  handleMultiLanguageQuery,
  applyLanguageSorting,
  handleLanguagePagination,
  setLanguageErrorMessages,
  setLanguageDateFormatting,
  setLanguageNumberFormatting,
  languageMiddleware
};
