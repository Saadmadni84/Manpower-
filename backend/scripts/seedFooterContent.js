const mongoose = require('mongoose');
require('dotenv').config();

const FooterContent = require('../models/FooterContent');
const { ENV_KEYS } = require('../config/keys');

const seedFooterContent = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(ENV_KEYS.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connected to MongoDB');

    // Clear existing footer content
    await FooterContent.deleteMany({});
    console.log('🗑️  Cleared existing footer content');

    // Create default footer content
    const footerContent = await FooterContent.create({
      company: {
        name: 'Manpower Excellence Company',
        tagline: '25 Years of Manpower Excellence in Saudi Arabia',
        logo: '/logo.png'
      },
      quickLinks: [
        { label: 'Home', path: '/', order: 1 },
        { label: 'About Us', path: '/about', order: 2 },
        { label: 'Our Services', path: '/services', order: 3 },
        { label: 'Clients', path: '/clients', order: 4 },
        { label: 'Careers', path: '/careers', order: 5 },
        { label: 'Contact Us', path: '/contact', order: 6 }
      ],
      contact: {
        address: 'Riyadh, Kingdom of Saudi Arabia',
        phone: '+966 XX XXX XXXX',
        email: 'info@manpowerexcellence.com'
      },
      socialMedia: [
        { 
          platform: 'LinkedIn', 
          url: 'https://linkedin.com/company/yourcompany', 
          icon: 'linkedin',
          order: 1 
        },
        { 
          platform: 'Facebook', 
          url: 'https://facebook.com/yourcompany', 
          icon: 'facebook',
          order: 2 
        },
        { 
          platform: 'Instagram', 
          url: 'https://instagram.com/yourcompany', 
          icon: 'instagram',
          order: 3 
        }
      ],
      copyright: {
        year: new Date().getFullYear(),
        text: 'All rights reserved.'
      },
      isActive: true
    });

    console.log('✅ Footer content seeded successfully');
    console.log(`📄 Created footer content with ID: ${footerContent._id}`);

    // Display summary
    console.log('\n📊 Footer Content Summary:');
    console.log(`   Company: ${footerContent.company.name}`);
    console.log(`   Tagline: ${footerContent.company.tagline}`);
    console.log(`   Quick Links: ${footerContent.quickLinks.length} links`);
    console.log(`   Social Media: ${footerContent.socialMedia.length} platforms`);
    console.log(`   Copyright Year: ${footerContent.copyright.year}`);

    // Close database connection
    await mongoose.connection.close();
    console.log('\n✨ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding footer content:', error);
    process.exit(1);
  }
};

// Run seed function
seedFooterContent();

module.exports = seedFooterContent;

