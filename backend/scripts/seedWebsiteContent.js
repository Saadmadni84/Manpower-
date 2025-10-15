const mongoose = require('mongoose');
const WebsiteContent = require('../models/WebsiteContent');
const PageContent = require('../models/PageContent');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manpower-company', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Default content data
const defaultContent = {
  home: [
    // Hero Section
    { section: 'hero', contentKey: 'title', content: { en: 'Leading Manpower Solutions Provider', ar: 'المزود الرائد لحلول القوى العاملة' }, contentType: 'text' },
    { section: 'hero', contentKey: 'subtitle', content: { en: 'Connecting Talent with Opportunity Across the Middle East', ar: 'ربط المواهب بالفرص في جميع أنحاء الشرق الأوسط' }, contentType: 'text' },
    { section: 'hero', contentKey: 'description', content: { en: '<p>With over 25 years of experience, we provide comprehensive workforce solutions to businesses across multiple industries.</p>', ar: '<p>مع أكثر من 25 عامًا من الخبرة، نوفر حلول القوى العاملة الشاملة للشركات في مختلف الصناعات.</p>' }, contentType: 'html' },
    { section: 'hero', contentKey: 'cta_text', content: { en: 'Get Started', ar: 'ابدأ الآن' }, contentType: 'text' },
    { section: 'hero', contentKey: 'cta_link', content: { en: '/contact', ar: '/contact' }, contentType: 'url' },
    
    // Statistics Section
    { section: 'statistics', contentKey: 'years_experience', content: { en: '25', ar: '25' }, contentType: 'number' },
    { section: 'statistics', contentKey: 'total_employees', content: { en: '10,000+', ar: '10,000+' }, contentType: 'text' },
    { section: 'statistics', contentKey: 'regions', content: { en: '4', ar: '4' }, contentType: 'number' },
    { section: 'statistics', contentKey: 'clients_served', content: { en: '500', ar: '500' }, contentType: 'number' },
    { section: 'statistics', contentKey: 'completed_projects', content: { en: '1000', ar: '1000' }, contentType: 'number' },
    { section: 'statistics', contentKey: 'success_rate', content: { en: '95', ar: '95' }, contentType: 'number' },
    
    // Services Preview Section
    { section: 'services_preview', contentKey: 'title', content: { en: 'Our Services', ar: 'خدماتنا' }, contentType: 'text' },
    { section: 'services_preview', contentKey: 'description', content: { en: '<p>We offer comprehensive manpower solutions tailored to your business needs.</p>', ar: '<p>نقدم حلول القوى العاملة الشاملة المصممة خصيصًا لاحتياجات عملك.</p>' }, contentType: 'html' },
    { section: 'services_preview', contentKey: 'per_row', content: { en: '3', ar: '3' }, contentType: 'number' },
    { section: 'services_preview', contentKey: 'show_view_all', content: { en: 'true', ar: 'true' }, contentType: 'text' },
    { section: 'services_preview', contentKey: 'view_all_text', content: { en: 'View All Services', ar: 'عرض جميع الخدمات' }, contentType: 'text' },
    
    // Testimonials Section
    { section: 'testimonials', contentKey: 'title', content: { en: 'What Our Clients Say', ar: 'ماذا يقول عملاؤنا' }, contentType: 'text' },
    { section: 'testimonials', contentKey: 'display_format', content: { en: 'slider', ar: 'slider' }, contentType: 'text' },
    
    // CTA Section
    { section: 'cta', contentKey: 'title', content: { en: 'Ready to Get Started?', ar: 'هل أنت مستعد للبدء؟' }, contentType: 'text' },
    { section: 'cta', contentKey: 'description', content: { en: 'Join thousands of satisfied clients who trust us with their workforce needs.', ar: 'انضم إلى آلاف العملاء الراضين الذين يثقون بنا في احتياجات القوى العاملة.' }, contentType: 'text' },
    { section: 'cta', contentKey: 'primary_button_text', content: { en: 'Contact Us', ar: 'اتصل بنا' }, contentType: 'text' },
    { section: 'cta', contentKey: 'primary_button_link', content: { en: '/contact', ar: '/contact' }, contentType: 'url' }
  ],
  
  about: [
    // Overview Section
    { section: 'overview', contentKey: 'title', content: { en: 'About Us', ar: 'معلومات عنا' }, contentType: 'text' },
    { section: 'overview', contentKey: 'introduction', content: { en: '<p>We are a leading manpower solutions provider with over 25 years of experience in the Middle East market.</p>', ar: '<p>نحن مزود رائد لحلول القوى العاملة مع أكثر من 25 عامًا من الخبرة في سوق الشرق الأوسط.</p>' }, contentType: 'html' },
    { section: 'overview', contentKey: 'mission', content: { en: '<p>Our mission is to bridge the gap between talented professionals and leading organizations.</p>', ar: '<p>مهمتنا هي سد الفجوة بين المهنيين الموهوبين والمنظمات الرائدة.</p>' }, contentType: 'html' },
    { section: 'overview', contentKey: 'vision', content: { en: '<p>To be the most trusted workforce solutions partner in the region.</p>', ar: '<p>أن نكون الشريك الأكثر ثقة في حلول القوى العاملة في المنطقة.</p>' }, contentType: 'html' },
    
    // Values Section
    { section: 'values', contentKey: 'title', content: { en: 'Our Core Values', ar: 'قيمنا الأساسية' }, contentType: 'text' },
    { section: 'values', contentKey: 'description', content: { en: '<p>Our values guide everything we do and define who we are.</p>', ar: '<p>قيمنا توجه كل ما نقوم به وتحدد من نحن.</p>' }, contentType: 'html' },
    
    // History Section
    { section: 'history', contentKey: 'title', content: { en: 'Our Journey', ar: 'رحلتنا' }, contentType: 'text' },
    { section: 'history', contentKey: 'description', content: { en: '<p>Founded in 1998, we have grown to become one of the leading manpower providers in the region.</p>', ar: '<p>تأسست في عام 1998، وقد نمونا لنصبح أحد مقدمي القوى العاملة الرائدين في المنطقة.</p>' }, contentType: 'html' },
    
    // Team Section
    { section: 'team', contentKey: 'title', content: { en: 'Meet Our Leadership Team', ar: 'تعرف على فريق قيادتنا' }, contentType: 'text' },
    { section: 'team', contentKey: 'description', content: { en: '<p>Our experienced leadership team brings decades of industry expertise.</p>', ar: '<p>يجلب فريق قيادتنا ذو الخبرة عقودًا من الخبرة الصناعية.</p>' }, contentType: 'html' },
    
    // Why Us Section
    { section: 'why_us', contentKey: 'title', content: { en: 'Why Choose Us', ar: 'لماذا تختارنا' }, contentType: 'text' },
    { section: 'why_us', contentKey: 'introduction', content: { en: '<p>We deliver exceptional workforce solutions backed by years of experience and expertise.</p>', ar: '<p>نقدم حلول القوى العاملة الاستثنائية المدعومة بسنوات من الخبرة والتخصص.</p>' }, contentType: 'html' },
    
    // Certifications Section
    { section: 'certifications', contentKey: 'title', content: { en: 'Certifications & Awards', ar: 'الشهادات والجوائز' }, contentType: 'text' },
    { section: 'certifications', contentKey: 'description', content: { en: '<p>We are proud to hold various industry certifications and awards.</p>', ar: '<p>نحن فخورون بحصولنا على شهادات وجوائز صناعية متنوعة.</p>' }, contentType: 'html' }
  ],
  
  contact: [
    // Header Section
    { section: 'header', contentKey: 'title', content: { en: 'Contact Us', ar: 'اتصل بنا' }, contentType: 'text' },
    { section: 'header', contentKey: 'description', content: { en: '<p>Get in touch with us for all your workforce needs.</p>', ar: '<p>تواصل معنا لجميع احتياجات القوى العاملة الخاصة بك.</p>' }, contentType: 'html' },
    
    // Head Office Section
    { section: 'head_office', contentKey: 'name', content: { en: 'Head Office', ar: 'المكتب الرئيسي' }, contentType: 'text' },
    { section: 'head_office', contentKey: 'address', content: { en: 'Riyadh, Saudi Arabia', ar: 'الرياض، المملكة العربية السعودية' }, contentType: 'text' },
    { section: 'head_office', contentKey: 'phone', content: { en: '+966 11 XXX XXXX', ar: '+966 11 XXX XXXX' }, contentType: 'text' },
    { section: 'head_office', contentKey: 'fax', content: { en: '+966 11 XXX XXXX', ar: '+966 11 XXX XXXX' }, contentType: 'text' },
    { section: 'head_office', contentKey: 'email_general', content: { en: 'info@company.com', ar: 'info@company.com' }, contentType: 'email' },
    { section: 'head_office', contentKey: 'email_hr', content: { en: 'hr@company.com', ar: 'hr@company.com' }, contentType: 'email' },
    { section: 'head_office', contentKey: 'working_hours', content: { en: '<p>Sunday - Thursday: 8:00 AM - 5:00 PM</p>', ar: '<p>الأحد - الخميس: 8:00 صباحًا - 5:00 مساءً</p>' }, contentType: 'html' },
    
    // Regional Offices Section
    { section: 'regional_offices', contentKey: 'title', content: { en: 'Our Regional Offices', ar: 'مكاتبنا الإقليمية' }, contentType: 'text' },
    
    // Contact Form Section
    { section: 'contact_form', contentKey: 'title', content: { en: 'Send Us a Message', ar: 'أرسل لنا رسالة' }, contentType: 'text' },
    { section: 'contact_form', contentKey: 'description', content: { en: '<p>Fill out the form below and we\'ll get back to you soon.</p>', ar: '<p>املأ النموذج أدناه وسنعود إليك قريبًا.</p>' }, contentType: 'html' },
    { section: 'contact_form', contentKey: 'success_message', content: { en: 'Thank you for contacting us! We\'ll get back to you soon.', ar: 'شكرًا لك على الاتصال بنا! سنعود إليك قريبًا.' }, contentType: 'text' },
    { section: 'contact_form', contentKey: 'error_message', content: { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' }, contentType: 'text' },
    
    // Social Media Section
    { section: 'social', contentKey: 'linkedin', content: { en: 'https://linkedin.com/company/example', ar: 'https://linkedin.com/company/example' }, contentType: 'url' },
    { section: 'social', contentKey: 'twitter', content: { en: 'https://twitter.com/example', ar: 'https://twitter.com/example' }, contentType: 'url' },
    { section: 'social', contentKey: 'facebook', content: { en: 'https://facebook.com/example', ar: 'https://facebook.com/example' }, contentType: 'url' },
    { section: 'social', contentKey: 'instagram', content: { en: 'https://instagram.com/example', ar: 'https://instagram.com/example' }, contentType: 'url' }
  ],
  
  career: [
    // Header Section
    { section: 'header', contentKey: 'title', content: { en: 'Join Our Team', ar: 'انضم إلى فريقنا' }, contentType: 'text' },
    { section: 'header', contentKey: 'description', content: { en: '<p>Build your career with a leading manpower solutions provider.</p>', ar: '<p>ابنِ مسيرتك المهنية مع مزود حلول القوى العاملة الرائد.</p>' }, contentType: 'html' },
    
    // Why Work Section
    { section: 'why_work', contentKey: 'title', content: { en: 'Why Work With Us', ar: 'لماذا تعمل معنا' }, contentType: 'text' },
    { section: 'why_work', contentKey: 'description', content: { en: '<p>We offer a dynamic work environment with excellent growth opportunities.</p>', ar: '<p>نوفر بيئة عمل ديناميكية مع فرص نمو ممتازة.</p>' }, contentType: 'html' },
    
    // Benefits Section
    { section: 'benefits', contentKey: 'title', content: { en: 'Employee Benefits', ar: 'مزايا الموظفين' }, contentType: 'text' },
    { section: 'benefits', contentKey: 'competitive_salary', content: { en: 'Competitive salary packages aligned with market standards', ar: 'حزم رواتب تنافسية متوافقة مع معايير السوق' }, contentType: 'text' },
    { section: 'benefits', contentKey: 'health_insurance', content: { en: 'Comprehensive health insurance coverage', ar: 'تغطية تأمين صحي شاملة' }, contentType: 'text' },
    { section: 'benefits', contentKey: 'career_development', content: { en: 'Career development and advancement opportunities', ar: 'فرص التطوير والتقدم الوظيفي' }, contentType: 'text' },
    { section: 'benefits', contentKey: 'work_life_balance', content: { en: 'Work-life balance initiatives', ar: 'مبادرات التوازن بين العمل والحياة' }, contentType: 'text' },
    { section: 'benefits', contentKey: 'training', content: { en: 'Professional training and development programs', ar: 'برامج التدريب والتطوير المهني' }, contentType: 'text' },
    { section: 'benefits', contentKey: 'other', content: { en: 'Additional benefits and perks', ar: 'مزايا وامتيازات إضافية' }, contentType: 'text' },
    
    // Opportunities Section
    { section: 'opportunities', contentKey: 'title', content: { en: 'Current Openings', ar: 'الوظائف الحالية' }, contentType: 'text' },
    { section: 'opportunities', contentKey: 'description', content: { en: '<p>Explore our current job openings and find your next opportunity.</p>', ar: '<p>استكشف الوظائف الحالية المتاحة وابحث عن فرصتك القادمة.</p>' }, contentType: 'html' },
    { section: 'opportunities', contentKey: 'show_categories', content: { en: 'true', ar: 'true' }, contentType: 'text' },
    { section: 'opportunities', contentKey: 'featured_count', content: { en: '6', ar: '6' }, contentType: 'number' },
    
    // Process Section
    { section: 'process', contentKey: 'title', content: { en: 'How to Apply', ar: 'كيفية التقديم' }, contentType: 'text' },
    { section: 'process', contentKey: 'introduction', content: { en: '<p>Our application process is simple and straightforward.</p>', ar: '<p>عملية التقديم لدينا بسيطة ومباشرة.</p>' }, contentType: 'html' },
    { section: 'process', contentKey: 'step1_title', content: { en: 'Search & Browse', ar: 'البحث والاستعراض' }, contentType: 'text' },
    { section: 'process', contentKey: 'step1_description', content: { en: 'Browse our current job openings and find positions that match your skills.', ar: 'تصفح الوظائف الحالية المتاحة وابحث عن المناصب التي تتناسب مع مهاراتك.' }, contentType: 'text' },
    { section: 'process', contentKey: 'step2_title', content: { en: 'Submit Application', ar: 'تقديم الطلب' }, contentType: 'text' },
    { section: 'process', contentKey: 'step2_description', content: { en: 'Fill out the application form and upload your CV.', ar: 'املأ نموذج الطلب وقم بتحميل سيرتك الذاتية.' }, contentType: 'text' },
    { section: 'process', contentKey: 'step3_title', content: { en: 'Initial Review', ar: 'المراجعة الأولية' }, contentType: 'text' },
    { section: 'process', contentKey: 'step3_description', content: { en: 'Our HR team will review your application.', ar: 'سيقوم فريق الموارد البشرية لدينا بمراجعة طلبك.' }, contentType: 'text' },
    { section: 'process', contentKey: 'step4_title', content: { en: 'Interview', ar: 'المقابلة' }, contentType: 'text' },
    { section: 'process', contentKey: 'step4_description', content: { en: 'Qualified candidates will be invited for interviews.', ar: 'سيتم دعوة المرشحين المؤهلين للمقابلات.' }, contentType: 'text' },
    { section: 'process', contentKey: 'step5_title', content: { en: 'Job Offer', ar: 'عرض العمل' }, contentType: 'text' },
    { section: 'process', contentKey: 'step5_description', content: { en: 'Successful candidates will receive a job offer.', ar: 'سيحصل المرشحون الناجحون على عرض عمل.' }, contentType: 'text' },
    
    // CTA Section
    { section: 'cta', contentKey: 'text', content: { en: 'Ready to Start Your Career?', ar: 'هل أنت مستعد لبدء مسيرتك المهنية؟' }, contentType: 'text' },
    { section: 'cta', contentKey: 'button_text', content: { en: 'View All Jobs', ar: 'عرض جميع الوظائف' }, contentType: 'text' }
  ],
  
  clients: [
    // Header Section
    { section: 'header', contentKey: 'title', content: { en: 'Our Clients', ar: 'عملاؤنا' }, contentType: 'text' },
    { section: 'header', contentKey: 'description', content: { en: '<p>We are proud to serve leading organizations across various industries.</p>', ar: '<p>نحن فخورون بخدمة المنظمات الرائدة في مختلف الصناعات.</p>' }, contentType: 'html' },
    
    // Display Settings Section
    { section: 'display', contentKey: 'per_row', content: { en: '6', ar: '6' }, contentType: 'number' },
    { section: 'display', contentKey: 'format', content: { en: 'logo_grid', ar: 'logo_grid' }, contentType: 'text' },
    { section: 'display', contentKey: 'logo_size', content: { en: 'medium', ar: 'medium' }, contentType: 'text' },
    { section: 'display', contentKey: 'show_featured', content: { en: 'true', ar: 'true' }, contentType: 'text' },
    { section: 'display', contentKey: 'show_all', content: { en: 'true', ar: 'true' }, contentType: 'text' },
    
    // Featured Section
    { section: 'featured', contentKey: 'title', content: { en: 'Our Featured Clients', ar: 'عملاؤنا المميزون' }, contentType: 'text' },
    { section: 'featured', contentKey: 'description', content: { en: '<p>Building partnerships with industry leaders.</p>', ar: '<p>بناء شراكات مع قادة الصناعة.</p>' }, contentType: 'html' },
    
    // All Clients Section
    { section: 'all_clients', contentKey: 'title', content: { en: 'All Our Clients', ar: 'جميع عملائنا' }, contentType: 'text' },
    { section: 'all_clients', contentKey: 'description', content: { en: '<p>Trusted by hundreds of organizations.</p>', ar: '<p>موثوق بها من قبل مئات المنظمات.</p>' }, contentType: 'html' },
    { section: 'all_clients', contentKey: 'show_categories', content: { en: 'true', ar: 'true' }, contentType: 'text' },
    
    // Categories Section
    { section: 'categories', contentKey: 'title', content: { en: 'Clients by Industry', ar: 'العملاء حسب الصناعة' }, contentType: 'text' },
    
    // Testimonials Section
    { section: 'testimonials', contentKey: 'enabled', content: { en: 'true', ar: 'true' }, contentType: 'text' },
    { section: 'testimonials', contentKey: 'title', content: { en: 'What Our Clients Say', ar: 'ماذا يقول عملاؤنا' }, contentType: 'text' },
    { section: 'testimonials', contentKey: 'format', content: { en: 'slider', ar: 'slider' }, contentType: 'text' },
    { section: 'testimonials', contentKey: 'count', content: { en: '6', ar: '6' }, contentType: 'number' },
    
    // Statistics Section
    { section: 'statistics', contentKey: 'enabled', content: { en: 'true', ar: 'true' }, contentType: 'text' },
    { section: 'statistics', contentKey: 'title', content: { en: 'By The Numbers', ar: 'بالأرقام' }, contentType: 'text' },
    { section: 'statistics', contentKey: 'total_label', content: { en: 'Total Clients', ar: 'إجمالي العملاء' }, contentType: 'text' },
    { section: 'statistics', contentKey: 'active_label', content: { en: 'Active Partnerships', ar: 'الشراكات النشطة' }, contentType: 'text' },
    
    // CTA Section
    { section: 'cta', contentKey: 'title', content: { en: 'Become Our Client', ar: 'كن عميلنا' }, contentType: 'text' },
    { section: 'cta', contentKey: 'description', content: { en: 'Join our growing list of satisfied clients.', ar: 'انضم إلى قائمتنا المتنامية من العملاء الراضين.' }, contentType: 'text' },
    { section: 'cta', contentKey: 'button_text', content: { en: 'Contact Us', ar: 'اتصل بنا' }, contentType: 'text' },
    { section: 'cta', contentKey: 'button_link', content: { en: '/contact', ar: '/contact' }, contentType: 'text' }
  ]
};

// Page metadata
const pageMetadata = [
  {
    page: 'home',
    seo: {
      title: { en: 'Leading Manpower Solutions Provider in Middle East', ar: 'مزود حلول القوى العاملة الرائد في الشرق الأوسط' },
      description: { en: 'Professional manpower and workforce solutions across the Middle East. 25+ years experience.', ar: 'حلول القوى العاملة المهنية في جميع أنحاء الشرق الأوسط. أكثر من 25 عامًا من الخبرة.' },
      keywords: { en: ['manpower', 'workforce', 'recruitment', 'staffing', 'middle east'], ar: ['القوى العاملة', 'التوظيف', 'الشرق الأوسط'] }
    },
    isPublished: true,
    sections: [
      { sectionId: 'hero', name: { en: 'Hero Section', ar: 'قسم البطل' }, isActive: true, displayOrder: 0 },
      { sectionId: 'statistics', name: { en: 'Statistics', ar: 'الإحصائيات' }, isActive: true, displayOrder: 1 },
      { sectionId: 'services_preview', name: { en: 'Services Preview', ar: 'معاينة الخدمات' }, isActive: true, displayOrder: 2 },
      { sectionId: 'testimonials', name: { en: 'Testimonials', ar: 'الشهادات' }, isActive: true, displayOrder: 3 },
      { sectionId: 'cta', name: { en: 'Call to Action', ar: 'دعوة للعمل' }, isActive: true, displayOrder: 4 }
    ]
  },
  {
    page: 'about',
    seo: {
      title: { en: 'About Us - Company Profile and History', ar: 'معلومات عنا - ملف الشركة والتاريخ' },
      description: { en: 'Learn about our 25+ years of experience in providing manpower solutions.', ar: 'تعرف على خبرتنا التي تزيد عن 25 عامًا في تقديم حلول القوى العاملة.' },
      keywords: { en: ['about us', 'company history', 'mission', 'vision'], ar: ['معلومات عنا', 'تاريخ الشركة', 'الرؤية', 'المهمة'] }
    },
    isPublished: true
  },
  {
    page: 'contact',
    seo: {
      title: { en: 'Contact Us - Get in Touch', ar: 'اتصل بنا - تواصل معنا' },
      description: { en: 'Contact us for all your manpower and workforce needs.', ar: 'اتصل بنا لجميع احتياجات القوى العاملة الخاصة بك.' },
      keywords: { en: ['contact', 'get in touch', 'offices'], ar: ['اتصال', 'تواصل', 'مكاتب'] }
    },
    isPublished: true
  },
  {
    page: 'career',
    seo: {
      title: { en: 'Careers - Join Our Team', ar: 'الوظائف - انضم إلى فريقنا' },
      description: { en: 'Explore career opportunities and join our growing team.', ar: 'استكشف فرص العمل وانضم إلى فريقنا المتنامي.' },
      keywords: { en: ['careers', 'jobs', 'employment', 'opportunities'], ar: ['وظائف', 'فرص عمل', 'توظيف'] }
    },
    isPublished: true
  },
  {
    page: 'clients',
    seo: {
      title: { en: 'Our Clients - Trusted Partnerships', ar: 'عملاؤنا - شراكات موثوقة' },
      description: { en: 'We serve leading organizations across various industries in the Middle East.', ar: 'نخدم المنظمات الرائدة في مختلف الصناعات في الشرق الأوسط.' },
      keywords: { en: ['clients', 'partners', 'customers'], ar: ['عملاء', 'شركاء', 'زبائن'] }
    },
    isPublished: true
  }
];

// Seed function
const seedWebsiteContent = async () => {
  try {
    console.log('🌱 Starting website content seeding...\n');
    
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing content...');
    await WebsiteContent.deleteMany({});
    await PageContent.deleteMany({});
    console.log('✓ Existing content cleared\n');
    
    // Seed content for each page
    for (const [pageName, pageContent] of Object.entries(defaultContent)) {
      console.log(`📄 Seeding ${pageName} page content...`);
      
      for (const contentItem of pageContent) {
        await WebsiteContent.create({
          page: pageName,
          ...contentItem,
          isDraft: false,
          lastPublished: new Date()
        });
      }
      
      console.log(`✓ ${pageName} page content seeded (${pageContent.length} items)\n`);
    }
    
    // Seed page metadata
    console.log('📝 Seeding page metadata...');
    for (const pageMeta of pageMetadata) {
      await PageContent.create({
        ...pageMeta,
        lastPublished: new Date()
      });
    }
    console.log(`✓ Page metadata seeded (${pageMetadata.length} pages)\n`);
    
    // Summary
    const totalContent = await WebsiteContent.countDocuments();
    const totalPages = await PageContent.countDocuments();
    
    console.log('✅ Website content seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Total content items: ${totalContent}`);
    console.log(`   - Total pages: ${totalPages}`);
    console.log(`\n✨ Your website content management system is ready to use!\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding website content:', error);
    process.exit(1);
  }
};

// Run seed
if (require.main === module) {
  seedWebsiteContent();
}

module.exports = seedWebsiteContent;
