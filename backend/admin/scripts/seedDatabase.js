require('dotenv').config();
const mongoose = require('mongoose');
const { connectDatabase } = require('../config/database');

// Import models
const AdminUser = require('../models/AdminUser');
const SiteContent = require('../models/SiteContent');
const AdminService = require('../models/Service');
const AdminClient = require('../models/Client');

const seedDatabase = async () => {
  try {
    await connectDatabase();

    console.log('🌱 Starting database seeding...');

    // Create default admin user
    const existingAdmin = await AdminUser.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const adminUser = new AdminUser({
        username: 'admin',
        email: 'admin@manpowercompany.sa',
        password_hash: 'Admin123!', // This will be hashed automatically
        role: 'super_admin'
      });
      
      await adminUser.save();
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: Admin123!');
      console.log('   Email: admin@manpowercompany.sa');
    } else {
      // Test if password is working, if not recreate
      const passwordTest = await existingAdmin.comparePassword('Admin123!');
      if (!passwordTest) {
        console.log('⚠️  Admin user exists but password is invalid, recreating...');
        await AdminUser.deleteOne({ username: 'admin' });
        
        const adminUser = new AdminUser({
          username: 'admin',
          email: 'admin@manpowercompany.sa',
          password_hash: 'Admin123!',
          role: 'super_admin'
        });
        
        await adminUser.save();
        console.log('✅ Admin user recreated with correct password');
        console.log('   Username: admin');
        console.log('   Password: Admin123!');
        console.log('   Email: admin@manpowercompany.sa');
      } else {
        console.log('ℹ️  Admin user already exists and password is valid');
      }
    }

    // Create sample site content
    const siteContentData = [
      {
        section: 'home',
        content_key: 'hero_title_en',
        content_value_en: 'Leading Manpower Solutions Provider',
        content_value_ar: 'مزود حلول القوى العاملة الرائد',
        data_type: 'text'
      },
      {
        section: 'home',
        content_key: 'hero_title_ar',
        content_value_en: 'Leading Manpower Solutions Provider',
        content_value_ar: 'مزود حلول القوى العاملة الرائد',
        data_type: 'text'
      },
      {
        section: 'home',
        content_key: 'years_experience',
        content_value_en: '25+',
        content_value_ar: '25+',
        data_type: 'number'
      },
      {
        section: 'home',
        content_key: 'employees_served',
        content_value_en: '10,000+',
        content_value_ar: '10,000+',
        data_type: 'number'
      },
      {
        section: 'about',
        content_key: 'mission_en',
        content_value_en: 'To provide exceptional manpower solutions that empower businesses and create meaningful employment opportunities.',
        content_value_ar: 'تقديم حلول القوى العاملة الاستثنائية التي تمكن الشركات وتخلق فرص عمل هادفة.',
        data_type: 'text'
      },
      {
        section: 'about',
        content_key: 'vision_en',
        content_value_en: 'To be the leading manpower solutions provider in Saudi Arabia, recognized for excellence and innovation.',
        content_value_ar: 'أن نكون مزود حلول القوى العاملة الرائد في المملكة العربية السعودية، معروفين بالتميز والابتكار.',
        data_type: 'text'
      }
    ];

    for (const content of siteContentData) {
      const existingContent = await SiteContent.findOne({ 
        section: content.section, 
        content_key: content.content_key 
      });
      
      if (!existingContent) {
        await SiteContent.create(content);
        console.log(`✅ Site content created: ${content.section}.${content.content_key}`);
      }
    }

    // Create sample services
    const servicesData = [
      {
        title_en: 'Airport Operations',
        title_ar: 'عمليات المطار',
        description_en: 'Comprehensive airport operations support including ground handling, passenger services, and cargo management.',
        description_ar: 'دعم شامل لعمليات المطار بما في ذلك خدمات الأرض وخدمات الركاب وإدارة البضائع.',
        short_description_en: 'Professional airport operations support',
        short_description_ar: 'دعم عمليات المطار المهنية',
        icon: '✈️',
        display_order: 1
      },
      {
        title_en: 'Corporate Offices',
        title_ar: 'المكاتب المؤسسية',
        description_en: 'Executive and administrative staffing for corporate environments with specialized skill sets.',
        description_ar: 'الموظفين التنفيذيين والإداريين للبيئات المؤسسية بمجموعات مهارات متخصصة.',
        short_description_en: 'Corporate staffing solutions',
        short_description_ar: 'حلول التوظيف المؤسسي',
        icon: '🏢',
        display_order: 2
      },
      {
        title_en: 'Catering Services',
        title_ar: 'خدمات التموين',
        description_en: 'Professional catering staff for events, restaurants, and hospitality venues.',
        description_ar: 'موظفي التموين المحترفين للمناسبات والمطاعم وأماكن الضيافة.',
        short_description_en: 'Professional catering staff',
        short_description_ar: 'موظفي التموين المحترفين',
        icon: '🍽️',
        display_order: 3
      },
      {
        title_en: 'Logistics & Warehousing',
        title_ar: 'الخدمات اللوجستية والمستودعات',
        description_en: 'Skilled logistics personnel for warehouse operations, inventory management, and supply chain coordination.',
        description_ar: 'الأفراد اللوجستيون المهرة لعمليات المستودعات وإدارة المخزون وتنسيق سلسلة التوريد.',
        short_description_en: 'Logistics and warehouse staff',
        short_description_ar: 'موظفي الخدمات اللوجستية والمستودعات',
        icon: '📦',
        display_order: 4
      },
      {
        title_en: 'Construction & Engineering',
        title_ar: 'البناء والهندسة',
        description_en: 'Qualified construction workers and engineers for various infrastructure and building projects.',
        description_ar: 'عمال البناء والمهندسون المؤهلون لمشاريع البنية التحتية والبناء المختلفة.',
        short_description_en: 'Construction and engineering personnel',
        short_description_ar: 'أفراد البناء والهندسة',
        icon: '🏗️',
        display_order: 5
      },
      {
        title_en: 'Facility Management',
        title_ar: 'إدارة المرافق',
        description_en: 'Facility maintenance and management staff for commercial and residential properties.',
        description_ar: 'موظفي صيانة وإدارة المرافق للممتلكات التجارية والسكنية.',
        short_description_en: 'Facility management staff',
        short_description_ar: 'موظفي إدارة المرافق',
        icon: '🔧',
        display_order: 6
      }
    ];

    for (const service of servicesData) {
      const existingService = await AdminService.findOne({ title_en: service.title_en });
      
      if (!existingService) {
        await AdminService.create(service);
        console.log(`✅ Service created: ${service.title_en}`);
      }
    }

    // Create comprehensive Saudi clients
    const clientsData = [
      {
        name: 'Saudi Aramco',
        displayName: 'Saudi Aramco - Oil & Gas Giant',
        industry: 'Oil & Gas',
        companySize: 'Enterprise',
        foundedYear: 1933,
        headquarters: 'Dhahran, Eastern Province',
        website: 'https://www.aramco.com',
        primaryContact: {
          name: 'Ahmed Al-Khalid',
          email: 'ahmed.alkhalid@aramco.com',
          phone: '+966-13-876-0000',
          position: 'HR Director'
        },
        contract_start: new Date('2018-01-01'),
        contract_end: new Date('2028-12-31'),
        totalProjects: 45,
        activeProjects: 12,
        totalRevenue: 15000000,
        isFeatured: true,
        description: 'Saudi Arabian Oil Company - world\'s largest oil producer',
        tags: ['oil', 'gas', 'energy'],
        display_order: 1
      },
      {
        name: 'SABIC',
        displayName: 'SABIC - Saudi Basic Industries',
        industry: 'Manufacturing',
        companySize: 'Enterprise',
        foundedYear: 1976,
        headquarters: 'Riyadh',
        website: 'https://www.sabic.com',
        primaryContact: {
          name: 'Mohammed Al-Rashid',
          email: 'm.alrashid@sabic.com',
          phone: '+966-11-225-8000',
          position: 'Operations Manager'
        },
        contract_start: new Date('2019-06-01'),
        contract_end: new Date('2025-12-31'),
        totalProjects: 38,
        activeProjects: 8,
        totalRevenue: 12000000,
        isFeatured: true,
        description: 'Leading manufacturer of chemicals and plastics',
        tags: ['manufacturing', 'chemicals'],
        display_order: 2
      },
      {
        name: 'King Abdulaziz International Airport',
        displayName: 'KAIA',
        industry: 'Aviation',
        companySize: 'Enterprise',
        foundedYear: 1981,
        headquarters: 'Jeddah',
        website: 'https://www.gaca.gov.sa',
        primaryContact: {
          name: 'Khalid Al-Ghamdi',
          email: 'k.alghamdi@gaca.gov.sa',
          phone: '+966-12-684-2000',
          position: 'Facility Manager'
        },
        contract_start: new Date('2017-06-01'),
        contract_end: new Date('2027-12-31'),
        totalProjects: 52,
        activeProjects: 15,
        totalRevenue: 18000000,
        isFeatured: true,
        description: 'Major international airport serving Jeddah',
        tags: ['aviation', 'airport'],
        display_order: 3
      },
      {
        name: 'Al-Rajhi Bank',
        displayName: 'Al-Rajhi Bank',
        industry: 'Banking',
        companySize: 'Large',
        foundedYear: 1957,
        headquarters: 'Riyadh',
        website: 'https://www.alrajhibank.com.sa',
        primaryContact: {
          name: 'Abdullah Al-Rajhi',
          email: 'a.alrajhi@alrajhibank.com.sa',
          phone: '+966-11-828-2515',
          position: 'Branch Manager'
        },
        contract_start: new Date('2020-01-01'),
        contract_end: new Date('2025-12-31'),
        totalProjects: 25,
        activeProjects: 10,
        totalRevenue: 8000000,
        description: 'One of the largest Islamic banks',
        tags: ['banking', 'finance'],
        display_order: 4
      },
      {
        name: 'NEOM Project',
        displayName: 'NEOM - The City of the Future',
        industry: 'Construction',
        companySize: 'Enterprise',
        foundedYear: 2017,
        headquarters: 'Tabuk',
        website: 'https://www.neom.com',
        primaryContact: {
          name: 'Nadhmi Al-Nasr',
          email: 'n.alnasr@neom.com',
          phone: '+966-14-123-4567',
          position: 'CEO'
        },
        contract_start: new Date('2021-02-01'),
        contract_end: new Date('2030-12-31'),
        totalProjects: 20,
        activeProjects: 18,
        totalRevenue: 25000000,
        isFeatured: true,
        description: 'Mega project building sustainable smart city',
        tags: ['construction', 'mega_project', 'vision_2030'],
        display_order: 5
      },
      {
        name: 'Red Sea Global',
        displayName: 'Red Sea Global',
        industry: 'Tourism',
        companySize: 'Large',
        foundedYear: 2018,
        headquarters: 'Riyadh',
        website: 'https://www.redseaglobal.com',
        primaryContact: {
          name: 'Nora Al-Dabal',
          email: 'n.aldabal@redseaglobal.com',
          phone: '+966-11-XXX-XXXX',
          position: 'HR Manager'
        },
        contract_start: new Date('2020-03-01'),
        contract_end: new Date('2026-12-31'),
        totalProjects: 15,
        activeProjects: 12,
        totalRevenue: 8500000,
        description: 'Luxury tourism development on Red Sea coast',
        tags: ['tourism', 'hospitality'],
        display_order: 6
      },
      {
        name: 'Royal Commission for AlUla',
        displayName: 'RCU - Royal Commission for AlUla',
        industry: 'Heritage',
        companySize: 'Medium',
        foundedYear: 2017,
        headquarters: 'AlUla',
        website: 'https://www.rcu.gov.sa',
        primaryContact: {
          name: 'Ahmad Al-Shammari',
          email: 'a.alshammari@rcu.gov.sa',
          phone: '+966-14-XXX-XXXX',
          position: 'Operations Director'
        },
        contract_start: new Date('2019-05-01'),
        contract_end: new Date('2025-12-31'),
        totalProjects: 18,
        activeProjects: 10,
        totalRevenue: 6000000,
        description: 'Developing AlUla as a global heritage destination',
        tags: ['heritage', 'tourism', 'culture'],
        display_order: 7
      },
      {
        name: 'King Fahd Hospital',
        displayName: 'King Fahd Hospital',
        industry: 'Healthcare',
        companySize: 'Enterprise',
        foundedYear: 1989,
        headquarters: 'Riyadh',
        website: 'https://www.kfh.med.sa',
        primaryContact: {
          name: 'Dr. Saleh Al-Mutairi',
          email: 's.almutairi@kfh.med.sa',
          phone: '+966-11-464-7272',
          position: 'Administrator'
        },
        contract_start: new Date('2018-11-01'),
        contract_end: new Date('2026-03-31'),
        totalProjects: 40,
        activeProjects: 14,
        totalRevenue: 10000000,
        isFeatured: true,
        description: 'Major government hospital',
        tags: ['healthcare', 'hospital'],
        display_order: 8
      }
    ];

    for (const client of clientsData) {
      const existingClient = await AdminClient.findOne({ name: client.name });
      
      if (!existingClient) {
        await AdminClient.create(client);
        console.log(`✅ Client created: ${client.name}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Admin user: admin / Admin123!');
    console.log('   - Sample site content created');
    console.log('   - 6 services created');
    console.log('   - 8 comprehensive clients created with full details');
    console.log('\n🔗 You can now access the admin panel at: http://localhost:3000/admin-login');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
    process.exit(0);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
