const mongoose = require('mongoose');
const ClientManagement = require('../models/ClientManagement');
require('dotenv').config();

const defaultClients = [
  {
    name: 'Saudi Aramco',
    displayName: 'Saudi Aramco - Oil & Gas Giant',
    industry: 'oil_gas',
    companySize: 'enterprise',
    headquarters: 'Dhahran, Eastern Province',
    website: 'https://www.aramco.com',
    foundedYear: 1933,
    primaryContact: {
      name: 'Ahmed Al-Khalid',
      email: 'ahmed.alkhalid@aramco.com',
      phone: '+966-13-876-0000',
      position: 'HR Director',
      department: 'Human Resources'
    },
    addresses: [{
      type: 'headquarters',
      street: 'Dhahran Complex',
      city: 'Dhahran',
      province: 'Eastern Province',
      country: 'Saudi Arabia',
      isPrimary: true
    }],
    relationshipStart: new Date('2018-01-15'),
    totalProjects: 45,
    activeProjects: 12,
    totalRevenue: 15000000,
    status: 'active',
    isFeatured: true,
    showOnWebsite: true,
    clientType: 'government',
    paymentTerms: 'net_45',
    description: 'Saudi Arabian Oil Company is a Saudi Arabian public petroleum and natural gas company based in Dhahran.',
    tags: ['oil', 'gas', 'energy', 'government', 'major_client'],
    displayOrder: 1
  },
  {
    name: 'SABIC',
    displayName: 'SABIC - Saudi Basic Industries Corporation',
    industry: 'manufacturing',
    companySize: 'enterprise',
    headquarters: 'Riyadh',
    website: 'https://www.sabic.com',
    foundedYear: 1976,
    primaryContact: {
      name: 'Mohammed Al-Rashid',
      email: 'm.alrashid@sabic.com',
      phone: '+966-11-225-8000',
      position: 'Operations Manager',
      department: 'Operations'
    },
    addresses: [{
      type: 'headquarters',
      street: 'SABIC Complex',
      city: 'Riyadh',
      province: 'Riyadh Province',
      country: 'Saudi Arabia',
      isPrimary: true
    }],
    relationshipStart: new Date('2019-03-20'),
    totalProjects: 38,
    activeProjects: 8,
    totalRevenue: 12000000,
    status: 'active',
    isFeatured: true,
    showOnWebsite: true,
    clientType: 'government',
    paymentTerms: 'net_30',
    description: 'Leading manufacturer of chemicals, fertilizers, plastics and metals.',
    tags: ['manufacturing', 'chemicals', 'government', 'major_client'],
    displayOrder: 2
  },
  {
    name: 'King Abdulaziz International Airport',
    displayName: 'KAIA - King Abdulaziz International Airport',
    industry: 'aviation',
    companySize: 'enterprise',
    headquarters: 'Jeddah',
    website: 'https://www.gaca.gov.sa',
    foundedYear: 1981,
    primaryContact: {
      name: 'Khalid Al-Ghamdi',
      email: 'k.alghamdi@gaca.gov.sa',
      phone: '+966-12-684-2000',
      position: 'Facility Manager',
      department: 'Facility Management'
    },
    addresses: [{
      type: 'headquarters',
      street: 'Airport Road',
      city: 'Jeddah',
      province: 'Makkah Province',
      country: 'Saudi Arabia',
      isPrimary: true
    }],
    relationshipStart: new Date('2017-06-10'),
    totalProjects: 52,
    activeProjects: 15,
    totalRevenue: 18000000,
    status: 'active',
    isFeatured: true,
    showOnWebsite: true,
    clientType: 'government',
    paymentTerms: 'net_45',
    description: 'Major international airport serving Jeddah and the holy city of Makkah.',
    tags: ['aviation', 'government', 'airport', 'major_client'],
    displayOrder: 3
  },
  {
    name: 'Al-Rajhi Bank',
    displayName: 'Al-Rajhi Bank',
    industry: 'banking',
    companySize: 'large',
    headquarters: 'Riyadh',
    website: 'https://www.alrajhibank.com.sa',
    foundedYear: 1957,
    primaryContact: {
      name: 'Abdullah Al-Rajhi',
      email: 'a.alrajhi@alrajhibank.com.sa',
      phone: '+966-11-828-2515',
      position: 'Branch Manager',
      department: 'Operations'
    },
    secondaryContact: {
      name: 'Sara Al-Mansour',
      email: 's.almansour@alrajhibank.com.sa',
      phone: '+966-11-828-2520',
      position: 'HR Coordinator'
    },
    addresses: [{
      type: 'headquarters',
      street: 'Olaya Street',
      city: 'Riyadh',
      province: 'Riyadh Province',
      country: 'Saudi Arabia',
      isPrimary: true
    }],
    relationshipStart: new Date('2020-01-05'),
    totalProjects: 25,
    activeProjects: 10,
    totalRevenue: 8000000,
    status: 'active',
    isFeatured: false,
    showOnWebsite: true,
    clientType: 'private',
    paymentTerms: 'net_30',
    description: 'One of the largest Islamic banks in the world.',
    tags: ['banking', 'finance', 'islamic_banking'],
    displayOrder: 4
  },
  {
    name: 'Madinah Hilton Hotel',
    displayName: 'Hilton Madinah',
    industry: 'hospitality',
    companySize: 'large',
    headquarters: 'Madinah',
    website: 'https://www.hilton.com/madinah',
    foundedYear: 2010,
    primaryContact: {
      name: 'Fahad Al-Otaibi',
      email: 'f.alotaibi@hilton.com',
      phone: '+966-14-838-8888',
      position: 'General Manager',
      department: 'Management'
    },
    addresses: [{
      type: 'headquarters',
      street: 'King Fahd Road',
      city: 'Madinah',
      province: 'Madinah Province',
      country: 'Saudi Arabia',
      isPrimary: true
    }],
    relationshipStart: new Date('2019-09-15'),
    totalProjects: 30,
    activeProjects: 6,
    totalRevenue: 5000000,
    status: 'active',
    isFeatured: false,
    showOnWebsite: true,
    clientType: 'private',
    paymentTerms: 'net_30',
    description: 'Luxury hotel serving pilgrims and tourists in Madinah.',
    tags: ['hospitality', 'hotel', 'tourism'],
    displayOrder: 5
  },
  {
    name: 'King Fahd Hospital',
    displayName: 'King Fahd Hospital',
    industry: 'healthcare',
    companySize: 'enterprise',
    headquarters: 'Riyadh',
    website: 'https://www.kfh.med.sa',
    foundedYear: 1989,
    primaryContact: {
      name: 'Dr. Saleh Al-Mutairi',
      email: 's.almutairi@kfh.med.sa',
      phone: '+966-11-464-7272',
      position: 'Hospital Administrator',
      department: 'Administration'
    },
    addresses: [{
      type: 'headquarters',
      street: 'Al-Hada District',
      city: 'Riyadh',
      province: 'Riyadh Province',
      country: 'Saudi Arabia',
      isPrimary: true
    }],
    relationshipStart: new Date('2018-11-20'),
    totalProjects: 40,
    activeProjects: 14,
    totalRevenue: 10000000,
    status: 'active',
    isFeatured: true,
    showOnWebsite: true,
    clientType: 'government',
    paymentTerms: 'net_45',
    description: 'Major government hospital providing comprehensive healthcare services.',
    tags: ['healthcare', 'hospital', 'government', 'medical'],
    displayOrder: 6
  },
  {
    name: 'NEOM Project',
    displayName: 'NEOM - The City of the Future',
    industry: 'construction',
    companySize: 'enterprise',
    headquarters: 'Tabuk',
    website: 'https://www.neom.com',
    foundedYear: 2017,
    primaryContact: {
      name: 'Nadhmi Al-Nasr',
      email: 'n.alnasr@neom.com',
      phone: '+966-14-123-4567',
      position: 'CEO',
      department: 'Executive'
    },
    addresses: [{
      type: 'headquarters',
      street: 'NEOM Bay',
      city: 'NEOM',
      province: 'Tabuk Province',
      country: 'Saudi Arabia',
      isPrimary: true
    }],
    relationshipStart: new Date('2021-02-01'),
    totalProjects: 20,
    activeProjects: 18,
    totalRevenue: 25000000,
    status: 'active',
    isFeatured: true,
    showOnWebsite: true,
    clientType: 'government',
    paymentTerms: 'net_60',
    creditLimit: 50000000,
    description: 'Mega project building a sustainable smart city powered by renewable energy.',
    tags: ['construction', 'government', 'mega_project', 'vision_2030', 'major_client'],
    displayOrder: 7,
    socialMedia: {
      twitter: 'https://twitter.com/neom',
      linkedin: 'https://www.linkedin.com/company/neom',
      instagram: 'https://www.instagram.com/discoverneom'
    }
  },
  {
    name: 'Almarai Company',
    displayName: 'Almarai - Food & Agriculture',
    industry: 'manufacturing',
    companySize: 'large',
    headquarters: 'Riyadh',
    website: 'https://www.almarai.com',
    foundedYear: 1977,
    primaryContact: {
      name: 'Ibrahim Al-Quraishi',
      email: 'i.alquraishi@almarai.com',
      phone: '+966-11-402-0555',
      position: 'Logistics Director',
      department: 'Logistics & Supply Chain'
    },
    addresses: [{
      type: 'headquarters',
      street: 'Al-Kharj Road',
      city: 'Riyadh',
      province: 'Riyadh Province',
      country: 'Saudi Arabia',
      isPrimary: true
    }],
    relationshipStart: new Date('2019-07-10'),
    totalProjects: 35,
    activeProjects: 9,
    totalRevenue: 9000000,
    status: 'active',
    isFeatured: false,
    showOnWebsite: true,
    clientType: 'private',
    paymentTerms: 'net_30',
    description: 'Largest vertically integrated dairy company in the world.',
    tags: ['manufacturing', 'food', 'dairy', 'agriculture'],
    displayOrder: 8
  }
];

async function seedClients() {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/manpower_db';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing clients
    const deleted = await ClientManagement.deleteMany({});
    console.log(`🗑️  Removed ${deleted.deletedCount} existing clients`);

    // Insert default clients
    const clients = await ClientManagement.insertMany(defaultClients);
    console.log(`✅ Created ${clients.length} default clients`);

    // Display created clients
    console.log('\n📊 Created Clients:');
    clients.forEach((client, index) => {
      console.log(`${index + 1}. ${client.name} (${client.industry}) - ${client.status}`);
    });

    console.log('\n✨ Client seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedClients();
}

module.exports = { seedClients, defaultClients };

