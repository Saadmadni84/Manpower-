// Comprehensive client data for the manpower company

export const clientIndustries = {
  airport: {
    id: 'airport',
    title: "Airport Operations",
    icon: "🛫",
    description: "Ground handling, security, and operational support for major airports across Saudi Arabia",
    color: "#3b82f6",
    clients: [
      {
        name: "Saudi Arabian Airlines (Saudia)",
        logo: "/logos/saudia.png",
        location: "Jeddah",
        contractValue: "45M SAR",
        duration: "12 Years",
        teamSize: "800+ Staff",
        services: ["Ground Handling", "Security", "Baggage Handling"],
        testimonial: "Exceptional service quality and reliability for over a decade."
      },
      {
        name: "King Abdulaziz International Airport",
        logo: "/logos/kaia.png",
        location: "Jeddah",
        contractValue: "35M SAR",
        duration: "8 Years",
        teamSize: "600+ Staff",
        services: ["Terminal Operations", "Customer Service", "Maintenance"],
        testimonial: "Professional staff that maintains the highest standards of service."
      },
      {
        name: "Prince Mohammed bin Abdulaziz Airport",
        logo: "/logos/pmba.png",
        location: "Madina",
        contractValue: "20M SAR",
        duration: "6 Years",
        teamSize: "300+ Staff",
        services: ["Ground Operations", "Passenger Services", "Cargo Handling"],
        testimonial: "Reliable partnership that has grown with our expansion."
      },
      {
        name: "King Fahd International Airport",
        logo: "/logos/dammam.png",
        location: "Dammam",
        contractValue: "25M SAR",
        duration: "7 Years",
        teamSize: "400+ Staff",
        services: ["Airport Security", "Ground Handling", "Facility Management"],
        testimonial: "Consistent quality and excellent operational support."
      },
      {
        name: "King Khalid International Airport",
        logo: "/logos/riyadh.png",
        location: "Riyadh",
        contractValue: "30M SAR",
        duration: "10 Years",
        teamSize: "500+ Staff",
        services: ["Terminal Services", "Ground Operations", "Maintenance"],
        testimonial: "Long-term partnership built on trust and excellence."
      }
    ],
    stats: { 
      totalClients: 25, 
      totalEmployees: 3500, 
      activeContracts: 25,
      avgContractValue: "28M SAR",
      avgDuration: "8.5 Years"
    }
  },

  corporate: {
    id: 'corporate',
    title: "Corporate Offices",
    icon: "🏢",
    description: "Professional staffing solutions for major corporations and government entities",
    color: "#10b981",
    clients: [
      {
        name: "SABIC",
        logo: "/logos/sabic.png",
        location: "Riyadh",
        contractValue: "60M SAR",
        duration: "15 Years",
        teamSize: "1200+ Staff",
        services: ["Office Management", "Security", "Maintenance", "Catering"],
        testimonial: "Comprehensive staffing solutions that support our global operations."
      },
      {
        name: "Aramco Subsidiaries",
        logo: "/logos/aramco.png",
        location: "Dammam",
        contractValue: "80M SAR",
        duration: "18 Years",
        teamSize: "1500+ Staff",
        services: ["Facility Management", "Security", "Administrative Support"],
        testimonial: "Strategic partnership that has evolved with our business needs."
      },
      {
        name: "Saudi Telecom (STC)",
        logo: "/logos/stc.png",
        location: "Riyadh",
        contractValue: "40M SAR",
        duration: "12 Years",
        teamSize: "800+ Staff",
        services: ["Customer Service", "Technical Support", "Facility Management"],
        testimonial: "Quality manpower that enhances our customer experience."
      },
      {
        name: "Al Rajhi Bank",
        logo: "/logos/alrajhi.png",
        location: "Riyadh",
        contractValue: "35M SAR",
        duration: "10 Years",
        teamSize: "600+ Staff",
        services: ["Branch Operations", "Security", "Administrative Support"],
        testimonial: "Reliable staffing that supports our nationwide operations."
      },
      {
        name: "Saudi National Bank",
        logo: "/logos/snb.png",
        location: "Riyadh",
        contractValue: "30M SAR",
        duration: "8 Years",
        teamSize: "500+ Staff",
        services: ["Banking Operations", "Customer Service", "Security"],
        testimonial: "Professional staff that maintains our service excellence."
      }
    ],
    stats: { 
      totalClients: 60, 
      totalEmployees: 4200, 
      activeContracts: 35,
      avgContractValue: "42M SAR",
      avgDuration: "11 Years"
    }
  },

  catering: {
    id: 'catering',
    title: "Catering Services",
    icon: "🍽️",
    description: "Specialized catering and food service personnel for diverse environments",
    color: "#f59e0b",
    clients: [
      {
        name: "Saudi Catering Group",
        logo: "/logos/scg.png",
        location: "Jeddah",
        contractValue: "25M SAR",
        duration: "10 Years",
        teamSize: "400+ Staff",
        services: ["Event Catering", "Corporate Dining", "Hospital Catering"],
        testimonial: "Culinary excellence that meets the highest standards."
      },
      {
        name: "Tamimi Markets",
        logo: "/logos/tamimi.png",
        location: "Riyadh",
        contractValue: "20M SAR",
        duration: "8 Years",
        teamSize: "300+ Staff",
        services: ["Retail Food Service", "Corporate Catering", "Event Management"],
        testimonial: "Quality food service professionals for our retail operations."
      },
      {
        name: "Panda Retail",
        logo: "/logos/panda.png",
        location: "Riyadh",
        contractValue: "18M SAR",
        duration: "6 Years",
        teamSize: "250+ Staff",
        services: ["Food Court Operations", "Catering Services", "Quality Control"],
        testimonial: "Consistent quality and service across all our locations."
      },
      {
        name: "Healthcare Catering Services",
        logo: "/logos/healthcare.png",
        location: "Dammam",
        contractValue: "15M SAR",
        duration: "7 Years",
        teamSize: "200+ Staff",
        services: ["Hospital Catering", "Dietary Services", "Patient Meals"],
        testimonial: "Specialized staff that understands healthcare requirements."
      },
      {
        name: "Corporate Cafeteria Management",
        logo: "/logos/corporate.png",
        location: "Madina",
        contractValue: "12M SAR",
        duration: "5 Years",
        teamSize: "150+ Staff",
        services: ["Corporate Dining", "Cafeteria Operations", "Event Catering"],
        testimonial: "Efficient service that supports our corporate culture."
      }
    ],
    stats: { 
      totalClients: 35, 
      totalEmployees: 1800, 
      activeContracts: 20,
      avgContractValue: "18M SAR",
      avgDuration: "7.2 Years"
    }
  },

  construction: {
    id: 'construction',
    title: "Construction & Infrastructure",
    icon: "🏗️",
    description: "Skilled construction workers and project support personnel",
    color: "#ef4444",
    clients: [
      {
        name: "Saudi Binladin Group",
        logo: "/logos/binladin.png",
        location: "Riyadh",
        contractValue: "100M SAR",
        duration: "20 Years",
        teamSize: "2000+ Staff",
        services: ["Construction Workers", "Project Management", "Safety Personnel"],
        testimonial: "Skilled workforce that has been integral to our major projects."
      },
      {
        name: "El Seif Engineering",
        logo: "/logos/elseif.png",
        location: "Riyadh",
        contractValue: "75M SAR",
        duration: "15 Years",
        teamSize: "1500+ Staff",
        services: ["Civil Engineering Support", "Construction Labor", "Quality Control"],
        testimonial: "Professional team that maintains our project standards."
      },
      {
        name: "Saudi Oger",
        logo: "/logos/saudioger.png",
        location: "Jeddah",
        contractValue: "60M SAR",
        duration: "12 Years",
        teamSize: "1200+ Staff",
        services: ["Infrastructure Development", "Construction Workers", "Project Support"],
        testimonial: "Reliable partnership for our infrastructure projects."
      },
      {
        name: "Al Rashid Construction",
        logo: "/logos/alrashid.png",
        location: "Dammam",
        contractValue: "45M SAR",
        duration: "10 Years",
        teamSize: "900+ Staff",
        services: ["Commercial Construction", "Labor Supply", "Safety Management"],
        testimonial: "Quality workforce that ensures project success."
      },
      {
        name: "Saudi Infrastructure Development",
        logo: "/logos/infrastructure.png",
        location: "Madina",
        contractValue: "35M SAR",
        duration: "8 Years",
        teamSize: "700+ Staff",
        services: ["Road Construction", "Infrastructure Projects", "Maintenance"],
        testimonial: "Skilled personnel for our infrastructure development."
      }
    ],
    stats: { 
      totalClients: 40, 
      totalEmployees: 2800, 
      activeContracts: 30,
      avgContractValue: "55M SAR",
      avgDuration: "13 Years"
    }
  },

  facility: {
    id: 'facility',
    title: "Facility Management",
    icon: "🏬",
    description: "Comprehensive facility management and maintenance services",
    color: "#8b5cf6",
    clients: [
      {
        name: "Arabia Mall",
        logo: "/logos/arabia.png",
        location: "Riyadh",
        contractValue: "30M SAR",
        duration: "8 Years",
        teamSize: "400+ Staff",
        services: ["Cleaning Services", "Security", "Maintenance", "Customer Service"],
        testimonial: "Comprehensive facility management that maintains our mall's excellence."
      },
      {
        name: "Red Sea Mall",
        logo: "/logos/redsea.png",
        location: "Jeddah",
        contractValue: "25M SAR",
        duration: "7 Years",
        teamSize: "350+ Staff",
        services: ["Facility Maintenance", "Security Services", "Cleaning Operations"],
        testimonial: "Professional facility management team for our shopping center."
      },
      {
        name: "Al Rashid Mall",
        logo: "/logos/alrashidmall.png",
        location: "Dammam",
        contractValue: "20M SAR",
        duration: "6 Years",
        teamSize: "300+ Staff",
        services: ["Mall Operations", "Maintenance", "Security", "Customer Service"],
        testimonial: "Reliable facility management that enhances visitor experience."
      },
      {
        name: "Office Building Management",
        logo: "/logos/office.png",
        location: "Madina",
        contractValue: "15M SAR",
        duration: "5 Years",
        teamSize: "200+ Staff",
        services: ["Building Maintenance", "Cleaning Services", "Security"],
        testimonial: "Efficient facility management for our office complexes."
      },
      {
        name: "Healthcare Facilities",
        logo: "/logos/healthcare.png",
        location: "Riyadh",
        contractValue: "35M SAR",
        duration: "9 Years",
        teamSize: "450+ Staff",
        services: ["Hospital Maintenance", "Cleaning Services", "Support Staff"],
        testimonial: "Specialized facility management for healthcare environments."
      }
    ],
    stats: { 
      totalClients: 30, 
      totalEmployees: 1200, 
      activeContracts: 18,
      avgContractValue: "23M SAR",
      avgDuration: "7 Years"
    }
  },

  logistics: {
    id: 'logistics',
    title: "Logistics & Warehousing",
    icon: "🚚",
    description: "Specialized logistics and warehousing personnel",
    color: "#06b6d4",
    clients: [
      {
        name: "Saudi Post",
        logo: "/logos/saudipost.png",
        location: "Riyadh",
        contractValue: "40M SAR",
        duration: "12 Years",
        teamSize: "600+ Staff",
        services: ["Mail Processing", "Distribution", "Customer Service"],
        testimonial: "Reliable workforce supporting our national postal services."
      },
      {
        name: "DHL Saudi Arabia",
        logo: "/logos/dhl.png",
        location: "Jeddah",
        contractValue: "35M SAR",
        duration: "10 Years",
        teamSize: "500+ Staff",
        services: ["Package Handling", "Warehouse Operations", "Delivery Services"],
        testimonial: "Professional logistics support for our operations."
      },
      {
        name: "FedEx Saudi",
        logo: "/logos/fedex.png",
        location: "Dammam",
        contractValue: "30M SAR",
        duration: "8 Years",
        teamSize: "400+ Staff",
        services: ["Express Delivery", "Warehouse Management", "Customer Service"],
        testimonial: "Quality logistics personnel for our express services."
      },
      {
        name: "E-commerce Fulfillment Centers",
        logo: "/logos/ecommerce.png",
        location: "Riyadh",
        contractValue: "25M SAR",
        duration: "6 Years",
        teamSize: "350+ Staff",
        services: ["Order Processing", "Warehouse Operations", "Quality Control"],
        testimonial: "Efficient fulfillment support for our e-commerce operations."
      },
      {
        name: "Cold Storage Facilities",
        logo: "/logos/coldstorage.png",
        location: "Jeddah",
        contractValue: "20M SAR",
        duration: "5 Years",
        teamSize: "250+ Staff",
        services: ["Cold Storage Operations", "Inventory Management", "Quality Control"],
        testimonial: "Specialized personnel for temperature-controlled storage."
      }
    ],
    stats: { 
      totalClients: 25, 
      totalEmployees: 800, 
      activeContracts: 15,
      avgContractValue: "28M SAR",
      avgDuration: "8.2 Years"
    }
  }
};

