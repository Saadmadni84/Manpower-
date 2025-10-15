const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');

// Database configuration
const ADMIN_DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manpower_db';

async function createFreshAdmin() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(ADMIN_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to database');

    // Delete all existing admin users
    await AdminUser.deleteMany({});
    console.log('🗑️  Deleted all existing admin users');

    // Create a fresh admin user
    const freshAdmin = new AdminUser({
      username: 'admin',
      email: 'admin@manpower.com',
      password_hash: 'admin123', // Will be hashed by pre-save middleware
      role: 'super_admin',
      full_name: 'System Administrator',
      phone: '',
      department: 'IT',
      is_active: true
    });

    await freshAdmin.save();
    console.log('✅ Fresh admin user created');

    // Verify the user
    const savedUser = await AdminUser.findOne({ username: 'admin' });
    console.log('\n📋 Admin user details:');
    console.log(`   ID: ${savedUser._id}`);
    console.log(`   Username: ${savedUser.username}`);
    console.log(`   Email: ${savedUser.email}`);
    console.log(`   Role: ${savedUser.role}`);
    console.log(`   Active: ${savedUser.is_active}`);
    console.log(`   Password hash: ${savedUser.password_hash.substring(0, 20)}...`);

    // Test password
    const isValid = await savedUser.comparePassword('admin123');
    console.log(`\n🔐 Password test: ${isValid ? '✅ Valid' : '❌ Invalid'}`);

    console.log('\n📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

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
  createFreshAdmin();
}

module.exports = createFreshAdmin;
