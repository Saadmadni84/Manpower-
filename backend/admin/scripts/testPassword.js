const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');

// Database configuration
const ADMIN_DB_URI = process.env.ADMIN_DB_URI || 'mongodb://localhost:27017/manpower_admin';

async function testPassword() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(ADMIN_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to database');

    // Find the admin user
    const adminUser = await AdminUser.findOne({ username: 'admin' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('📋 Admin user found:');
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Active: ${adminUser.is_active}`);
    console.log(`   Password hash: ${adminUser.password_hash.substring(0, 20)}...`);

    // Test password comparison
    const testPassword = 'admin123';
    console.log(`\n🔐 Testing password: "${testPassword}"`);
    
    const isValid = await adminUser.comparePassword(testPassword);
    console.log(`   Result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);

    // Test with a new password
    console.log(`\n🔐 Creating new admin user with known password...`);
    
    // Delete existing admin if exists
    await AdminUser.deleteOne({ username: 'testadmin' });
    
    const newAdmin = new AdminUser({
      username: 'testadmin',
      email: 'test@admin.com',
      password_hash: 'admin123',
      role: 'super_admin',
      full_name: 'Test Admin',
      is_active: true
    });
    
    await newAdmin.save();
    console.log('✅ New admin created');
    
    // Test the new admin's password
    const isValidNew = await newAdmin.comparePassword('admin123');
    console.log(`   Password test result: ${isValidNew ? '✅ Valid' : '❌ Invalid'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  testPassword();
}

module.exports = testPassword;
