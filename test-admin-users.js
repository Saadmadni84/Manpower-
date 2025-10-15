const axios = require('axios');

async function testAdminUsers() {
  try {
    console.log('🧪 Testing Admin Users API...\n');

    // Step 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5001/api/admin/login', {
      username: 'admin',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('   Token:', token.substring(0, 20) + '...\n');

    // Step 2: Get admin users
    console.log('2. Fetching admin users...');
    const usersResponse = await axios.get('http://localhost:5001/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (usersResponse.data.success) {
      console.log('✅ Admin users fetched successfully');
      console.log('   Users count:', usersResponse.data.data.length);
      console.log('   Users:', usersResponse.data.data.map(u => ({
        username: u.username,
        email: u.email,
        role: u.role,
        is_active: u.is_active
      })));
    } else {
      console.error('❌ Failed to fetch users:', usersResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

// Run the test
testAdminUsers();
