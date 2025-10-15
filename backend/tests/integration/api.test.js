/**
 * Integration Tests
 * 
 * End-to-end tests for the complete API functionality including
 * authentication, authorization, and business logic flows.
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const AdminUser = require('../../models/AdminUser');
const JobPosting = require('../../models/JobPosting');
const JobApplication = require('../../models/JobApplication');
const Company = require('../../models/Company');
const Service = require('../../models/Service');
const Client = require('../../models/Client');

describe('API Integration Tests', () => {
  let adminToken;
  let testAdmin;
  let testJob;
  let testCompany;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/manpower-test');
    
    // Create test admin
    testAdmin = new AdminUser({
      username: 'integrationadmin',
      email: 'integration@test.com',
      password: 'TestPassword123!',
      role: 'super_admin',
      isActive: true,
      profile: {
        firstName: 'Integration',
        lastName: 'Admin',
        phone: '+966501234567'
      }
    });
    await testAdmin.save();

    // Create test company
    testCompany = new Company({
      name: 'Test Company',
      description: 'A test company for integration testing',
      industry: 'Technology',
      website: 'https://testcompany.com',
      email: 'info@testcompany.com',
      phone: '+966501234567',
      address: {
        street: '123 Test Street',
        city: 'Riyadh',
        state: 'Riyadh Province',
        country: 'Saudi Arabia',
        postalCode: '12345'
      },
      isActive: true
    });
    await testCompany.save();

    // Create test job
    testJob = new JobPosting({
      title: 'Integration Test Engineer',
      description: 'Testing integration functionality',
      requirements: ['Bachelor degree', 'Testing experience'],
      responsibilities: ['Write tests', 'Debug issues'],
      benefits: ['Health insurance', 'Competitive salary'],
      employmentType: 'full-time',
      experienceLevel: 'mid-level',
      salaryRange: { min: 4000, max: 6000, currency: 'SAR' },
      isActive: true,
      isPublished: true,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      contactEmail: 'hr@test.com',
      contactPhone: '+966501234567'
    });
    await testJob.save();
  });

  afterAll(async () => {
    // Clean up test data
    await AdminUser.deleteMany({});
    await JobPosting.deleteMany({});
    await JobApplication.deleteMany({});
    await Company.deleteMany({});
    await Service.deleteMany({});
    await Client.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Login admin to get token
    const loginResponse = await request(app)
      .post('/api/admin/auth/login')
      .send({
        email: 'integration@test.com',
        password: 'TestPassword123!'
      });
    
    adminToken = loginResponse.body.token;
  });

  describe('Complete Job Management Flow', () => {
    it('should complete the full job management workflow', async () => {
      // 1. Admin creates a new job posting
      const newJobData = {
        title: 'Full Stack Developer',
        description: 'We need a full stack developer for our team',
        requirements: ['Bachelor degree', '3+ years experience', 'JavaScript', 'Node.js'],
        responsibilities: ['Develop web applications', 'Code review', 'Team collaboration'],
        benefits: ['Health insurance', 'Annual bonus', 'Flexible hours'],
        employmentType: 'full-time',
        experienceLevel: 'senior',
        salaryRange: { min: 7000, max: 10000, currency: 'SAR' },
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        contactEmail: 'hr@test.com',
        contactPhone: '+966501234567'
      };

      const createResponse = await request(app)
        .post('/api/admin/jobs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newJobData);

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.job).toBeDefined();
      const jobId = createResponse.body.job._id;

      // 2. Admin updates the job posting
      const updateData = {
        title: 'Senior Full Stack Developer',
        benefits: ['Health insurance', 'Annual bonus', 'Flexible hours', 'Remote work']
      };

      const updateResponse = await request(app)
        .put(`/api/admin/jobs/${jobId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.job.title).toBe('Senior Full Stack Developer');

      // 3. Public user views the job
      const publicViewResponse = await request(app)
        .get(`/api/jobs/${jobId}`);

      expect(publicViewResponse.status).toBe(200);
      expect(publicViewResponse.body.success).toBe(true);
      expect(publicViewResponse.body.job.title).toBe('Senior Full Stack Developer');

      // 4. Public user applies for the job
      const applicationData = {
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@test.com',
          phone: '+966509876543',
          dateOfBirth: '1985-05-15',
          nationality: 'Saudi',
          gender: 'female'
        },
        address: {
          street: '456 Oak Avenue',
          city: 'Jeddah',
          state: 'Makkah Province',
          country: 'Saudi Arabia',
          postalCode: '54321'
        },
        education: [
          {
            degree: 'Master',
            field: 'Computer Science',
            institution: 'King Abdulaziz University',
            graduationYear: 2010,
            gpa: 3.8
          }
        ],
        experience: [
          {
            company: 'Tech Solutions Inc',
            position: 'Senior Developer',
            startDate: '2012-01-01',
            endDate: '2020-12-31',
            description: 'Led development of enterprise applications'
          }
        ],
        skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'AWS'],
        languages: [
          { language: 'Arabic', proficiency: 'native' },
          { language: 'English', proficiency: 'fluent' }
        ],
        additionalInfo: 'Passionate about creating scalable web applications',
        resume: 'base64-encoded-resume-content',
        coverLetter: 'I am excited about this opportunity...'
      };

      const applyResponse = await request(app)
        .post(`/api/jobs/${jobId}/apply`)
        .send(applicationData);

      expect(applyResponse.status).toBe(201);
      expect(applyResponse.body.success).toBe(true);
      expect(applyResponse.body.application).toBeDefined();
      const applicationId = applyResponse.body.application._id;

      // 5. Admin views all applications for the job
      const applicationsResponse = await request(app)
        .get(`/api/admin/jobs/${jobId}/applications`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(applicationsResponse.status).toBe(200);
      expect(applicationsResponse.body.success).toBe(true);
      expect(applicationsResponse.body.applications).toBeDefined();
      expect(applicationsResponse.body.applications.length).toBeGreaterThan(0);

      // 6. Admin updates application status
      const statusUpdateResponse = await request(app)
        .put(`/api/admin/applications/${applicationId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'under_review' });

      expect(statusUpdateResponse.status).toBe(200);
      expect(statusUpdateResponse.body.success).toBe(true);

      // 7. Admin deactivates the job posting
      const deactivateResponse = await request(app)
        .put(`/api/admin/jobs/${jobId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(deactivateResponse.status).toBe(200);
      expect(deactivateResponse.body.success).toBe(true);

      // 8. Verify job is no longer publicly accessible
      const publicViewAfterDeactivateResponse = await request(app)
        .get(`/api/jobs/${jobId}`);

      expect(publicViewAfterDeactivateResponse.status).toBe(404);
      expect(publicViewAfterDeactivateResponse.body.success).toBe(false);
    });
  });

  describe('Complete Company Management Flow', () => {
    it('should complete the full company management workflow', async () => {
      // 1. Admin creates a new service
      const serviceData = {
        name: 'IT Consulting',
        description: 'Comprehensive IT consulting services',
        category: 'Technology',
        features: ['System analysis', 'Technology recommendations', 'Implementation support'],
        benefits: ['Cost reduction', 'Improved efficiency', 'Expert guidance'],
        isActive: true,
        isPublished: true
      };

      const createServiceResponse = await request(app)
        .post('/api/admin/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(serviceData);

      expect(createServiceResponse.status).toBe(201);
      expect(createServiceResponse.body.success).toBe(true);
      expect(createServiceResponse.body.service).toBeDefined();
      const serviceId = createServiceResponse.body.service._id;

      // 2. Admin creates a new client
      const clientData = {
        name: 'ABC Corporation',
        description: 'A leading corporation in the region',
        industry: 'Manufacturing',
        website: 'https://abccorp.com',
        email: 'contact@abccorp.com',
        phone: '+966501111111',
        address: {
          street: '789 Business District',
          city: 'Dammam',
          state: 'Eastern Province',
          country: 'Saudi Arabia',
          postalCode: '99999'
        },
        isActive: true,
        isPublished: true
      };

      const createClientResponse = await request(app)
        .post('/api/admin/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(clientData);

      expect(createClientResponse.status).toBe(201);
      expect(createClientResponse.body.success).toBe(true);
      expect(createClientResponse.body.client).toBeDefined();
      const clientId = createClientResponse.body.client._id;

      // 3. Public user views services
      const publicServicesResponse = await request(app)
        .get('/api/services');

      expect(publicServicesResponse.status).toBe(200);
      expect(publicServicesResponse.body.success).toBe(true);
      expect(publicServicesResponse.body.services).toBeDefined();
      expect(publicServicesResponse.body.services.length).toBeGreaterThan(0);

      // 4. Public user views clients
      const publicClientsResponse = await request(app)
        .get('/api/clients');

      expect(publicClientsResponse.status).toBe(200);
      expect(publicClientsResponse.body.success).toBe(true);
      expect(publicClientsResponse.body.clients).toBeDefined();
      expect(publicClientsResponse.body.clients.length).toBeGreaterThan(0);

      // 5. Public user submits contact form
      const contactData = {
        name: 'Ahmed Al-Rashid',
        email: 'ahmed@test.com',
        phone: '+966502222222',
        company: 'XYZ Services',
        subject: 'Inquiry about IT Consulting',
        message: 'I am interested in your IT consulting services. Please contact me.',
        preferredContactMethod: 'email'
      };

      const contactResponse = await request(app)
        .post('/api/contact')
        .send(contactData);

      expect(contactResponse.status).toBe(201);
      expect(contactResponse.body.success).toBe(true);
      expect(contactResponse.body.inquiry).toBeDefined();

      // 6. Admin views contact inquiries
      const inquiriesResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(inquiriesResponse.status).toBe(200);
      expect(inquiriesResponse.body.success).toBe(true);
      expect(inquiriesResponse.body.inquiries).toBeDefined();
      expect(inquiriesResponse.body.inquiries.length).toBeGreaterThan(0);

      // 7. Admin updates contact inquiry status
      const inquiryId = contactResponse.body.inquiry._id;
      const statusUpdateResponse = await request(app)
        .put(`/api/admin/contacts/${inquiryId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'in_progress' });

      expect(statusUpdateResponse.status).toBe(200);
      expect(statusUpdateResponse.body.success).toBe(true);
    });
  });

  describe('Authentication and Authorization Flow', () => {
    it('should handle complete authentication and authorization workflow', async () => {
      // 1. Create a new admin user
      const newAdminData = {
        username: 'newadmin',
        email: 'newadmin@test.com',
        password: 'NewPassword123!',
        role: 'admin',
        profile: {
          firstName: 'New',
          lastName: 'Admin',
          phone: '+966503333333'
        }
      };

      const createAdminResponse = await request(app)
        .post('/api/admin/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newAdminData);

      expect(createAdminResponse.status).toBe(201);
      expect(createAdminResponse.body.success).toBe(true);
      expect(createAdminResponse.body.user).toBeDefined();
      const newAdminId = createAdminResponse.body.user._id;

      // 2. New admin logs in
      const loginResponse = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'newadmin@test.com',
          password: 'NewPassword123!'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();
      const newAdminToken = loginResponse.body.token;

      // 3. New admin accesses protected route
      const protectedResponse = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', `Bearer ${newAdminToken}`);

      expect(protectedResponse.status).toBe(200);
      expect(protectedResponse.body.success).toBe(true);
      expect(protectedResponse.body.user.email).toBe('newadmin@test.com');

      // 4. New admin tries to access super admin route (should fail)
      const superAdminResponse = await request(app)
        .get('/api/admin/dashboard/analytics')
        .set('Authorization', `Bearer ${newAdminToken}`);

      expect(superAdminResponse.status).toBe(403);
      expect(superAdminResponse.body.success).toBe(false);

      // 5. Super admin updates new admin's role
      const roleUpdateResponse = await request(app)
        .put(`/api/admin/users/${newAdminId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'super_admin' });

      expect(roleUpdateResponse.status).toBe(200);
      expect(roleUpdateResponse.body.success).toBe(true);

      // 6. New admin now accesses super admin route (should succeed)
      const superAdminResponseAfterUpdate = await request(app)
        .get('/api/admin/dashboard/analytics')
        .set('Authorization', `Bearer ${newAdminToken}`);

      expect(superAdminResponseAfterUpdate.status).toBe(200);
      expect(superAdminResponseAfterUpdate.body.success).toBe(true);

      // 7. New admin changes password
      const changePasswordResponse = await request(app)
        .put('/api/admin/auth/change-password')
        .set('Authorization', `Bearer ${newAdminToken}`)
        .send({
          currentPassword: 'NewPassword123!',
          newPassword: 'UpdatedPassword123!'
        });

      expect(changePasswordResponse.status).toBe(200);
      expect(changePasswordResponse.body.success).toBe(true);

      // 8. New admin logs out
      const logoutResponse = await request(app)
        .post('/api/admin/auth/logout')
        .set('Authorization', `Bearer ${newAdminToken}`);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body.success).toBe(true);

      // 9. Verify token is invalid after logout
      const invalidTokenResponse = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', `Bearer ${newAdminToken}`);

      expect(invalidTokenResponse.status).toBe(401);
      expect(invalidTokenResponse.body.success).toBe(false);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle various error scenarios gracefully', async () => {
      // 1. Test rate limiting
      const rateLimitPromises = [];
      for (let i = 0; i < 20; i++) {
        rateLimitPromises.push(
          request(app)
            .get('/api/jobs')
            .catch(err => err)
        );
      }
      
      const rateLimitResponses = await Promise.all(rateLimitPromises);
      const rateLimitedResponses = rateLimitResponses.filter(res => 
        res.status === 429
      );
      
      // Should have some rate-limited responses
      expect(rateLimitedResponses.length).toBeGreaterThan(0);

      // 2. Test invalid JSON in request body
      const invalidJsonResponse = await request(app)
        .post('/api/admin/jobs')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(invalidJsonResponse.status).toBe(400);

      // 3. Test missing required fields
      const missingFieldsResponse = await request(app)
        .post('/api/admin/jobs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(missingFieldsResponse.status).toBe(400);
      expect(missingFieldsResponse.body.success).toBe(false);

      // 4. Test unauthorized access
      const unauthorizedResponse = await request(app)
        .get('/api/admin/jobs');

      expect(unauthorizedResponse.status).toBe(401);
      expect(unauthorizedResponse.body.success).toBe(false);

      // 5. Test invalid route
      const invalidRouteResponse = await request(app)
        .get('/api/invalid/route');

      expect(invalidRouteResponse.status).toBe(404);
      expect(invalidRouteResponse.body.success).toBe(false);
    });
  });
});