// Enhanced testimonials with detailed information
export const clientTestimonials = [
  {
    id: 1,
    quote: "For over 8 years, they have provided us with skilled construction workers. Their reliability and quality of manpower have been instrumental in completing our projects on time and within budget.",
    author: "Ahmed Al-Rashid",
    position: "Project Manager",
    company: "Saudi Construction Company",
    industry: "Construction",
    location: "Riyadh",
    duration: "8 Years",
    avatar: "👷‍♂️",
    rating: 5,
    contractValue: "25M SAR",
    teamSize: "150+ Staff",
    services: ["Construction Workers", "Safety Personnel", "Project Support"],
    achievements: ["Completed 15 major projects", "Zero safety incidents", "98% on-time delivery"]
  },
  {
    id: 2,
    quote: "The professionalism and training quality of their ground handling staff has significantly improved our operational efficiency. We've renewed our contract multiple times due to their exceptional service.",
    author: "Sarah Al-Mahmoud",
    position: "Operations Director",
    company: "King Abdulaziz International Airport",
    industry: "Airport Operations",
    location: "Jeddah",
    duration: "6 Years",
    avatar: "👨‍✈️",
    rating: 5,
    contractValue: "15M SAR",
    teamSize: "200+ Staff",
    services: ["Ground Handling", "Security", "Customer Service"],
    achievements: ["25% efficiency improvement", "99.8% service quality", "Zero operational delays"]
  },
  {
    id: 3,
    quote: "Their catering staff are well-trained and understand the high standards required in healthcare environments. Excellent service for 5 consecutive years with consistent quality.",
    author: "Dr. Mohammed Al-Zahra",
    position: "Hospital Administrator",
    company: "King Fahd Hospital",
    industry: "Healthcare Catering",
    location: "Dammam",
    duration: "5 Years",
    avatar: "👩‍⚕️",
    rating: 5,
    contractValue: "8M SAR",
    teamSize: "50+ Staff",
    services: ["Hospital Catering", "Dietary Services", "Patient Meals"],
    achievements: ["100% compliance rating", "Zero food safety issues", "95% patient satisfaction"]
  },
  {
    id: 4,
    quote: "The facility management team has been exceptional. They maintain the highest standards of cleanliness and service in our corporate offices, contributing to our professional environment.",
    author: "Fatima Al-Sheikh",
    position: "Facilities Manager",
    company: "SABIC Headquarters",
    industry: "Corporate Facilities",
    location: "Riyadh",
    duration: "4 Years",
    avatar: "👩‍💼",
    rating: 5,
    contractValue: "12M SAR",
    teamSize: "80+ Staff",
    services: ["Facility Management", "Cleaning Services", "Maintenance"],
    achievements: ["98% service satisfaction", "Zero facility downtime", "ISO certification maintained"]
  },
  {
    id: 5,
    quote: "Their logistics support staff have been crucial to our e-commerce operations. Reliable, efficient, and always on time - exactly what we need for our fast-paced business.",
    author: "Omar Al-Mansouri",
    position: "Operations Manager",
    company: "Saudi E-commerce Platform",
    industry: "Logistics & Warehousing",
    location: "Jeddah",
    duration: "3 Years",
    avatar: "📦",
    rating: 5,
    contractValue: "6M SAR",
    teamSize: "60+ Staff",
    services: ["Order Processing", "Warehouse Operations", "Quality Control"],
    achievements: ["99.5% order accuracy", "Same-day processing", "Zero inventory discrepancies"]
  }
];

