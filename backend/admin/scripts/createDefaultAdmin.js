const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');

// Database configuration
const ADMIN_DB_URI = process.env.ADMIN_DB_URI || 'mongodb://localhost:27017/manpower_admin';

async function createDefaultAdmin() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(ADMIN_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to database');

    // Check if any admin users exist
    const existingUsers = await AdminUser.countDocuments();
    
    if (existingUsers > 0) {
      console.log(`📊 Found ${existingUsers} existing admin users`);
      
      // List existing users
      const users = await AdminUser.find().select('username email role is_active');
      console.log('\n📋 Existing admin users:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.username} (${user.email}) - ${user.role} - ${user.is_active ? 'Active' : 'Inactive'}`);
      });
      
      // Check if super admin exists
      const superAdminExists = await AdminUser.findOne({ role: 'super_admin', is_active: true });
      if (superAdminExists) {
        console.log('\n✅ Super admin user already exists');
        console.log(`   Username: ${superAdminExists.username}`);
        console.log(`   Email: ${superAdminExists.email}`);
      } else {
        console.log('\n⚠️  No active super admin found!');
        console.log('   Creating default super admin...');
        await createSuperAdmin();
      }
    } else {
      console.log('📝 No admin users found. Creating default super admin...');
      await createSuperAdmin();
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

async function createSuperAdmin() {
  try {
    const defaultAdmin = {
      username: 'admin',
      email: 'admin@manpower.com',
      password_hash: 'admin123', // Will be hashed by pre-save middleware
      role: 'super_admin',
      full_name: 'System Administrator',
      phone: '',
      department: 'IT',
      is_active: true
    };

    // Check if admin user already exists
    const existingAdmin = await AdminUser.findOne({
      $or: [
        { username: defaultAdmin.username },
        { email: defaultAdmin.email }
      ]
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      
      // Update to super admin if needed
      if (existingAdmin.role !== 'super_admin') {
        existingAdmin.role = 'super_admin';
        existingAdmin.is_active = true;
        await existingAdmin.save();
        console.log('✅ Updated to super admin role');
      }
    } else {
      const newAdmin = new AdminUser(defaultAdmin);
      await newAdmin.save();
      console.log('✅ Default super admin created successfully!');
      console.log('\n📋 Admin Credentials:');
      console.log('   Username: admin');
      console.log('   Email: admin@manpower.com');
      console.log('   Password: admin123');
      console.log('   Role: super_admin');
      console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    }
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createDefaultAdmin();
}

module.exports = createDefaultAdmin;
