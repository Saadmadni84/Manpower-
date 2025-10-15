/**
 * Company Model Tests
 * 
 * Tests for the Company Mongoose model including validation,
 * methods, and schema behavior.
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const Company = require('../../models/Company');

describe('Company Model', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/manpower-test');
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Company.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await Company.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('should create a valid company', async () => {
      const companyData = {
        name: 'Test Company',
        description: 'A test company for validation',
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
      };

      const company = new Company(companyData);
      const savedCompany = await company.save();

      expect(savedCompany._id).toBeDefined();
      expect(savedCompany.name).toBe(companyData.name);
      expect(savedCompany.description).toBe(companyData.description);
      expect(savedCompany.industry).toBe(companyData.industry);
      expect(savedCompany.website).toBe(companyData.website);
      expect(savedCompany.email).toBe(companyData.email);
      expect(savedCompany.phone).toBe(companyData.phone);
      expect(savedCompany.address).toEqual(companyData.address);
      expect(savedCompany.isActive).toBe(true);
      expect(savedCompany.createdAt).toBeDefined();
      expect(savedCompany.updatedAt).toBeDefined();
    });

    it('should require name field', async () => {
      const companyData = {
        description: 'A test company without name',
        industry: 'Technology'
      };

      const company = new Company(companyData);
      
      try {
        await company.save();
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.errors.name).toBeDefined();
      }
    });

    it('should require email field', async () => {
      const companyData = {
        name: 'Test Company',
        description: 'A test company without email'
      };

      const company = new Company(companyData);
      
      try {
        await company.save();
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.errors.email).toBeDefined();
      }
    });

    it('should validate email format', async () => {
      const companyData = {
        name: 'Test Company',
        email: 'invalid-email'
      };

      const company = new Company(companyData);
      
      try {
        await company.save();
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.errors.email).toBeDefined();
      }
    });

    it('should validate website URL format', async () => {
      const companyData = {
        name: 'Test Company',
        email: 'info@test.com',
        website: 'invalid-url'
      };

      const company = new Company(companyData);
      
      try {
        await company.save();
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.errors.website).toBeDefined();
      }
    });

    it('should validate phone number format', async () => {
      const companyData = {
        name: 'Test Company',
        email: 'info@test.com',
        phone: 'invalid-phone'
      };

      const company = new Company(companyData);
      
      try {
        await company.save();
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.errors.phone).toBeDefined();
      }
    });

    it('should require address fields', async () => {
      const companyData = {
        name: 'Test Company',
        email: 'info@test.com',
        address: {
          street: '123 Test Street'
          // Missing required fields
        }
      };

      const company = new Company(companyData);
      
      try {
        await company.save();
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.errors['address.city']).toBeDefined();
        expect(error.errors['address.country']).toBeDefined();
      }
    });

    it('should set default values', async () => {
      const companyData = {
        name: 'Test Company',
        email: 'info@test.com'
      };

      const company = new Company(companyData);
      const savedCompany = await company.save();

      expect(savedCompany.isActive).toBe(true);
      expect(savedCompany.isPublished).toBe(false);
      expect(savedCompany.rating).toBe(0);
      expect(savedCompany.reviewCount).toBe(0);
      expect(savedCompany.featured).toBe(false);
      expect(savedCompany.sortOrder).toBe(0);
    });
  });

  describe('Instance Methods', () => {
    let company;

    beforeEach(async () => {
      company = new Company({
        name: 'Test Company',
        description: 'A test company for methods',
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
        }
      });
      await company.save();
    });

    it('should update last modified date on save', async () => {
      const originalUpdatedAt = company.updatedAt;
      
      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 100));
      
      company.name = 'Updated Company Name';
      await company.save();
      
      expect(company.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should generate slug from name', async () => {
      expect(company.slug).toBe('test-company');
      
      company.name = 'New Company Name';
      await company.save();
      expect(company.slug).toBe('new-company-name');
    });

    it('should generate unique slug', async () => {
      const company2 = new Company({
        name: 'Test Company',
        email: 'info2@test.com'
      });
      await company2.save();
      
      expect(company2.slug).toBe('test-company-2');
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test companies
      const companies = [
        {
          name: 'Active Company 1',
          email: 'active1@test.com',
          isActive: true,
          isPublished: true,
          industry: 'Technology'
        },
        {
          name: 'Active Company 2',
          email: 'active2@test.com',
          isActive: true,
          isPublished: true,
          industry: 'Healthcare'
        },
        {
          name: 'Inactive Company',
          email: 'inactive@test.com',
          isActive: false,
          isPublished: false,
          industry: 'Technology'
        }
      ];

      for (const companyData of companies) {
        const company = new Company(companyData);
        await company.save();
      }
    });

    it('should find active companies', async () => {
      const activeCompanies = await Company.findActive();
      expect(activeCompanies.length).toBe(2);
      expect(activeCompanies.every(company => company.isActive)).toBe(true);
    });

    it('should find published companies', async () => {
      const publishedCompanies = await Company.findPublished();
      expect(publishedCompanies.length).toBe(2);
      expect(publishedCompanies.every(company => company.isPublished)).toBe(true);
    });

    it('should find companies by industry', async () => {
      const techCompanies = await Company.findByIndustry('Technology');
      expect(techCompanies.length).toBe(1);
      expect(techCompanies[0].industry).toBe('Technology');
    });

    it('should search companies by name', async () => {
      const searchResults = await Company.searchByName('Active');
      expect(searchResults.length).toBe(2);
      expect(searchResults.every(company => 
        company.name.toLowerCase().includes('active')
      )).toBe(true);
    });
  });

  describe('Virtual Fields', () => {
    let company;

    beforeEach(async () => {
      company = new Company({
        name: 'Test Company',
        email: 'info@test.com',
        address: {
          street: '123 Test Street',
          city: 'Riyadh',
          state: 'Riyadh Province',
          country: 'Saudi Arabia',
          postalCode: '12345'
        }
      });
      await company.save();
    });

    it('should generate full address', () => {
      expect(company.fullAddress).toBe('123 Test Street, Riyadh, Riyadh Province, Saudi Arabia 12345');
    });

    it('should generate display name', () => {
      expect(company.displayName).toBe('Test Company');
    });

    it('should generate status text', () => {
      expect(company.statusText).toBe('Active');
      
      company.isActive = false;
      expect(company.statusText).toBe('Inactive');
    });
  });

  describe('Indexes', () => {
    it('should have unique email index', async () => {
      const company1 = new Company({
        name: 'Company 1',
        email: 'duplicate@test.com'
      });
      await company1.save();

      const company2 = new Company({
        name: 'Company 2',
        email: 'duplicate@test.com'
      });

      try {
        await company2.save();
        fail('Should have thrown duplicate key error');
      } catch (error) {
        expect(error.code).toBe(11000);
      }
    });

    it('should have unique slug index', async () => {
      const company1 = new Company({
        name: 'Unique Company',
        email: 'unique1@test.com'
      });
      await company1.save();

      const company2 = new Company({
        name: 'Unique Company',
        email: 'unique2@test.com'
      });

      try {
        await company2.save();
        fail('Should have thrown duplicate key error');
      } catch (error) {
        expect(error.code).toBe(11000);
      }
    });
  });

  describe('Pre/Post Hooks', () => {
    it('should execute pre-save hook', async () => {
      const company = new Company({
        name: 'Hook Test Company',
        email: 'hook@test.com'
      });

      // Mock console.log to test pre-save hook
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await company.save();

      expect(consoleSpy).toHaveBeenCalledWith('Saving company:', company.name);

      consoleSpy.mockRestore();
    });

    it('should execute post-save hook', async () => {
      const company = new Company({
        name: 'Hook Test Company 2',
        email: 'hook2@test.com'
      });

      // Mock console.log to test post-save hook
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await company.save();

      expect(consoleSpy).toHaveBeenCalledWith('Company saved:', company.name);

      consoleSpy.mockRestore();
    });
  });
});