// Geographic coverage data
export const geographicCoverage = [
  {
    city: "Jeddah",
    region: "Western Province",
    clients: 45,
    employees: 3500,
    sectors: ["Airport Operations", "Corporate", "Catering", "Logistics"],
    majorClients: ["King Abdulaziz Airport", "Saudi Catering Group", "DHL Saudi"],
    image: "/images/jeddah.jpg",
    established: "1998",
    growth: "+15% YoY"
  },
  {
    city: "Riyadh",
    region: "Central Province",
    clients: 60,
    employees: 4200,
    sectors: ["Construction", "Corporate", "Facility Management", "E-commerce"],
    majorClients: ["SABIC", "Saudi Binladin Group", "Arabia Mall"],
    image: "/images/riyadh.jpg",
    established: "1995",
    growth: "+12% YoY"
  },
  {
    city: "Dammam",
    region: "Eastern Province",
    clients: 35,
    employees: 1800,
    sectors: ["Industrial", "Corporate", "Construction", "Healthcare"],
    majorClients: ["Aramco Subsidiaries", "King Fahd Hospital", "Al Rashid Construction"],
    image: "/images/dammam.jpg",
    established: "2000",
    growth: "+18% YoY"
  },
  {
    city: "Madina",
    region: "Medina Province",
    clients: 25,
    employees: 500,
    sectors: ["Hospitality", "Corporate", "Facility Management", "Airport"],
    majorClients: ["Prince Mohammed Airport", "Corporate Cafeteria", "Office Buildings"],
    image: "/images/madina.jpg",
    established: "2002",
    growth: "+8% YoY"
  }
];

