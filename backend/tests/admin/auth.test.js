/**
 * Admin Authentication Tests
 * 
 * Tests for admin authentication functionality including login, logout,
 * password reset, and session management.
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const AdminUser = require('../../models/AdminUser');

describe('Admin Authentication', () => {
  let testAdmin;
  let authToken;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/manpower-test');
    
    // Create test admin user
    testAdmin = new AdminUser({
      username: 'testadmin',
      email: 'admin@test.com',
      password: 'TestPassword123!',
      role: 'super_admin',
      isActive: true,
      profile: {
        firstName: 'Test',
        lastName: 'Admin',
        phone: '+966501234567'
      }
    });
    
    await testAdmin.save();
  });

  afterAll(async () => {
    // Clean up test data
    await AdminUser.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Reset auth token before each test
    authToken = null;
  });

  describe('POST /admin/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('admin@test.com');
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned

      authToken = response.body.token;
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'invalid@test.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email and password are required');
    });

    it('should fail with inactive user', async () => {
      // Deactivate test admin
      await AdminUser.updateOne(
        { email: 'admin@test.com' },
        { isActive: false }
      );

      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Account is inactive');

      // Reactivate for other tests
      await AdminUser.updateOne(
        { email: 'admin@test.com' },
        { isActive: true }
      );
    });
  });

  describe('POST /admin/auth/logout', () => {
    beforeEach(async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'TestPassword123!'
        });
      
      authToken = loginResponse.body.token;
    });

    it('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/admin/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logged out successfully');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .post('/api/admin/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .post('/api/admin/auth/logout')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });
  });

  describe('POST /admin/auth/refresh', () => {
    beforeEach(async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'TestPassword123!'
        });
      
      authToken = loginResponse.body.token;
    });

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/admin/auth/refresh')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.token).not.toBe(authToken); // Should be a new token
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .post('/api/admin/auth/refresh');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /admin/auth/me', () => {
    beforeEach(async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'TestPassword123!'
        });
      
      authToken = loginResponse.body.token;
    });

    it('should return current user info', async () => {
      const response = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('admin@test.com');
      expect(response.body.user.username).toBe('testadmin');
      expect(response.body.user.password).toBeUndefined();
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/admin/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /admin/auth/forgot-password', () => {
    it('should send reset email for valid email', async () => {
      const response = await request(app)
        .post('/api/admin/auth/forgot-password')
        .send({
          email: 'admin@test.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password reset email sent');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/admin/auth/forgot-password')
        .send({
          email: 'invalid@test.com'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('User not found');
    });

    it('should fail without email', async () => {
      const response = await request(app)
        .post('/api/admin/auth/forgot-password')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email is required');
    });
  });

  describe('POST /admin/auth/reset-password', () => {
    let resetToken;

    beforeEach(async () => {
      // Generate reset token
      const resetResponse = await request(app)
        .post('/api/admin/auth/forgot-password')
        .send({
          email: 'admin@test.com'
        });
      
      // In a real scenario, you'd extract the token from the email
      // For testing, we'll generate one manually
      const admin = await AdminUser.findOne({ email: 'admin@test.com' });
      resetToken = admin.generateResetToken();
      await admin.save();
    });

    it('should reset password with valid token', async () => {
      const response = await request(app)
        .post('/api/admin/auth/reset-password')
        .send({
          token: resetToken,
          password: 'NewPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password reset successfully');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .post('/api/admin/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'NewPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired token');
    });

    it('should fail with weak password', async () => {
      const response = await request(app)
        .post('/api/admin/auth/reset-password')
        .send({
          token: resetToken,
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Password does not meet requirements');
    });
  });

  describe('PUT /admin/auth/change-password', () => {
    beforeEach(async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'TestPassword123!'
        });
      
      authToken = loginResponse.body.token;
    });

    it('should change password with valid current password', async () => {
      const response = await request(app)
        .put('/api/admin/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'TestPassword123!',
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password changed successfully');
    });

    it('should fail with invalid current password', async () => {
      const response = await request(app)
        .put('/api/admin/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Current password is incorrect');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .put('/api/admin/auth/change-password')
        .send({
          currentPassword: 'TestPassword123!',
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
