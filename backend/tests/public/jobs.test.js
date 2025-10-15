/**
 * Public Jobs API Tests
 * 
 * Tests for public job-related endpoints including job listings,
 * job details, and job applications.
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const JobPosting = require('../../models/JobPosting');
const JobApplication = require('../../models/JobApplication');
const JobCategory = require('../../models/JobCategory');
const Location = require('../../models/Location');

describe('Public Jobs API', () => {
  let testJob;
  let testCategory;
  let testLocation;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/manpower-test');
    
    // Create test category
    testCategory = new JobCategory({
      name: 'Engineering',
      description: 'Engineering positions',
      isActive: true
    });
    await testCategory.save();

    // Create test location
    testLocation = new Location({
      name: 'Riyadh',
      address: 'Riyadh, Saudi Arabia',
      coordinates: { lat: 24.7136, lng: 46.6753 },
      isActive: true
    });
    await testLocation.save();
    
    // Create test job
    testJob = new JobPosting({
      title: 'Software Engineer',
      description: 'We are looking for a skilled software engineer',
      requirements: ['Bachelor degree', '2+ years experience'],
      responsibilities: ['Develop applications', 'Code review'],
      benefits: ['Health insurance', 'Competitive salary'],
      location: testLocation._id,
      category: testCategory._id,
      employmentType: 'full-time',
      experienceLevel: 'mid-level',
      salaryRange: { min: 5000, max: 8000, currency: 'SAR' },
      isActive: true,
      isPublished: true,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      contactEmail: 'hr@test.com',
      contactPhone: '+966501234567'
    });
    
    await testJob.save();
  });

  afterAll(async () => {
    // Clean up test data
    await JobPosting.deleteMany({});
    await JobApplication.deleteMany({});
    await JobCategory.deleteMany({});
    await Location.deleteMany({});
    await mongoose.disconnect();
  });

  describe('GET /api/jobs', () => {
    it('should get all active job postings', async () => {
      const response = await request(app)
        .get('/api/jobs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.jobs).toBeDefined();
      expect(Array.isArray(response.body.jobs)).toBe(true);
      expect(response.body.jobs.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter jobs by category', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .query({ category: testCategory._id });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.jobs).toBeDefined();
      expect(response.body.jobs.every(job => job.category._id === testCategory._id.toString())).toBe(true);
    });

    it('should filter jobs by location', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .query({ location: testLocation._id });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.jobs).toBeDefined();
      expect(response.body.jobs.every(job => job.location._id === testLocation._id.toString())).toBe(true);
    });

    it('should filter jobs by employment type', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .query({ employmentType: 'full-time' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.jobs).toBeDefined();
      expect(response.body.jobs.every(job => job.employmentType === 'full-time')).toBe(true);
    });

    it('should filter jobs by experience level', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .query({ experienceLevel: 'mid-level' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.jobs).toBeDefined();
      expect(response.body.jobs.every(job => job.experienceLevel === 'mid-level')).toBe(true);
    });

    it('should search jobs by title', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .query({ search: 'Software' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.jobs).toBeDefined();
      expect(response.body.jobs.every(job => 
        job.title.toLowerCase().includes('software')
      )).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .query({ page: 1, limit: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.jobs).toBeDefined();
      expect(response.body.jobs.length).toBeLessThanOrEqual(1);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
    });

    it('should sort jobs by creation date', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .query({ sortBy: 'createdAt', sortOrder: 'desc' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.jobs).toBeDefined();
      
      if (response.body.jobs.length > 1) {
        const dates = response.body.jobs.map(job => new Date(job.createdAt));
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i-1].getTime()).toBeGreaterThanOrEqual(dates[i].getTime());
        }
      }
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should get job details by ID', async () => {
      const response = await request(app)
        .get(`/api/jobs/${testJob._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.job).toBeDefined();
      expect(response.body.job._id).toBe(testJob._id.toString());
      expect(response.body.job.title).toBe('Software Engineer');
      expect(response.body.job.description).toBeDefined();
      expect(response.body.job.requirements).toBeDefined();
      expect(response.body.job.responsibilities).toBeDefined();
      expect(response.body.job.benefits).toBeDefined();
    });

    it('should return 404 for non-existent job', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/jobs/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Job not found');
    });

    it('should return 404 for inactive job', async () => {
      // Create inactive job
      const inactiveJob = new JobPosting({
        title: 'Inactive Job',
        description: 'This job is inactive',
        requirements: ['Test requirement'],
        responsibilities: ['Test responsibility'],
        benefits: ['Test benefit'],
        location: testLocation._id,
        category: testCategory._id,
        employmentType: 'full-time',
        experienceLevel: 'entry-level',
        isActive: false,
        isPublished: false
      });
      await inactiveJob.save();

      const response = await request(app)
        .get(`/api/jobs/${inactiveJob._id}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Job not found');

      // Clean up
      await JobPosting.deleteOne({ _id: inactiveJob._id });
    });

    it('should return 400 for invalid job ID', async () => {
      const response = await request(app)
        .get('/api/jobs/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid job ID');
    });
  });

  describe('POST /api/jobs/:id/apply', () => {
    it('should submit job application successfully', async () => {
      const applicationData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.com',
          phone: '+966501234567',
          dateOfBirth: '1990-01-01',
          nationality: 'Saudi',
          gender: 'male'
        },
        address: {
          street: '123 Main St',
          city: 'Riyadh',
          state: 'Riyadh Province',
          country: 'Saudi Arabia',
          postalCode: '12345'
        },
        education: [
          {
            degree: 'Bachelor',
            field: 'Computer Science',
            institution: 'King Saud University',
            graduationYear: 2015,
            gpa: 3.5
          }
        ],
        experience: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2016-01-01',
            endDate: '2018-12-31',
            description: 'Developed web applications'
          }
        ],
        skills: ['JavaScript', 'Node.js', 'React'],
        languages: [
          { language: 'Arabic', proficiency: 'native' },
          { language: 'English', proficiency: 'fluent' }
        ],
        additionalInfo: 'I am passionate about software development',
        resume: 'base64-encoded-resume-content',
        coverLetter: 'I am interested in this position...'
      };

      const response = await request(app)
        .post(`/api/jobs/${testJob._id}/apply`)
        .send(applicationData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Application submitted successfully');
      expect(response.body.application).toBeDefined();
      expect(response.body.application.job).toBe(testJob._id.toString());
      expect(response.body.application.personalInfo.firstName).toBe('John');
    });

    it('should fail with missing required fields', async () => {
      const incompleteData = {
        personalInfo: {
          firstName: 'John'
          // Missing other required fields
        }
      };

      const response = await request(app)
        .post(`/api/jobs/${testJob._id}/apply`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation error');
    });

    it('should fail for non-existent job', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const applicationData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.com',
          phone: '+966501234567'
        }
      };

      const response = await request(app)
        .post(`/api/jobs/${fakeId}/apply`)
        .send(applicationData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Job not found');
    });

    it('should fail for inactive job', async () => {
      // Create inactive job
      const inactiveJob = new JobPosting({
        title: 'Inactive Job',
        description: 'This job is inactive',
        requirements: ['Test requirement'],
        responsibilities: ['Test responsibility'],
        benefits: ['Test benefit'],
        location: testLocation._id,
        category: testCategory._id,
        employmentType: 'full-time',
        experienceLevel: 'entry-level',
        isActive: false,
        isPublished: false
      });
      await inactiveJob.save();

      const applicationData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.com',
          phone: '+966501234567'
        }
      };

      const response = await request(app)
        .post(`/api/jobs/${inactiveJob._id}/apply`)
        .send(applicationData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Job not found');

      // Clean up
      await JobPosting.deleteOne({ _id: inactiveJob._id });
    });

    it('should fail for expired job', async () => {
      // Create expired job
      const expiredJob = new JobPosting({
        title: 'Expired Job',
        description: 'This job has expired',
        requirements: ['Test requirement'],
        responsibilities: ['Test responsibility'],
        benefits: ['Test benefit'],
        location: testLocation._id,
        category: testCategory._id,
        employmentType: 'full-time',
        experienceLevel: 'entry-level',
        isActive: true,
        isPublished: true,
        applicationDeadline: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      });
      await expiredJob.save();

      const applicationData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.com',
          phone: '+966501234567'
        }
      };

      const response = await request(app)
        .post(`/api/jobs/${expiredJob._id}/apply`)
        .send(applicationData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Application deadline has passed');

      // Clean up
      await JobPosting.deleteOne({ _id: expiredJob._id });
    });
  });

  describe('GET /api/jobs/categories', () => {
    it('should get all active job categories', async () => {
      const response = await request(app)
        .get('/api/jobs/categories');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.categories).toBeDefined();
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(response.body.categories.length).toBeGreaterThan(0);
      expect(response.body.categories.every(cat => cat.isActive)).toBe(true);
    });
  });

  describe('GET /api/jobs/locations', () => {
    it('should get all active job locations', async () => {
      const response = await request(app)
        .get('/api/jobs/locations');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.locations).toBeDefined();
      expect(Array.isArray(response.body.locations)).toBe(true);
      expect(response.body.locations.length).toBeGreaterThan(0);
      expect(response.body.locations.every(loc => loc.isActive)).toBe(true);
    });
  });
});
