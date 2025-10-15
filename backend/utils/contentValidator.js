const validator = require('validator');

/**
 * Validate content based on type
 */
exports.validateContent = (content, contentType) => {
  const errors = [];
  
  switch (contentType) {
    case 'text':
      if (typeof content !== 'string') {
        errors.push('Text content must be a string');
      }
      break;
      
    case 'html':
      if (typeof content !== 'string') {
        errors.push('HTML content must be a string');
      }
      // Additional HTML sanitization can be added here
      break;
      
    case 'number':
      if (typeof content !== 'number' && isNaN(Number(content))) {
        errors.push('Number content must be a valid number');
      }
      break;
      
    case 'url':
      if (typeof content === 'string' && !validator.isURL(content, { require_protocol: true })) {
        errors.push('Invalid URL format');
      }
      break;
      
    case 'email':
      if (typeof content === 'string' && !validator.isEmail(content)) {
        errors.push('Invalid email format');
      }
      break;
      
    case 'array':
      if (!Array.isArray(content)) {
        errors.push('Array content must be an array');
      }
      break;
      
    case 'json':
      if (typeof content === 'string') {
        try {
          JSON.parse(content);
        } catch (e) {
          errors.push('Invalid JSON format');
        }
      } else if (typeof content !== 'object') {
        errors.push('JSON content must be an object or valid JSON string');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate multi-language content
 */
exports.validateMultiLanguageContent = (content) => {
  const errors = [];
  
  if (!content || typeof content !== 'object') {
    errors.push('Content must be an object with language keys');
    return { isValid: false, errors };
  }
  
  // Check if at least English content exists
  if (!content.en) {
    errors.push('English content is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate SEO fields
 */
exports.validateSEO = (seo) => {
  const errors = [];
  const warnings = [];
  
  if (!seo) {
    return { isValid: true, errors, warnings };
  }
  
  // Title validation
  if (seo.title) {
    if (seo.title.en && seo.title.en.length > 60) {
      warnings.push('SEO title (EN) is longer than 60 characters, which may be truncated in search results');
    }
    if (seo.title.ar && seo.title.ar.length > 60) {
      warnings.push('SEO title (AR) is longer than 60 characters, which may be truncated in search results');
    }
    if (seo.title.en && seo.title.en.length < 10) {
      warnings.push('SEO title (EN) is too short. Recommended minimum is 10 characters');
    }
  }
  
  // Description validation
  if (seo.description) {
    if (seo.description.en && seo.description.en.length > 160) {
      warnings.push('SEO description (EN) is longer than 160 characters, which may be truncated');
    }
    if (seo.description.ar && seo.description.ar.length > 160) {
      warnings.push('SEO description (AR) is longer than 160 characters, which may be truncated');
    }
    if (seo.description.en && seo.description.en.length < 50) {
      warnings.push('SEO description (EN) is too short. Recommended minimum is 50 characters');
    }
  }
  
  // Keywords validation
  if (seo.keywords) {
    if (seo.keywords.en && seo.keywords.en.length > 10) {
      warnings.push('Too many keywords (EN). Recommended maximum is 10 keywords');
    }
    if (seo.keywords.ar && seo.keywords.ar.length > 10) {
      warnings.push('Too many keywords (AR). Recommended maximum is 10 keywords');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Calculate content quality score
 */
exports.calculateContentScore = (content, contentType) => {
  let score = 100;
  const issues = [];
  
  if (contentType === 'text' || contentType === 'html') {
    const text = typeof content === 'string' ? content : '';
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    
    // Check word count
    if (wordCount < 10) {
      score -= 20;
      issues.push('Content is too short');
    } else if (wordCount < 50) {
      score -= 10;
      issues.push('Content could be more detailed');
    }
    
    // Check for repeated words
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const uniqueRatio = uniqueWords.size / words.length;
    
    if (uniqueRatio < 0.5 && words.length > 20) {
      score -= 15;
      issues.push('Content has too many repeated words');
    }
    
    // Check for all caps
    if (text === text.toUpperCase() && text.length > 20) {
      score -= 10;
      issues.push('Avoid using all capital letters');
    }
  }
  
  return {
    score: Math.max(0, score),
    issues
  };
};

/**
 * Validate page section structure
 */
exports.validateSection = (section) => {
  const errors = [];
  
  if (!section.sectionId) {
    errors.push('Section ID is required');
  }
  
  if (!section.name || !section.name.en) {
    errors.push('Section name (EN) is required');
  }
  
  if (typeof section.displayOrder !== 'number') {
    errors.push('Display order must be a number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize HTML content
 */
exports.sanitizeHTML = (html) => {
  // Basic HTML sanitization
  // In production, use a library like DOMPurify or sanitize-html
  if (typeof html !== 'string') return html;
  
  // Remove script tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  html = html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  html = html.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  return html;
};

/**
 * Validate content length constraints
 */
exports.validateLength = (content, minLength, maxLength) => {
  const errors = [];
  const length = typeof content === 'string' ? content.length : 
                 JSON.stringify(content).length;
  
  if (minLength && length < minLength) {
    errors.push(`Content is too short. Minimum length is ${minLength} characters`);
  }
  
  if (maxLength && length > maxLength) {
    errors.push(`Content is too long. Maximum length is ${maxLength} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    length
  };
};

/**
 * Check for broken links in HTML content
 */
exports.checkBrokenLinks = async (html) => {
  if (typeof html !== 'string') return { hasIssues: false, links: [] };
  
  const linkRegex = /href=["']([^"']+)["']/gi;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
  }
  
  // Filter internal links and mailto/tel links
  const externalLinks = links.filter(link => 
    link.startsWith('http://') || link.startsWith('https://')
  );
  
  return {
    hasIssues: false, // Actual link checking would require HTTP requests
    links: externalLinks,
    totalLinks: links.length
  };
};

module.exports = exports;
