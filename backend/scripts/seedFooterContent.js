const mongoose = require('mongoose');
const FooterContent = require('../models/FooterContent');
require('dotenv').config();

const ADMIN_DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manpower_db';

const defaultFooterContent = {
  company_info: {
    en: {
      name: 'Saudi Manpower',
      tagline: 'Leading Workforce Solutions',
      description: 'Leading manpower supply company in Saudi Arabia with 25+ years of experience providing quality workforce solutions across multiple industries.',
      mission: 'To provide exceptional workforce solutions that empower businesses and create meaningful career opportunities.',
      stats: {
        experience: '25+',
        employees: '10,000+',
        regions: '4'
      },
      certifications: [
        { name: 'ISO 9001:2015', image: '/assets/iso-certification.png' },
        { name: 'Ministry Approved', image: '/assets/saudi-ministry-logo.png' }
      ]
    },
    ar: {
      name: 'القوى العاملة السعودية',
      tagline: 'حلول القوى العاملة الرائدة',
      description: 'شركة رائدة في توريد القوى العاملة في المملكة العربية السعودية مع أكثر من 25 سنة من الخبرة في توفير حلول القوى العاملة عالية الجودة عبر صناعات متعددة.',
      mission: 'تقديم حلول استثنائية للقوى العاملة تمكن الشركات وتخلق فرص عمل هادفة.',
      stats: {
        experience: '25+',
        employees: '10,000+',
        regions: '4'
      },
      certifications: [
        { name: 'ISO 9001:2015', image: '/assets/iso-certification.png' },
        { name: 'معتمد من الوزارة', image: '/assets/saudi-ministry-logo.png' }
      ]
    }
  },
  quick_links: {
    en: [
      { name: 'Home', url: '/', icon: 'home' },
      { name: 'About Us', url: '/about', icon: 'info' },
      { name: 'Our Services', url: '/services', icon: 'build' },
      { name: 'Career Opportunities', url: '/careers', icon: 'work' },
      { name: 'Our Clients', url: '/clients', icon: 'business' },
      { name: 'Contact Us', url: '/contact', icon: 'contact_mail' },
      { name: 'Gallery', url: '/gallery', icon: 'photo_library' },
      { name: 'Blog & News', url: '/blog', icon: 'article' }
    ],
    ar: [
      { name: 'الرئيسية', url: '/', icon: 'home' },
      { name: 'من نحن', url: '/about', icon: 'info' },
      { name: 'خدماتنا', url: '/services', icon: 'build' },
      { name: 'الوظائف', url: '/careers', icon: 'work' },
      { name: 'عملاؤنا', url: '/clients', icon: 'business' },
      { name: 'اتصل بنا', url: '/contact', icon: 'contact_mail' },
      { name: 'المعرض', url: '/gallery', icon: 'photo_library' },
      { name: 'الأخبار', url: '/blog', icon: 'article' }
    ]
  },
  services: {
    en: [
      { 
        name: 'Airport Operations', 
        url: '/services/airport', 
        icon: 'flight',
        description: 'Ground handling, security, customer service'
      },
      { 
        name: 'Corporate Services', 
        url: '/services/corporate', 
        icon: 'business_center',
        description: 'Administrative, HR, management professionals'
      },
      { 
        name: 'Catering Services', 
        url: '/services/catering', 
        icon: 'restaurant',
        description: 'Chefs, kitchen staff, food service'
      },
      { 
        name: 'Logistics & Warehousing', 
        url: '/services/logistics', 
        icon: 'local_shipping',
        description: 'Warehouse staff, drivers, supply chain'
      },
      { 
        name: 'Construction', 
        url: '/services/construction', 
        icon: 'construction',
        description: 'Engineers, technicians, construction workers'
      },
      { 
        name: 'Facility Management', 
        url: '/services/facility', 
        icon: 'build',
        description: 'Maintenance, cleaning, security personnel'
      }
    ],
    ar: [
      { 
        name: 'عمليات المطار', 
        url: '/services/airport', 
        icon: 'flight',
        description: 'التعامل مع الأرض والأمن وخدمة العملاء'
      },
      { 
        name: 'الخدمات المؤسسية', 
        url: '/services/corporate', 
        icon: 'business_center',
        description: 'محترفون إداريون وموارد بشرية وإدارة'
      },
      { 
        name: 'خدمات الضيافة', 
        url: '/services/catering', 
        icon: 'restaurant',
        description: 'طهاة وموظفو مطبخ وخدمة الطعام'
      },
      { 
        name: 'اللوجستيات والمستودعات', 
        url: '/services/logistics', 
        icon: 'local_shipping',
        description: 'موظفو مستودعات وسائقون وسلسلة توريد'
      },
      { 
        name: 'الإنشاءات', 
        url: '/services/construction', 
        icon: 'construction',
        description: 'مهندسون وفنيون وعمال بناء'
      },
      { 
        name: 'إدارة المرافق', 
        url: '/services/facility', 
        icon: 'build',
        description: 'صيانة وتنظيف وموظفو أمن'
      }
    ]
  },
  contact: {
    en: {
      addresses: [
        {
          type: 'Head Office',
          address: 'King Fahd Road, Al Olaya District, Riyadh 12213, Saudi Arabia',
          isPrimary: true
        },
        {
          type: 'Jeddah Branch',
          address: 'Prince Sultan Road, Al Rawdah District, Jeddah 23432'
        },
        {
          type: 'Dammam Branch',
          address: 'King Abdulaziz Road, Al Faisaliyah District, Dammam 32414'
        }
      ],
      phones: [
        { number: '+966 11 123 4567', type: 'Main', icon: 'phone' },
        { number: '+966 11 123 4568', type: 'HR Department', icon: 'phone' },
        { number: '+966 50 123 4569', type: 'WhatsApp', icon: 'whatsapp', isWhatsApp: true }
      ],
      emails: [
        { email: 'info@manpowercompany.sa', type: 'General', icon: 'email' },
        { email: 'careers@manpowercompany.sa', type: 'Careers', icon: 'work' },
        { email: 'support@manpowercompany.sa', type: 'Support', icon: 'support' }
      ],
      workingHours: [
        { day: 'Sunday - Thursday', time: '8:00 AM - 5:00 PM' },
        { day: 'Friday', time: 'Closed' },
        { day: 'Saturday', time: '9:00 AM - 2:00 PM' }
      ],
      emergency: {
        number: '+966 50 123 4569',
        available: '24/7 Available'
      }
    },
    ar: {
      addresses: [
        {
          type: 'المكتب الرئيسي',
          address: 'طريق الملك فهد، حي العليا، الرياض 12213، المملكة العربية السعودية',
          isPrimary: true
        },
        {
          type: 'فرع جدة',
          address: 'طريق الأمير سلطان، حي الروضة، جدة 23432'
        },
        {
          type: 'فرع الدمام',
          address: 'طريق الملك عبدالعزيز، حي الفيصلية، الدمام 32414'
        }
      ],
      phones: [
        { number: '+966 11 123 4567', type: 'الرئيسي', icon: 'phone' },
        { number: '+966 11 123 4568', type: 'قسم الموارد البشرية', icon: 'phone' },
        { number: '+966 50 123 4569', type: 'واتساب', icon: 'whatsapp', isWhatsApp: true }
      ],
      emails: [
        { email: 'info@manpowercompany.sa', type: 'عام', icon: 'email' },
        { email: 'careers@manpowercompany.sa', type: 'الوظائف', icon: 'work' },
        { email: 'support@manpowercompany.sa', type: 'الدعم', icon: 'support' }
      ],
      workingHours: [
        { day: 'الأحد - الخميس', time: '8:00 ص - 5:00 م' },
        { day: 'الجمعة', time: 'مغلق' },
        { day: 'السبت', time: '9:00 ص - 2:00 م' }
      ],
      emergency: {
        number: '+966 50 123 4569',
        available: 'متاح 24/7'
      }
    }
  },
  social_media: {
    en: {
      platforms: [
        {
          name: 'Facebook',
          url: 'https://facebook.com/saudimanpower',
          icon: 'facebook',
          color: '#1877F2',
          followers: '2.5K'
        },
        {
          name: 'Twitter',
          url: 'https://twitter.com/saudimanpower',
          icon: 'twitter',
          color: '#1DA1F2',
          followers: '1.8K'
        },
        {
          name: 'LinkedIn',
          url: 'https://linkedin.com/company/saudimanpower',
          icon: 'linkedin',
          color: '#0077B5',
          followers: '3.2K'
        },
        {
          name: 'Instagram',
          url: 'https://instagram.com/saudimanpower',
          icon: 'instagram',
          color: '#E4405F',
          followers: '1.5K'
        },
        {
          name: 'YouTube',
          url: 'https://youtube.com/saudimanpower',
          icon: 'youtube',
          color: '#FF0000',
          followers: '890'
        },
        {
          name: 'WhatsApp',
          url: 'https://wa.me/966501234569',
          icon: 'whatsapp',
          color: '#25D366',
          followers: 'Business'
        }
      ],
      stats: {
        totalFollowers: '10K+',
        postsShared: '500+',
        engagementRate: '98%'
      }
    },
    ar: {
      platforms: [
        {
          name: 'فيسبوك',
          url: 'https://facebook.com/saudimanpower',
          icon: 'facebook',
          color: '#1877F2',
          followers: '2.5K'
        },
        {
          name: 'تويتر',
          url: 'https://twitter.com/saudimanpower',
          icon: 'twitter',
          color: '#1DA1F2',
          followers: '1.8K'
        },
        {
          name: 'لينكد إن',
          url: 'https://linkedin.com/company/saudimanpower',
          icon: 'linkedin',
          color: '#0077B5',
          followers: '3.2K'
        },
        {
          name: 'إنستغرام',
          url: 'https://instagram.com/saudimanpower',
          icon: 'instagram',
          color: '#E4405F',
          followers: '1.5K'
        },
        {
          name: 'يوتيوب',
          url: 'https://youtube.com/saudimanpower',
          icon: 'youtube',
          color: '#FF0000',
          followers: '890'
        },
        {
          name: 'واتساب',
          url: 'https://wa.me/966501234569',
          icon: 'whatsapp',
          color: '#25D366',
          followers: 'Business'
        }
      ],
      stats: {
        totalFollowers: '10K+',
        postsShared: '500+',
        engagementRate: '98%'
      }
    }
  },
  legal: {
    en: {
      links: [
        { name: 'Privacy Policy', url: '/privacy-policy' },
        { name: 'Terms of Service', url: '/terms-of-service' },
        { name: 'Cookie Policy', url: '/cookie-policy' },
        { name: 'Data Protection', url: '/data-protection' },
        { name: 'Careers', url: '/careers' },
        { name: 'Sitemap', url: '/sitemap' }
      ],
      copyright: 'Manpower Supply Company. All rights reserved.',
      companyDetails: 'Commercial Registration: 1010123456 | Tax Number: 300123456789003',
      certifications: [
        'ISO 9001:2015 Certified',
        'Ministry of Labor Approved'
      ]
    },
    ar: {
      links: [
        { name: 'سياسة الخصوصية', url: '/privacy-policy' },
        { name: 'شروط الخدمة', url: '/terms-of-service' },
        { name: 'سياسة ملفات تعريف الارتباط', url: '/cookie-policy' },
        { name: 'حماية البيانات', url: '/data-protection' },
        { name: 'الوظائف', url: '/careers' },
        { name: 'خريطة الموقع', url: '/sitemap' }
      ],
      copyright: 'شركة توريد القوى العاملة. جميع الحقوق محفوظة.',
      companyDetails: 'السجل التجاري: 1010123456 | الرقم الضريبي: 300123456789003',
      certifications: [
        'معتمد ISO 9001:2015',
        'معتمد من وزارة العمل'
      ]
    }
  },
  newsletter: {
    en: {
      title: 'Stay Updated',
      description: 'Subscribe to our newsletter for the latest job opportunities, company news, and industry insights.',
      benefits: [
        { text: 'Latest job openings', icon: 'notifications' },
        { text: 'Industry insights', icon: 'trending_up' },
        { text: 'Company events', icon: 'event' },
        { text: 'Privacy protected', icon: 'security' }
      ],
      privacyText: 'We respect your privacy. Unsubscribe at any time.',
      privacyLink: 'Privacy Policy'
    },
    ar: {
      title: 'ابق محدثاً',
      description: 'اشترك في نشرتنا الإخبارية للحصول على أحدث فرص العمل وأخبار الشركة ورؤى الصناعة.',
      benefits: [
        { text: 'أحدث الوظائف الشاغرة', icon: 'notifications' },
        { text: 'رؤى الصناعة', icon: 'trending_up' },
        { text: 'أحداث الشركة', icon: 'event' },
        { text: 'محمي الخصوصية', icon: 'security' }
      ],
      privacyText: 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.',
      privacyLink: 'سياسة الخصوصية'
    }
  }
};

async function seedFooterContent() {
  try {
    console.log('🌱 Starting footer content seeding...');
    
    // Connect to database
    await mongoose.connect(ADMIN_DB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing footer content
    await FooterContent.deleteMany({});
    console.log('🗑️  Cleared existing footer content');

    // Insert default footer content
    const sections = Object.keys(defaultFooterContent);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const content = defaultFooterContent[section];
      
      await FooterContent.create({
        section,
        content,
        displayOrder: i + 1,
        isActive: true
      });
      
      console.log(`✅ Created footer section: ${section}`);
    }

    console.log('🎉 Footer content seeding completed successfully!');
    console.log(`📊 Created ${sections.length} footer sections`);

  } catch (error) {
    console.error('❌ Error seeding footer content:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
if (require.main === module) {
  seedFooterContent();
}

module.exports = { seedFooterContent, defaultFooterContent };
