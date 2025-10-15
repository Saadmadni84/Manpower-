const mongoose = require('mongoose');
const JobOpening = require('../models/JobOpening');
require('dotenv').config();

// Default Job Positions as specified in requirements
const defaultJobs = [
  {
    title: {
      en: 'Airport Ground Handler',
      ar: 'موظف خدمات أرضية بالمطار'
    },
    department: 'airport_operations',
    category: 'skilled_worker',
    jobType: 'full_time',
    workSchedule: 'rotating_shift',
    locations: [
      { city: 'Jeddah', region: 'Western Province', isRemote: false, isPrimary: true }
    ],
    summary: {
      en: 'Join our airport operations team as a Ground Handler responsible for aircraft servicing and passenger assistance.',
      ar: 'انضم إلى فريق عمليات المطار لدينا كموظف خدمات أرضية مسؤول عن خدمة الطائرات ومساعدة الركاب.'
    },
    description: {
      en: 'We are seeking dedicated Airport Ground Handlers to join our growing team in Jeddah. The successful candidate will be responsible for ensuring safe and efficient ground operations including baggage handling, aircraft marshalling, and passenger assistance.',
      ar: 'نحن نبحث عن موظفي خدمات أرضية متفانين للانضمام إلى فريقنا المتنامي في جدة. سيكون المرشح الناجح مسؤولاً عن ضمان عمليات أرضية آمنة وفعالة بما في ذلك التعامل مع الأمتعة وتوجيه الطائرات ومساعدة الركاب.'
    },
    responsibilities: {
      en: [
        'Load and unload baggage and cargo from aircraft',
        'Marshal aircraft to and from gates',
        'Assist passengers with boarding and deplaning',
        'Operate ground support equipment safely',
        'Maintain cleanliness and safety of work areas',
        'Communicate effectively with crew and passengers'
      ],
      ar: []
    },
    requirements: {
      en: [
        'High school diploma or equivalent',
        'Valid driver\'s license',
        'Ability to lift up to 70 lbs',
        'Good communication skills in English and Arabic',
        'Flexibility to work rotating shifts including nights and weekends',
        'Previous airport or aviation experience preferred'
      ],
      ar: []
    },
    skills: {
      required: ['Physical fitness', 'Customer service', 'Team work', 'Safety awareness'],
      preferred: ['GSE operation', 'Aviation knowledge', 'Multi-lingual']
    },
    experienceLevel: 'entry',
    minExperience: 0,
    maxExperience: 3,
    educationLevel: 'high_school',
    salary: {
      min: 4000,
      max: 6000,
      currency: 'SAR',
      type: 'monthly',
      negotiable: false
    },
    benefits: ['Health insurance', 'Transportation', 'Uniform', 'Meal allowance'],
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    numberOfPositions: 10,
    urgentHiring: true,
    applicationMethod: 'online_form',
    status: 'active',
    visibility: 'public',
    featuredJob: true
  },
  {
    title: {
      en: 'Administrative Assistant',
      ar: 'مساعد إداري'
    },
    department: 'corporate_services',
    category: 'general_worker',
    jobType: 'full_time',
    workSchedule: 'day_shift',
    locations: [
      { city: 'Riyadh', region: 'Central Province', isRemote: false, isPrimary: true }
    ],
    summary: {
      en: 'Support our corporate operations team with administrative tasks and office management.',
      ar: 'ادعم فريق عمليات الشركة لدينا بالمهام الإدارية وإدارة المكتب.'
    },
    description: {
      en: 'We are looking for a proactive Administrative Assistant to join our corporate services team in Riyadh. You will provide comprehensive administrative support to ensure efficient operation of the office.',
      ar: 'نحن نبحث عن مساعد إداري استباقي للانضمام إلى فريق الخدمات المؤسسية لدينا في الرياض. ستقدم دعمًا إداريًا شاملاً لضمان التشغيل الفعال للمكتب.'
    },
    responsibilities: {
      en: [
        'Manage daily office operations and procedures',
        'Handle correspondence, emails, and phone calls',
        'Schedule meetings and maintain calendars',
        'Prepare reports and presentations',
        'Maintain filing systems and databases',
        'Coordinate with other departments'
      ],
      ar: []
    },
    requirements: {
      en: [
        'Bachelor\'s degree in Business Administration or related field',
        'Minimum 2 years of administrative experience',
        'Proficiency in Microsoft Office Suite',
        'Excellent organizational and time management skills',
        'Strong written and verbal communication skills',
        'Bilingual in English and Arabic'
      ],
      ar: []
    },
    skills: {
      required: ['MS Office', 'Communication', 'Organization', 'Time management'],
      preferred: ['SAP', 'Project management', 'Data analysis']
    },
    experienceLevel: 'junior',
    minExperience: 2,
    maxExperience: 5,
    educationLevel: 'bachelor',
    salary: {
      min: 6000,
      max: 9000,
      currency: 'SAR',
      type: 'monthly',
      negotiable: true
    },
    benefits: ['Health insurance', 'Annual leave', 'Professional development'],
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    numberOfPositions: 2,
    urgentHiring: false,
    applicationMethod: 'online_form',
    status: 'active',
    visibility: 'public',
    featuredJob: false
  },
  {
    title: {
      en: 'Food Service Supervisor',
      ar: 'مشرف خدمات الطعام'
    },
    department: 'catering',
    category: 'supervisor',
    jobType: 'full_time',
    workSchedule: 'day_shift',
    locations: [
      { city: 'Mecca', region: 'Western Province', isRemote: false, isPrimary: true }
    ],
    summary: {
      en: 'Lead our catering team in delivering exceptional food service to our clients.',
      ar: 'قيادة فريق تقديم الطعام لدينا في تقديم خدمة طعام استثنائية لعملائنا.'
    },
    description: {
      en: 'We are seeking an experienced Food Service Supervisor to oversee our catering operations in Mecca. You will manage staff, ensure quality standards, and maintain excellent customer service.',
      ar: 'نحن نبحث عن مشرف خدمات طعام ذو خبرة للإشراف على عمليات تقديم الطعام لدينا في مكة. ستدير الموظفين وتضمن معايير الجودة وتحافظ على خدمة عملاء ممتازة.'
    },
    responsibilities: {
      en: [
        'Supervise daily catering operations',
        'Train and manage kitchen and service staff',
        'Ensure food safety and hygiene standards',
        'Monitor inventory and order supplies',
        'Handle customer feedback and complaints',
        'Prepare work schedules and manage labor costs'
      ],
      ar: []
    },
    requirements: {
      en: [
        'Diploma in Hospitality or Culinary Arts',
        'Minimum 3 years experience in food service supervision',
        'Valid food handler\'s certificate',
        'Knowledge of HACCP and food safety regulations',
        'Strong leadership and team management skills',
        'Ability to work under pressure'
      ],
      ar: []
    },
    skills: {
      required: ['Leadership', 'Food safety', 'Team management', 'Customer service'],
      preferred: ['Menu planning', 'Cost control', 'Training & development']
    },
    experienceLevel: 'mid',
    minExperience: 3,
    maxExperience: 7,
    educationLevel: 'diploma',
    salary: {
      min: 8000,
      max: 12000,
      currency: 'SAR',
      type: 'monthly',
      negotiable: true
    },
    benefits: ['Health insurance', 'Transportation', 'Housing allowance', 'Annual bonus'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    numberOfPositions: 1,
    urgentHiring: true,
    applicationMethod: 'online_form',
    status: 'active',
    visibility: 'public',
    featuredJob: true
  },
  {
    title: {
      en: 'Warehouse Operator',
      ar: 'مشغل مستودع'
    },
    department: 'logistics',
    category: 'skilled_worker',
    jobType: 'full_time',
    workSchedule: 'day_shift',
    locations: [
      { city: 'Dammam', region: 'Eastern Province', isRemote: false, isPrimary: true }
    ],
    summary: {
      en: 'Manage warehouse operations including receiving, storing, and distributing goods.',
      ar: 'إدارة عمليات المستودع بما في ذلك استلام وتخزين وتوزيع البضائع.'
    },
    description: {
      en: 'Join our logistics team in Dammam as a Warehouse Operator. You will be responsible for efficient warehouse operations, inventory management, and ensuring timely delivery of goods.',
      ar: 'انضم إلى فريق الخدمات اللوجستية لدينا في الدمام كمشغل مستودع. ستكون مسؤولاً عن عمليات المستودع الفعالة وإدارة المخزون وضمان التسليم في الوقت المناسب للبضائع.'
    },
    responsibilities: {
      en: [
        'Receive and process warehouse stock',
        'Operate forklifts and warehouse equipment',
        'Pick and pack orders accurately',
        'Maintain inventory records',
        'Ensure warehouse cleanliness and organization',
        'Follow safety procedures and protocols'
      ],
      ar: []
    },
    requirements: {
      en: [
        'High school diploma',
        'Forklift operator certification required',
        'Minimum 1 year warehouse experience',
        'Basic computer skills',
        'Physical ability to lift heavy objects',
        'Attention to detail and accuracy'
      ],
      ar: []
    },
    skills: {
      required: ['Forklift operation', 'Inventory management', 'Safety compliance', 'Physical stamina'],
      preferred: ['WMS experience', 'Logistics knowledge', 'RF scanner operation']
    },
    experienceLevel: 'entry',
    minExperience: 1,
    maxExperience: 3,
    educationLevel: 'high_school',
    salary: {
      min: 5000,
      max: 7000,
      currency: 'SAR',
      type: 'monthly',
      negotiable: false
    },
    benefits: ['Health insurance', 'Transportation', 'Overtime pay'],
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    numberOfPositions: 5,
    urgentHiring: false,
    applicationMethod: 'online_form',
    status: 'active',
    visibility: 'public',
    featuredJob: false
  },
  {
    title: {
      en: 'Construction Foreman',
      ar: 'رئيس عمال البناء'
    },
    department: 'construction',
    category: 'supervisor',
    jobType: 'full_time',
    workSchedule: 'day_shift',
    locations: [
      { city: 'Riyadh', region: 'Central Province', isRemote: false, isPrimary: true },
      { city: 'Jeddah', region: 'Western Province', isRemote: false, isPrimary: false }
    ],
    summary: {
      en: 'Supervise construction projects and lead teams of workers to ensure timely completion.',
      ar: 'الإشراف على مشاريع البناء وقيادة فرق العمال لضمان الإنجاز في الوقت المحدد.'
    },
    description: {
      en: 'We are seeking experienced Construction Foremen for multiple locations. You will oversee daily construction activities, manage workers, and ensure projects are completed safely and on schedule.',
      ar: 'نحن نبحث عن رؤساء عمال بناء ذوي خبرة لمواقع متعددة. ستشرف على أنشطة البناء اليومية وتدير العمال وتضمن إنجاز المشاريع بأمان وفي الموعد المحدد.'
    },
    responsibilities: {
      en: [
        'Supervise construction workers and subcontractors',
        'Coordinate daily work activities',
        'Ensure compliance with safety regulations',
        'Review project plans and specifications',
        'Monitor progress and report to project managers',
        'Manage materials and equipment on site'
      ],
      ar: []
    },
    requirements: {
      en: [
        'Diploma in Construction Management or related field',
        'Minimum 5 years construction experience',
        'At least 2 years supervisory experience',
        'Knowledge of construction methods and materials',
        'Valid driver\'s license',
        'Strong leadership and communication skills'
      ],
      ar: []
    },
    skills: {
      required: ['Construction supervision', 'Safety management', 'Team leadership', 'Blueprint reading'],
      preferred: ['Project management software', 'Quality control', 'Cost estimation']
    },
    experienceLevel: 'mid',
    minExperience: 5,
    maxExperience: 10,
    educationLevel: 'diploma',
    salary: {
      min: 10000,
      max: 15000,
      currency: 'SAR',
      type: 'monthly',
      negotiable: true
    },
    benefits: ['Health insurance', 'Transportation', 'Housing', 'Annual bonus', 'Equipment allowance'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    numberOfPositions: 3,
    urgentHiring: true,
    applicationMethod: 'online_form',
    status: 'active',
    visibility: 'public',
    featuredJob: true
  },
  {
    title: {
      en: 'Facility Maintenance Technician',
      ar: 'فني صيانة المرافق'
    },
    department: 'facility_management',
    category: 'skilled_worker',
    jobType: 'full_time',
    workSchedule: 'rotating_shift',
    locations: [
      { city: 'Medina', region: 'Western Province', isRemote: false, isPrimary: true }
    ],
    summary: {
      en: 'Maintain and repair facility systems including HVAC, plumbing, and electrical.',
      ar: 'صيانة وإصلاح أنظمة المرافق بما في ذلك التكييف والسباكة والكهرباء.'
    },
    description: {
      en: 'We need a skilled Facility Maintenance Technician to join our team in Medina. You will be responsible for maintaining building systems and equipment to ensure optimal facility operation.',
      ar: 'نحتاج إلى فني صيانة مرافق ماهر للانضمام إلى فريقنا في المدينة المنورة. ستكون مسؤولاً عن صيانة أنظمة ومعدات المباني لضمان التشغيل الأمثل للمنشأة.'
    },
    responsibilities: {
      en: [
        'Perform preventive maintenance on building systems',
        'Troubleshoot and repair HVAC, plumbing, and electrical issues',
        'Respond to maintenance requests promptly',
        'Maintain maintenance logs and records',
        'Ensure compliance with safety standards',
        'Coordinate with external contractors when needed'
      ],
      ar: []
    },
    requirements: {
      en: [
        'Technical diploma in Electrical, Mechanical, or related field',
        'Minimum 3 years facility maintenance experience',
        'Valid electrician or HVAC certification',
        'Knowledge of building systems and equipment',
        'Ability to read technical drawings',
        'Flexibility to work on-call and weekends'
      ],
      ar: []
    },
    skills: {
      required: ['HVAC systems', 'Electrical troubleshooting', 'Plumbing', 'Preventive maintenance'],
      preferred: ['BMS systems', 'Welding', 'Carpentry', 'Painting']
    },
    experienceLevel: 'mid',
    minExperience: 3,
    maxExperience: 7,
    educationLevel: 'diploma',
    salary: {
      min: 7000,
      max: 10000,
      currency: 'SAR',
      type: 'monthly',
      negotiable: true
    },
    benefits: ['Health insurance', 'Transportation', 'Tools allowance', 'Training programs'],
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    numberOfPositions: 2,
    urgentHiring: false,
    applicationMethod: 'online_form',
    status: 'active',
    visibility: 'public',
    featuredJob: false
  },
  {
    title: {
      en: 'Customer Service Representative',
      ar: 'ممثل خدمة العملاء'
    },
    department: 'corporate_services',
    category: 'general_worker',
    jobType: 'full_time',
    workSchedule: 'flexible',
    locations: [
      { city: 'Riyadh', region: 'Central Province', isRemote: true, isPrimary: true }
    ],
    summary: {
      en: 'Provide excellent customer service and support to our clients through various channels.',
      ar: 'تقديم خدمة ودعم ممتاز للعملاء لعملائنا من خلال قنوات مختلفة.'
    },
    description: {
      en: 'We are hiring Customer Service Representatives to join our growing team. This is a remote position that offers flexibility. You will handle customer inquiries, resolve issues, and ensure customer satisfaction.',
      ar: 'نحن نوظف ممثلي خدمة العملاء للانضمام إلى فريقنا المتنامي. هذا منصب عن بعد يوفر المرونة. ستتعامل مع استفسارات العملاء وحل المشكلات وضمان رضا العملاء.'
    },
    responsibilities: {
      en: [
        'Answer customer inquiries via phone, email, and chat',
        'Resolve customer complaints professionally',
        'Process orders and requests accurately',
        'Maintain customer records in CRM system',
        'Escalate complex issues to appropriate departments',
        'Provide product and service information'
      ],
      ar: []
    },
    requirements: {
      en: [
        'Bachelor\'s degree or equivalent',
        'Minimum 1 year customer service experience',
        'Excellent communication skills in English and Arabic',
        'Proficiency in computer applications',
        'Problem-solving abilities',
        'Patience and empathy with customers'
      ],
      ar: []
    },
    skills: {
      required: ['Communication', 'Customer service', 'Problem solving', 'Computer literacy'],
      preferred: ['CRM software', 'Multi-lingual', 'Sales skills']
    },
    experienceLevel: 'entry',
    minExperience: 1,
    maxExperience: 3,
    educationLevel: 'bachelor',
    salary: {
      min: 5000,
      max: 8000,
      currency: 'SAR',
      type: 'monthly',
      negotiable: true
    },
    benefits: ['Health insurance', 'Remote work', 'Flexible hours', 'Performance bonuses'],
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    numberOfPositions: 8,
    urgentHiring: true,
    applicationMethod: 'online_form',
    status: 'active',
    visibility: 'public',
    featuredJob: false
  },
  {
    title: {
      en: 'Security Supervisor',
      ar: 'مشرف أمن'
    },
    department: 'facility_management',
    category: 'supervisor',
    jobType: 'full_time',
    workSchedule: 'rotating_shift',
    locations: [
      { city: 'Riyadh', region: 'Central Province', isRemote: false, isPrimary: true }
    ],
    summary: {
      en: 'Oversee security operations and manage security personnel to ensure facility safety.',
      ar: 'الإشراف على العمليات الأمنية وإدارة الموظفين الأمنيين لضمان سلامة المنشأة.'
    },
    description: {
      en: 'We are looking for an experienced Security Supervisor to lead our security team in Riyadh. You will be responsible for ensuring the safety and security of our facilities, staff, and visitors.',
      ar: 'نحن نبحث عن مشرف أمن ذو خبرة لقيادة فريق الأمن لدينا في الرياض. ستكون مسؤولاً عن ضمان سلامة وأمن منشآتنا وموظفينا وزوارنا.'
    },
    responsibilities: {
      en: [
        'Supervise security personnel and operations',
        'Conduct regular security patrols and inspections',
        'Monitor CCTV and access control systems',
        'Investigate security incidents and prepare reports',
        'Train security staff on procedures and protocols',
        'Coordinate with law enforcement when necessary'
      ],
      ar: []
    },
    requirements: {
      en: [
        'High school diploma; security training certification',
        'Minimum 5 years security experience',
        'At least 2 years in supervisory role',
        'Knowledge of security systems and procedures',
        'Valid security guard license',
        'Strong leadership and decision-making skills'
      ],
      ar: []
    },
    skills: {
      required: ['Security operations', 'Leadership', 'Risk assessment', 'Emergency response'],
      preferred: ['CCTV systems', 'First aid', 'Fire safety', 'Conflict resolution']
    },
    experienceLevel: 'mid',
    minExperience: 5,
    maxExperience: 10,
    educationLevel: 'high_school',
    salary: {
      min: 8000,
      max: 11000,
      currency: 'SAR',
      type: 'monthly',
      negotiable: true
    },
    benefits: ['Health insurance', 'Transportation', 'Uniform', 'Night shift allowance'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    numberOfPositions: 1,
    urgentHiring: true,
    applicationMethod: 'online_form',
    status: 'active',
    visibility: 'public',
    featuredJob: false
  }
];

// Connect to database and seed jobs
const seedJobs = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/manpower-company';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing jobs (optional - comment out if you want to keep existing)
    // await JobOpening.deleteMany({});
    // console.log('Cleared existing jobs');

    // Insert default jobs (one by one to trigger pre-save hooks)
    const createdJobs = [];
    for (const jobData of defaultJobs) {
      const job = new JobOpening(jobData);
      await job.save();
      createdJobs.push(job);
    }
    
    console.log(`✅ Successfully seeded ${createdJobs.length} job positions:`);
    
    createdJobs.forEach(job => {
      console.log(`  - ${job.title.en} (${job.jobCode}) - ${job.department}`);
    });

    console.log('\nJob seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
};

// Run the seed function
seedJobs();