// Key performance metrics
export const performanceMetrics = {
  clientRetention: 85,
  averageContractDuration: 3.5,
  industriesServed: 8,
  citiesCovered: 4,
  totalContractValue: 500,
  repeatClients: 70,
  averageTeamSize: 25,
  projectCompletionRate: 98,
  clientSatisfaction: 96,
  safetyRecord: 99.9,
  onTimeDelivery: 97,
  qualityRating: 4.9
};

// Trust indicators and certifications
export const trustIndicators = [
  {
    title: "Saudi Labor Ministry Approved",
    description: "Fully licensed and compliant with Saudi labor regulations",
    icon: "✅",
    category: "Certification"
  },
  {
    title: "ISO 9001:2015 Certified",
    description: "Quality management system certification",
    icon: "🏆",
    category: "Quality"
  },
  {
    title: "85% Client Retention Rate",
    description: "Long-term partnerships built on trust and quality",
    icon: "🔄",
    category: "Performance"
  },
  {
    title: "98% Project Success Rate",
    description: "Consistent delivery of exceptional results",
    icon: "🎯",
    category: "Performance"
  },
  {
    title: "25 Years Experience",
    description: "Proven track record since 1995",
    icon: "📅",
    category: "Experience"
  },
  {
    title: "10,000+ Employees Deployed",
    description: "Large-scale workforce management expertise",
    icon: "👥",
    category: "Scale"
  }
];

export default {
  clientIndustries,
  clientTestimonials,
  geographicCoverage,
  performanceMetrics,
  trustIndicators
};
