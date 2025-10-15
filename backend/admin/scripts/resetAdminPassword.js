const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');

// Database configuration
const ADMIN_DB_URI = process.env.ADMIN_DB_URI || 'mongodb://localhost:27017/manpower_admin';

async function resetAdminPassword() {
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

    console.log('📋 Current admin user:');
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Active: ${adminUser.is_active}`);

    // Reset password to admin123
    adminUser.password_hash = 'admin123'; // Will be hashed by pre-save middleware
    await adminUser.save();

    console.log('\n✅ Password reset successfully!');
    console.log('📋 Login credentials:');
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
  resetAdminPassword();
}

module.exports = resetAdminPassword;
