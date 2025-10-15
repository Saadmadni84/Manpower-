#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * This script handles database migrations, schema updates, and data transformations.
 * It supports versioned migrations and rollback functionality.
 * 
 * Usage:
 * npm run migrate
 * npm run migrate:up
 * npm run migrate:down
 * npm run migrate:status
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { ensureDirectoryExists } = require('../utils/helpers');

class MigrationService {
  constructor() {
    this.migrationsDir = './migrations';
    this.connection = null;
  }

  // Connect to database
  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/manpower-company';
      this.connection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  // Disconnect from database
  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
      }
    } catch (error) {
      console.error('❌ Database disconnection failed:', error.message);
    }
  }

  // Ensure migrations directory exists
  async ensureMigrationsDir() {
    if (!fs.existsSync(this.migrationsDir)) {
      fs.mkdirSync(this.migrationsDir, { recursive: true });
      console.log('📁 Created migrations directory');
    }
  }

  // Get migration schema
  getMigrationSchema() {
    return new mongoose.Schema({
      version: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      appliedAt: { type: Date, default: Date.now },
      description: String,
      up: String,
      down: String,
      status: { type: String, enum: ['pending', 'applied', 'failed'], default: 'pending' }
    });
  }

  // Get or create migrations collection
  getMigrationsCollection() {
    const schema = this.getMigrationSchema();
    return mongoose.model('Migration', schema, 'migrations');
  }

  // List all migration files
  listMigrationFiles() {
    if (!fs.existsSync(this.migrationsDir)) {
      return [];
    }
    
    const files = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();
    
    return files;
  }

  // Parse migration file
  parseMigrationFile(filename) {
    const filePath = path.join(this.migrationsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract version from filename (format: YYYYMMDDHHMMSS_description.js)
    const match = filename.match(/^(\d{14})_(.+)\.js$/);
    if (!match) {
      throw new Error(`Invalid migration filename format: ${filename}`);
    }
    
    const version = match[1];
    const name = match[2].replace(/_/g, ' ');
    
    return {
      version,
      name,
      filename,
      content
    };
  }

  // Load migration functions
  loadMigrationFunctions(content) {
    // Create a temporary module to evaluate the migration
    const Module = require('module');
    const tempModule = new Module();
    
    // Set up the module context
    tempModule.exports = {};
    tempModule.require = require;
    tempModule.__filename = 'temp-migration';
    tempModule.__dirname = process.cwd();
    
    // Evaluate the migration code
    const wrappedContent = `
      (function(exports, require, module, __filename, __dirname) {
        ${content}
      })
    `;
    
    const fn = eval(wrappedContent);
    fn(tempModule.exports, require, tempModule, 'temp-migration', process.cwd());
    
    return tempModule.exports;
  }

  // Get applied migrations
  async getAppliedMigrations() {
    const Migration = this.getMigrationsCollection();
    const migrations = await Migration.find({ status: 'applied' }).sort({ version: 1 });
    return migrations;
  }

  // Get pending migrations
  async getPendingMigrations() {
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedVersions = new Set(appliedMigrations.map(m => m.version));
    
    const migrationFiles = this.listMigrationFiles();
    const pendingMigrations = [];
    
    for (const filename of migrationFiles) {
      const migration = this.parseMigrationFile(filename);
      if (!appliedVersions.has(migration.version)) {
        pendingMigrations.push(migration);
      }
    }
    
    return pendingMigrations;
  }

  // Apply migration
  async applyMigration(migration) {
    try {
      console.log(`🔄 Applying migration: ${migration.name} (${migration.version})`);
      
      const Migration = this.getMigrationsCollection();
      const migrationDoc = new Migration({
        version: migration.version,
        name: migration.name,
        description: migration.description,
        status: 'pending'
      });
      
      await migrationDoc.save();
      
      // Load and execute migration functions
      const migrationFunctions = this.loadMigrationFunctions(migration.content);
      
      if (typeof migrationFunctions.up === 'function') {
        await migrationFunctions.up();
        console.log(`✅ Migration applied: ${migration.name}`);
      } else {
        throw new Error('Migration must export an "up" function');
      }
      
      // Update migration status
      migrationDoc.status = 'applied';
      await migrationDoc.save();
      
    } catch (error) {
      console.error(`❌ Migration failed: ${migration.name}`, error.message);
      
      // Update migration status to failed
      const Migration = this.getMigrationsCollection();
      await Migration.updateOne(
        { version: migration.version },
        { status: 'failed', error: error.message }
      );
      
      throw error;
    }
  }

  // Rollback migration
  async rollbackMigration(migration) {
    try {
      console.log(`🔄 Rolling back migration: ${migration.name} (${migration.version})`);
      
      // Load and execute migration functions
      const migrationFunctions = this.loadMigrationFunctions(migration.content);
      
      if (typeof migrationFunctions.down === 'function') {
        await migrationFunctions.down();
        console.log(`✅ Migration rolled back: ${migration.name}`);
      } else {
        throw new Error('Migration must export a "down" function');
      }
      
      // Remove migration record
      const Migration = this.getMigrationsCollection();
      await Migration.deleteOne({ version: migration.version });
      
    } catch (error) {
      console.error(`❌ Rollback failed: ${migration.name}`, error.message);
      throw error;
    }
  }

  // Run all pending migrations
  async runMigrations() {
    try {
      await this.ensureMigrationsDir();
      
      const pendingMigrations = await this.getPendingMigrations();
      
      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations');
        return;
      }
      
      console.log(`📋 Found ${pendingMigrations.length} pending migrations`);
      
      for (const migration of pendingMigrations) {
        await this.applyMigration(migration);
      }
      
      console.log(`🎉 Successfully applied ${pendingMigrations.length} migrations`);
      
    } catch (error) {
      console.error('❌ Migration process failed:', error.message);
      throw error;
    }
  }

  // Rollback last migration
  async rollbackLastMigration() {
    try {
      const appliedMigrations = await this.getAppliedMigrations();
      
      if (appliedMigrations.length === 0) {
        console.log('✅ No migrations to rollback');
        return;
      }
      
      const lastMigration = appliedMigrations[appliedMigrations.length - 1];
      const migrationFiles = this.listMigrationFiles();
      const migrationFile = migrationFiles.find(file => 
        file.startsWith(lastMigration.version)
      );
      
      if (!migrationFile) {
        throw new Error(`Migration file not found for version: ${lastMigration.version}`);
      }
      
      const migration = this.parseMigrationFile(migrationFile);
      await this.rollbackMigration(migration);
      
      console.log('🎉 Successfully rolled back last migration');
      
    } catch (error) {
      console.error('❌ Rollback process failed:', error.message);
      throw error;
    }
  }

  // Show migration status
  async showStatus() {
    try {
      await this.ensureMigrationsDir();
      
      const appliedMigrations = await this.getAppliedMigrations();
      const pendingMigrations = await this.getPendingMigrations();
      const migrationFiles = this.listMigrationFiles();
      
      console.log('📊 Migration Status');
      console.log('==================');
      console.log(`Total migration files: ${migrationFiles.length}`);
      console.log(`Applied migrations: ${appliedMigrations.length}`);
      console.log(`Pending migrations: ${pendingMigrations.length}`);
      console.log('');
      
      if (appliedMigrations.length > 0) {
        console.log('✅ Applied Migrations:');
        appliedMigrations.forEach(migration => {
          console.log(`   ${migration.version} - ${migration.name} (${migration.appliedAt.toLocaleDateString()})`);
        });
        console.log('');
      }
      
      if (pendingMigrations.length > 0) {
        console.log('⏳ Pending Migrations:');
        pendingMigrations.forEach(migration => {
          console.log(`   ${migration.version} - ${migration.name}`);
        });
        console.log('');
      }
      
    } catch (error) {
      console.error('❌ Failed to show migration status:', error.message);
      throw error;
    }
  }

  // Create new migration template
  async createMigration(name) {
    try {
      await this.ensureMigrationsDir();
      
      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
      const filename = `${timestamp}_${name.replace(/\s+/g, '_')}.js`;
      const filePath = path.join(this.migrationsDir, filename);
      
      const template = `/**
 * Migration: ${name}
 * 
 * Created: ${new Date().toLocaleString()}
 * 
 * This migration file should export two functions:
 * - up(): Function to apply the migration
 * - down(): Function to rollback the migration
 */

const { Schema, model } = require('mongoose');

/**
 * Apply the migration
 */
async function up() {
  console.log('🔄 Applying migration: ${name}');
  
  // TODO: Implement migration logic here
  // Example:
  // const db = mongoose.connection.db;
  // await db.collection('users').createIndex({ email: 1 }, { unique: true });
  
  console.log('✅ Migration applied: ${name}');
}

/**
 * Rollback the migration
 */
async function down() {
  console.log('🔄 Rolling back migration: ${name}');
  
  // TODO: Implement rollback logic here
  // Example:
  // const db = mongoose.connection.db;
  // await db.collection('users').dropIndex({ email: 1 });
  
  console.log('✅ Migration rolled back: ${name}');
}

module.exports = {
  up,
  down
};
`;
      
      fs.writeFileSync(filePath, template);
      console.log(`✅ Created migration file: ${filename}`);
      console.log(`📁 Location: ${filePath}`);
      
    } catch (error) {
      console.error('❌ Failed to create migration:', error.message);
      throw error;
    }
  }
}

// Main function
async function main() {
  try {
    const migration = new MigrationService();
    await migration.connect();
    
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
      case 'up':
        await migration.runMigrations();
        break;
      case 'down':
        await migration.rollbackLastMigration();
        break;
      case 'status':
        await migration.showStatus();
        break;
      case 'create':
        if (!args[1]) {
          throw new Error('Migration name is required');
        }
        await migration.createMigration(args[1]);
        break;
      default:
        // Default to running migrations
        await migration.runMigrations();
    }
    
  } catch (error) {
    console.error('❌ Migration operation failed:', error.message);
    process.exit(1);
  } finally {
    const migration = new MigrationService();
    await migration.disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = MigrationService;
