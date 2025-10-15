#!/usr/bin/env node

/**
 * Database Seeding Script
 * 
 * This script seeds the database with initial data for development and testing.
 * It creates sample companies, services, clients, jobs, and admin users.
 * 
 * Usage:
 * npm run seed
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const Company = require('../models/Company');
const Service = require('../models/Service');
const Client = require('../models/Client');
const Contract = require('../models/Contract');
const Location = require('../models/Location');
const Industry = require('../models/Industry');
const JobCategory = require('../models/JobCategory');
const JobPosting = require('../models/JobPosting');
const GalleryCategory = require('../models/GalleryCategory');
const GalleryImage = require('../models/GalleryImage');
const AdminUser = require('../models/AdminUser');
const Language = require('../models/Language');

// Sample data
const sampleData = {
  languages: [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
      isActive: true,
      isDefault: true
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      direction: 'rtl',
      isActive: true,
      isDefault: false
    }
  ],

  industries: [
    {
      name: 'Airport Operations',
      slug: 'airport-operations',
      description: 'Manpower services for airport operations including ground handling, security, and maintenance.',
      category: 'Aviation',
      isFeatured: true
    },
    {
      name: 'Corporate Offices',
      slug: 'corporate-offices',
      description: 'Professional staff for corporate offices including administrative, executive, and support roles.',
      category: 'Corporate',
      isFeatured: true
    },
    {
      name: 'Catering Services',
      slug: 'catering-services',
      description: 'Food service and catering personnel for events, restaurants, and corporate dining.',
      category: 'Hospitality',
      isFeatured: true
    },
    {
      name: 'Inventory & Logistics',
      slug: 'inventory-logistics',
      description: 'Warehouse, inventory management, and logistics support staff.',
      category: 'Supply Chain',
      isFeatured: true
    },
    {
      name: 'Construction',
      slug: 'construction',
      description: 'Skilled and unskilled labor for construction projects and infrastructure development.',
      category: 'Construction',
      isFeatured: true
    },
    {
      name: 'Facility Management',
      slug: 'facility-management',
      description: 'Building maintenance, cleaning, and facility management personnel.',
      category: 'Maintenance',
      isFeatured: true
    }
  ],

  jobCategories: [
    {
      name: 'Administrative',
      slug: 'administrative',
      description: 'Administrative and office support positions',
      category: 'Office',
      isFeatured: true
    },
    {
      name: 'Technical',
      slug: 'technical',
      description: 'Technical and skilled positions',
      category: 'Technical',
      isFeatured: true
    },
    {
      name: 'Operations',
      slug: 'operations',
      description: 'Operations and production positions',
      category: 'Operations',
      isFeatured: true
    },
    {
      name: 'Management',
      slug: 'management',
      description: 'Management and supervisory positions',
      category: 'Management',
      isFeatured: true
    },
    {
      name: 'Support Staff',
      slug: 'support-staff',
      description: 'Support and service staff positions',
      category: 'Support',
      isFeatured: true
    }
  ],

  locations: [
    {
      name: 'Jeddah Office',
      type: 'headquarters',
      address: {
        street: 'King Fahd Road',
        building: 'Al-Rashid Tower',
        district: 'Al-Balad',
        city: 'Jeddah',
        region: 'Makkah',
        postalCode: '21432',
        country: 'Saudi Arabia'
      },
      coordinates: {
        latitude: 21.4858,
        longitude: 39.1925
      },
      contact: {
        phone: '+966-12-123-4567',
        email: 'jeddah@manpowercompany.com'
      },
      isMainOffice: true
    },
    {
      name: 'Riyadh Office',
      type: 'branch',
      address: {
        street: 'Prince Mohammed Bin Abdulaziz Road',
        building: 'Business Center',
        district: 'Al-Olaya',
        city: 'Riyadh',
        region: 'Riyadh',
        postalCode: '11564',
        country: 'Saudi Arabia'
      },
      coordinates: {
        latitude: 24.7136,
        longitude: 46.6753
      },
      contact: {
        phone: '+966-11-234-5678',
        email: 'riyadh@manpowercompany.com'
      }
    },
    {
      name: 'Dammam Office',
      type: 'branch',
      address: {
        street: 'King Faisal Road',
        building: 'Commercial Complex',
        district: 'Al-Faisaliyah',
        city: 'Dammam',
        region: 'Eastern Province',
        postalCode: '32245',
        country: 'Saudi Arabia'
      },
      coordinates: {
        latitude: 26.4282,
        longitude: 50.1142
      },
      contact: {
        phone: '+966-13-345-6789',
        email: 'dammam@manpowercompany.com'
      }
    },
    {
      name: 'Madina Office',
      type: 'branch',
      address: {
        street: 'Prince Abdul Majeed Road',
        building: 'Al-Madinah Tower',
        district: 'Al-Hijrah',
        city: 'Madina',
        region: 'Madinah',
        postalCode: '42311',
        country: 'Saudi Arabia'
      },
      coordinates: {
        latitude: 24.5247,
        longitude: 39.5692
      },
      contact: {
        phone: '+966-14-456-7890',
        email: 'madina@manpowercompany.com'
      }
    }
  ],

  company: {
    name: 'Manpower Supply Company',
    description: 'Leading manpower supply company in Saudi Arabia with over 25 years of experience providing skilled and unskilled workforce to various industries including airport operations, corporate offices, catering services, inventory & logistics, construction, and facility management.',
    shortDescription: 'Leading manpower supply company in Saudi Arabia with 25+ years of experience.',
    establishedYear: 1998,
    totalEmployees: 10000,
    yearsOfExperience: 25,
    email: 'info@manpowercompany.com',
    phone: '+966-12-123-4567',
    address: 'King Fahd Road, Al-Rashid Tower, Al-Balad, Jeddah 21432, Saudi Arabia',
    website: 'https://manpowercompany.com',
    socialMedia: {
      facebook: 'https://facebook.com/manpowercompany',
      twitter: 'https://twitter.com/manpowercompany',
      linkedin: 'https://linkedin.com/company/manpowercompany',
      instagram: 'https://instagram.com/manpowercompany'
    },
    mission: 'To provide exceptional manpower services that meet the diverse needs of our clients while ensuring the highest standards of quality, reliability, and professionalism.',
    vision: 'To be the leading manpower supply company in Saudi Arabia, recognized for our commitment to excellence and innovation in workforce solutions.',
    values: [
      {
        title: 'Excellence',
        description: 'We strive for excellence in all our services and maintain the highest standards of quality.'
      },
      {
        title: 'Reliability',
        description: 'We are committed to being a reliable partner for our clients, delivering consistent and dependable services.'
      },
      {
        title: 'Integrity',
        description: 'We conduct our business with the highest level of integrity and ethical standards.'
      },
      {
        title: 'Innovation',
        description: 'We continuously innovate and improve our services to meet the evolving needs of our clients.'
      }
    ],
    achievements: [
      {
        title: '25 Years of Excellence',
        description: 'Celebrating 25 years of successful operations in Saudi Arabia.',
        year: 2023
      },
      {
        title: '10,000+ Employees',
        description: 'Successfully managing over 10,000 employees across multiple locations.',
        year: 2023
      },
      {
        title: 'Industry Recognition',
        description: 'Recognized as a leading manpower supply company in the region.',
        year: 2022
      }
    ],
    certifications: [
      {
        name: 'ISO 9001:2015',
        issuingBody: 'International Organization for Standardization',
        date: new Date('2020-01-01'),
        expiryDate: new Date('2025-01-01')
      },
      {
        name: 'Saudi Labor Law Compliance',
        issuingBody: 'Ministry of Human Resources',
        date: new Date('2019-01-01'),
        expiryDate: new Date('2024-01-01')
      }
    ],
    translations: {
      en: {
        name: 'Manpower Supply Company',
        description: 'Leading manpower supply company in Saudi Arabia with over 25 years of experience providing skilled and unskilled workforce to various industries.',
        mission: 'To provide exceptional manpower services that meet the diverse needs of our clients while ensuring the highest standards of quality, reliability, and professionalism.',
        vision: 'To be the leading manpower supply company in Saudi Arabia, recognized for our commitment to excellence and innovation in workforce solutions.'
      },
      ar: {
        name: 'شركة توريد القوى العاملة',
        description: 'شركة رائدة في توريد القوى العاملة في المملكة العربية السعودية مع أكثر من 25 عاماً من الخبرة في تقديم العمالة الماهرة وغير الماهرة لمختلف الصناعات.',
        mission: 'تقديم خدمات استثنائية للقوى العاملة تلبي احتياجات عملائنا المتنوعة مع ضمان أعلى معايير الجودة والموثوقية والاحترافية.',
        vision: 'أن نكون الشركة الرائدة في توريد القوى العاملة في المملكة العربية السعودية، معترفاً بنا لالتزامنا بالتميز والابتكار في حلول القوى العاملة.'
      }
    }
  },

  services: [
    {
      title: 'Airport Operations Staff',
      slug: 'airport-operations-staff',
      description: 'Professional airport operations staff including ground handling, security personnel, maintenance workers, and customer service representatives for airports across Saudi Arabia.',
      shortDescription: 'Complete airport operations staffing solutions for all major airports in Saudi Arabia.',
      features: [
        {
          title: 'Ground Handling',
          description: 'Baggage handling, aircraft marshalling, and cargo operations',
          icon: 'plane'
        },
        {
          title: 'Security Services',
          description: 'Trained security personnel for passenger and cargo screening',
          icon: 'shield'
        },
        {
          title: 'Maintenance Staff',
          description: 'Skilled technicians for aircraft and equipment maintenance',
          icon: 'tools'
        },
        {
          title: 'Customer Service',
          description: 'Professional customer service representatives',
          icon: 'users'
        }
      ],
      benefits: [
        '24/7 availability',
        'Fully trained and certified staff',
        'Compliance with aviation regulations',
        'Emergency response capabilities',
        'Multi-language support'
      ],
      requirements: [
        'Valid security clearance',
        'Aviation industry certification',
        'Physical fitness requirements',
        'Background check clearance'
      ],
      category: 'Aviation',
      tags: ['airport', 'aviation', 'security', 'ground-handling', 'maintenance'],
      serviceType: 'contract',
      duration: 'long-term',
      location: 'All Saudi Arabia airports',
      pricing: {
        startingFrom: 2500,
        currency: 'SAR',
        pricingModel: 'monthly'
      },
      stats: {
        employeesDeployed: 2500,
        activeContracts: 15,
        clientSatisfaction: 98,
        successRate: 99
      },
      isFeatured: true,
      sortOrder: 1
    },
    {
      title: 'Corporate Office Staff',
      slug: 'corporate-office-staff',
      description: 'Professional administrative, executive, and support staff for corporate offices including receptionists, administrative assistants, IT support, and management personnel.',
      shortDescription: 'Complete corporate office staffing solutions for businesses across Saudi Arabia.',
      features: [
        {
          title: 'Administrative Support',
          description: 'Receptionists, secretaries, and administrative assistants',
          icon: 'briefcase'
        },
        {
          title: 'IT Support',
          description: 'Technical support staff and system administrators',
          icon: 'monitor'
        },
        {
          title: 'Management Staff',
          description: 'Office managers and supervisors',
          icon: 'user-check'
        },
        {
          title: 'Executive Assistants',
          description: 'High-level executive support personnel',
          icon: 'star'
        }
      ],
      benefits: [
        'Professional appearance and demeanor',
        'Multi-language capabilities',
        'Cultural sensitivity training',
        'Flexible scheduling options',
        'Comprehensive background checks'
      ],
      requirements: [
        'Relevant educational qualifications',
        'Professional experience',
        'Computer literacy',
        'Communication skills'
      ],
      category: 'Corporate',
      tags: ['corporate', 'office', 'administrative', 'management', 'support'],
      serviceType: 'permanent',
      duration: 'flexible',
      location: 'All major cities',
      pricing: {
        startingFrom: 3500,
        currency: 'SAR',
        pricingModel: 'monthly'
      },
      stats: {
        employeesDeployed: 1800,
        activeContracts: 45,
        clientSatisfaction: 96,
        successRate: 98
      },
      isFeatured: true,
      sortOrder: 2
    },
    {
      title: 'Catering Services Staff',
      slug: 'catering-services-staff',
      description: 'Professional catering and food service staff for events, restaurants, corporate dining, and hospitality venues including chefs, servers, and kitchen staff.',
      shortDescription: 'Complete catering and food service staffing solutions.',
      features: [
        {
          title: 'Chef Services',
          description: 'Professional chefs and culinary specialists',
          icon: 'chef-hat'
        },
        {
          title: 'Service Staff',
          description: 'Waiters, waitresses, and service attendants',
          icon: 'utensils'
        },
        {
          title: 'Kitchen Staff',
          description: 'Kitchen assistants and prep cooks',
          icon: 'chef-hat'
        },
        {
          title: 'Event Coordinators',
          description: 'Catering event coordinators and managers',
          icon: 'calendar'
        }
      ],
      benefits: [
        'Food safety certification',
        'Experience with various cuisines',
        'Event management capabilities',
        'Flexible staffing options',
        'Quality assurance protocols'
      ],
      requirements: [
        'Food handling certification',
        'Health clearance',
        'Experience in food service',
        'Customer service skills'
      ],
      category: 'Hospitality',
      tags: ['catering', 'food-service', 'hospitality', 'events', 'restaurants'],
      serviceType: 'project-based',
      duration: 'flexible',
      location: 'All regions',
      pricing: {
        startingFrom: 2000,
        currency: 'SAR',
        pricingModel: 'daily'
      },
      stats: {
        employeesDeployed: 1200,
        activeContracts: 30,
        clientSatisfaction: 94,
        successRate: 96
      },
      isFeatured: true,
      sortOrder: 3
    },
    {
      title: 'Inventory & Logistics Staff',
      slug: 'inventory-logistics-staff',
      description: 'Warehouse, inventory management, and logistics support staff including warehouse workers, forklift operators, inventory clerks, and logistics coordinators.',
      shortDescription: 'Complete warehouse and logistics staffing solutions.',
      features: [
        {
          title: 'Warehouse Operations',
          description: 'Warehouse workers and material handlers',
          icon: 'package'
        },
        {
          title: 'Forklift Operations',
          description: 'Certified forklift operators and drivers',
          icon: 'truck'
        },
        {
          title: 'Inventory Management',
          description: 'Inventory clerks and stock controllers',
          icon: 'clipboard'
        },
        {
          title: 'Logistics Coordination',
          description: 'Logistics coordinators and dispatchers',
          icon: 'map'
        }
      ],
      benefits: [
        'Forklift certification',
        'Inventory management systems training',
        'Safety protocol compliance',
        'Shift flexibility',
        'Quality control procedures'
      ],
      requirements: [
        'Physical fitness requirements',
        'Forklift operation certification',
        'Basic computer skills',
        'Attention to detail'
      ],
      category: 'Supply Chain',
      tags: ['warehouse', 'logistics', 'inventory', 'forklift', 'shipping'],
      serviceType: 'contract',
      duration: 'long-term',
      location: 'All major industrial areas',
      pricing: {
        startingFrom: 2200,
        currency: 'SAR',
        pricingModel: 'monthly'
      },
      stats: {
        employeesDeployed: 2000,
        activeContracts: 25,
        clientSatisfaction: 95,
        successRate: 97
      },
      isFeatured: true,
      sortOrder: 4
    },
    {
      title: 'Construction Workers',
      slug: 'construction-workers',
      description: 'Skilled and unskilled construction workers for various construction projects including general laborers, skilled tradespeople, and construction supervisors.',
      shortDescription: 'Complete construction workforce solutions for all types of projects.',
      features: [
        {
          title: 'General Labor',
          description: 'Construction laborers and helpers',
          icon: 'hammer'
        },
        {
          title: 'Skilled Trades',
          description: 'Electricians, plumbers, and carpenters',
          icon: 'wrench'
        },
        {
          title: 'Heavy Equipment',
          description: 'Excavator and crane operators',
          icon: 'truck'
        },
        {
          title: 'Supervision',
          description: 'Construction supervisors and foremen',
          icon: 'user-check'
        }
      ],
      benefits: [
        'Safety training and certification',
        'Experience with modern construction methods',
        'Equipment operation skills',
        'Team coordination abilities',
        'Quality workmanship standards'
      ],
      requirements: [
        'Physical fitness requirements',
        'Safety certification',
        'Relevant trade experience',
        'Team work capabilities'
      ],
      category: 'Construction',
      tags: ['construction', 'labor', 'trades', 'building', 'infrastructure'],
      serviceType: 'project-based',
      duration: 'flexible',
      location: 'All construction sites',
      pricing: {
        startingFrom: 1800,
        currency: 'SAR',
        pricingModel: 'daily'
      },
      stats: {
        employeesDeployed: 3000,
        activeContracts: 40,
        clientSatisfaction: 92,
        successRate: 95
      },
      isFeatured: true,
      sortOrder: 5
    },
    {
      title: 'Facility Management Staff',
      slug: 'facility-management-staff',
      description: 'Building maintenance, cleaning, and facility management personnel including janitors, maintenance technicians, security guards, and facility coordinators.',
      shortDescription: 'Complete facility management and maintenance staffing solutions.',
      features: [
        {
          title: 'Cleaning Services',
          description: 'Professional janitorial and cleaning staff',
          icon: 'sparkles'
        },
        {
          title: 'Maintenance',
          description: 'Building maintenance technicians',
          icon: 'tools'
        },
        {
          title: 'Security',
          description: 'Security guards and access control',
          icon: 'shield'
        },
        {
          title: 'Coordination',
          description: 'Facility coordinators and managers',
          icon: 'clipboard'
        }
      ],
      benefits: [
        '24/7 facility coverage',
        'Preventive maintenance programs',
        'Security protocol compliance',
        'Environmental safety standards',
        'Cost-effective solutions'
      ],
      requirements: [
        'Background check clearance',
        'Basic maintenance skills',
        'Physical fitness requirements',
        'Reliability and punctuality'
      ],
      category: 'Maintenance',
      tags: ['facility', 'maintenance', 'cleaning', 'security', 'building'],
      serviceType: 'contract',
      duration: 'long-term',
      location: 'All facility types',
      pricing: {
        startingFrom: 2000,
        currency: 'SAR',
        pricingModel: 'monthly'
      },
      stats: {
        employeesDeployed: 1500,
        activeContracts: 35,
        clientSatisfaction: 93,
        successRate: 96
      },
      isFeatured: true,
      sortOrder: 6
    }
  ],

  adminUsers: [
    {
      personalInfo: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@manpowercompany.com',
        phone: '+966-12-123-4567'
      },
      password: 'admin123',
      role: 'super_admin',
      permissions: [
        'manage_company_info',
        'manage_services',
        'manage_clients',
        'manage_contracts',
        'manage_gallery',
        'manage_jobs',
        'view_applications',
        'manage_applications',
        'manage_users',
        'manage_settings',
        'view_analytics',
        'manage_backups'
      ],
      profile: {
        bio: 'System Administrator',
        department: 'IT',
        position: 'System Administrator',
        timezone: 'Asia/Riyadh',
        language: 'en'
      }
    }
  ]
};

// Connect to database
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manpower_db');
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Clear existing data
async function clearDatabase() {
  try {
    console.log('🧹 Clearing existing data...');
    
    await Promise.all([
      Company.deleteMany({}),
      Service.deleteMany({}),
      Client.deleteMany({}),
      Contract.deleteMany({}),
      Location.deleteMany({}),
      Industry.deleteMany({}),
      JobCategory.deleteMany({}),
      JobPosting.deleteMany({}),
      GalleryCategory.deleteMany({}),
      GalleryImage.deleteMany({}),
      AdminUser.deleteMany({}),
      Language.deleteMany({})
    ]);
    
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  }
}

// Seed languages
async function seedLanguages() {
  try {
    console.log('🌐 Seeding languages...');
    
    for (const languageData of sampleData.languages) {
      const language = new Language(languageData);
      await language.save();
    }
    
    console.log('✅ Languages seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding languages:', error.message);
    throw error;
  }
}

// Seed industries
async function seedIndustries() {
  try {
    console.log('🏭 Seeding industries...');
    
    for (const industryData of sampleData.industries) {
      const industry = new Industry(industryData);
      await industry.save();
    }
    
    console.log('✅ Industries seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding industries:', error.message);
    throw error;
  }
}

// Seed job categories
async function seedJobCategories() {
  try {
    console.log('💼 Seeding job categories...');
    
    for (const categoryData of sampleData.jobCategories) {
      const category = new JobCategory(categoryData);
      await category.save();
    }
    
    console.log('✅ Job categories seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding job categories:', error.message);
    throw error;
  }
}

// Seed locations
async function seedLocations() {
  try {
    console.log('📍 Seeding locations...');
    
    for (const locationData of sampleData.locations) {
      const location = new Location(locationData);
      await location.save();
    }
    
    console.log('✅ Locations seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding locations:', error.message);
    throw error;
  }
}

// Seed company
async function seedCompany() {
  try {
    console.log('🏢 Seeding company...');
    
    const company = new Company(sampleData.company);
    await company.save();
    
    console.log('✅ Company seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding company:', error.message);
    throw error;
  }
}

// Seed services
async function seedServices() {
  try {
    console.log('🔧 Seeding services...');
    
    // Get industries to link services
    const industries = await Industry.find({});
    const industryMap = {};
    industries.forEach(industry => {
      // Map by category name instead of industry name
      const categoryMapping = {
        'Aviation': 'Airport Operations',
        'Corporate': 'Corporate Offices', 
        'Hospitality': 'Catering Services',
        'Supply Chain': 'Inventory & Logistics',
        'Construction': 'Construction',
        'Maintenance': 'Facility Management'
      };
      
      if (categoryMapping[industry.category]) {
        industryMap[industry.category] = industry._id;
      }
    });
    
    for (const serviceData of sampleData.services) {
      // Create a copy of service data to avoid modifying original
      const serviceToCreate = { ...serviceData };
      
      // Link service to industry
      if (industryMap[serviceData.category]) {
        serviceToCreate.industry = industryMap[serviceData.category];
      } else {
        console.warn(`⚠️  No industry found for category: ${serviceData.category}`);
        // Use first industry as fallback
        serviceToCreate.industry = industries[0]._id;
      }
      
      const service = new Service(serviceToCreate);
      await service.save();
    }
    
    console.log('✅ Services seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding services:', error.message);
    throw error;
  }
}

// Seed admin users
async function seedAdminUsers() {
  try {
    console.log('👤 Seeding admin users...');
    
    for (const userData of sampleData.adminUsers) {
      const user = new AdminUser(userData);
      await user.save();
    }
    
    console.log('✅ Admin users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding admin users:', error.message);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDatabase();
    
    // Clear existing data
    await clearDatabase();
    
    // Seed data in order
    await seedLanguages();
    await seedIndustries();
    await seedJobCategories();
    await seedLocations();
    await seedCompany();
    await seedServices();
    await seedAdminUsers();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Languages: 2 (English, Arabic)');
    console.log('- Industries: 6');
    console.log('- Job Categories: 5');
    console.log('- Locations: 4 (Jeddah, Riyadh, Dammam, Madina)');
    console.log('- Company: 1 (Manpower Supply Company)');
    console.log('- Services: 6 (Airport, Corporate, Catering, Logistics, Construction, Facility)');
    console.log('- Admin Users: 1');
    console.log('\n🔑 Default Admin Login:');
    console.log('Email: admin@manpowercompany.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
