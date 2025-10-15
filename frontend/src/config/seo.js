export const SEO_CONFIG = {
  DEFAULT: {
    title: 'Manpower Company - Professional Staffing Solutions',
    description: 'Leading manpower company providing comprehensive staffing solutions. Connect with top talent or find your dream job with our expert recruitment services.',
    keywords: 'manpower, recruitment, staffing, jobs, employment, talent acquisition, human resources',
    author: 'Manpower Company',
    robots: 'index, follow',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  },
  
  PAGES: {
    HOME: {
      title: 'Home - Manpower Company',
      description: 'Welcome to Manpower Company. We provide professional staffing solutions and connect talented professionals with great opportunities.',
      keywords: 'manpower company, staffing solutions, recruitment services, job placement'
    },
    
    ABOUT: {
      title: 'About Us - Manpower Company',
      description: 'Learn about our company history, mission, and values. Discover why we are the trusted choice for manpower solutions.',
      keywords: 'about manpower company, company history, mission, values, team'
    },
    
    SERVICES: {
      title: 'Our Services - Manpower Company',
      description: 'Comprehensive manpower services including permanent placement, temporary staffing, and executive search solutions.',
      keywords: 'manpower services, permanent placement, temporary staffing, executive search, recruitment services'
    },
    
    CAREERS: {
      title: 'Careers - Manpower Company',
      description: 'Explore exciting career opportunities with Manpower Company. Join our team of recruitment professionals.',
      keywords: 'careers, job opportunities, employment, recruitment jobs, HR careers'
    },
    
    CONTACT: {
      title: 'Contact Us - Manpower Company',
      description: 'Get in touch with our team for your manpower needs. Contact us for recruitment services and job opportunities.',
      keywords: 'contact manpower company, recruitment inquiry, job opportunities, get in touch'
    }
  },
  
  ADMIN: {
    title: 'Admin Panel - Manpower Company',
    description: 'Administrative dashboard for managing manpower company operations.',
    robots: 'noindex, nofollow'
  }
};

export const generateSEOTags = (page = 'DEFAULT', customData = {}) => {
  const config = page === 'DEFAULT' ? SEO_CONFIG.DEFAULT : SEO_CONFIG.PAGES[page];
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://manpower.com';
  
  const seoData = {
    ...config,
    ...customData,
    url: customData.url || `${baseUrl}${customData.path || ''}`,
    image: customData.image || `${baseUrl}/og-image.jpg`
  };
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    author: seoData.author,
    robots: seoData.robots,
    canonical: seoData.url,
    
    // Open Graph
    ogTitle: seoData.title,
    ogDescription: seoData.description,
    ogImage: seoData.image,
    ogUrl: seoData.url,
    ogType: seoData.ogType || 'website',
    
    // Twitter Card
    twitterCard: seoData.twitterCard || 'summary_large_image',
    twitterTitle: seoData.title,
    twitterDescription: seoData.description,
    twitterImage: seoData.image
  };
};

export const generateStructuredData = (type, data) => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://manpower.com';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
    url: data.url || baseUrl,
    logo: data.logo || `${baseUrl}/logo.png`
  };
  
  return structuredData;
};

export const ORGANIZATION_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Manpower Company',
  description: 'Professional manpower services - connecting talent with opportunity',
  url: process.env.REACT_APP_BASE_URL || 'https://manpower.com',
  logo: `${process.env.REACT_APP_BASE_URL || 'https://manpower.com'}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    email: 'info@manpower.com'
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Business Street',
    addressLocality: 'City',
    addressRegion: 'State',
    postalCode: '12345',
    addressCountry: 'US'
  },
  sameAs: [
    'https://www.linkedin.com/company/manpower',
    'https://www.facebook.com/manpower',
    'https://twitter.com/manpower'
  ]
};

