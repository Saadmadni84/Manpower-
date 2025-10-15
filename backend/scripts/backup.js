#!/usr/bin/env node

/**
 * Database Backup Script
 * 
 * This script creates backups of the MongoDB database and stores them
 * in the backups directory with timestamp and compression.
 * 
 * Usage:
 * npm run backup
 * 
 * @author Manpower Company
 * @version 1.0.0
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const { ensureDirectoryExists } = require('../utils/helpers');

const execAsync = promisify(exec);

// Configuration
const BACKUP_DIR = process.env.BACKUP_PATH || './backups';
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/manpower_db';

class DatabaseBackup {
  constructor() {
    this.backupDir = BACKUP_DIR;
    this.retentionDays = RETENTION_DAYS;
    this.mongodbUri = MONGODB_URI;
  }

  // Get database name from URI
  getDatabaseName() {
    try {
      const url = new URL(this.mongodbUri);
      return url.pathname.substring(1) || 'manpower_db';
    } catch (error) {
      return 'manpower_db';
    }
  }

  // Generate backup filename
  generateBackupFilename() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dbName = this.getDatabaseName();
    return `${dbName}_backup_${timestamp}`;
  }

  // Ensure backup directory exists
  ensureBackupDirectory() {
    ensureDirectoryExists(this.backupDir);
    console.log(`📁 Backup directory: ${this.backupDir}`);
  }

  // Create MongoDB dump
  async createMongoDump() {
    try {
      const dbName = this.getDatabaseName();
      const filename = this.generateBackupFilename();
      const backupPath = path.join(this.backupDir, filename);
      
      console.log(`🗄️  Creating MongoDB dump for database: ${dbName}`);
      
      // Create mongodump command
      let command = `mongodump --uri="${this.mongodbUri}" --out="${backupPath}"`;
      
      // Execute mongodump
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr && !stderr.includes('done dumping')) {
        throw new Error(`MongoDB dump failed: ${stderr}`);
      }
      
      console.log('✅ MongoDB dump created successfully');
      return backupPath;
    } catch (error) {
      console.error('❌ MongoDB dump failed:', error.message);
      throw error;
    }
  }

  // Compress backup
  async compressBackup(backupPath) {
    try {
      const compressedPath = `${backupPath}.tar.gz`;
      
      console.log('🗜️  Compressing backup...');
      
      const command = `tar -czf "${compressedPath}" -C "${path.dirname(backupPath)}" "${path.basename(backupPath)}"`;
      
      await execAsync(command);
      
      // Remove uncompressed directory
      await execAsync(`rm -rf "${backupPath}"`);
      
      console.log('✅ Backup compressed successfully');
      return compressedPath;
    } catch (error) {
      console.error('❌ Backup compression failed:', error.message);
      throw error;
    }
  }

  // Get backup file size
  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      const bytes = stats.size;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]]}`;
    } catch (error) {
      return 'Unknown';
    }
  }

  // Clean old backups
  async cleanOldBackups() {
    try {
      console.log(`🧹 Cleaning backups older than ${this.retentionDays} days...`);
      
      const files = fs.readdirSync(this.backupDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
      
      let deletedCount = 0;
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          const fileSize = stats.size;
          fs.unlinkSync(filePath);
          deletedCount++;
          totalSize += fileSize;
          console.log(`🗑️  Deleted old backup: ${file}`);
        }
      }
      
      if (deletedCount > 0) {
        const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
        console.log(`✅ Cleaned ${deletedCount} old backups (${totalSizeMB} MB freed)`);
      } else {
        console.log('✅ No old backups to clean');
      }
    } catch (error) {
      console.error('❌ Error cleaning old backups:', error.message);
    }
  }

  // List existing backups
  listBackups() {
    try {
      console.log('📋 Existing backups:');
      
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.endsWith('.tar.gz'))
        .map(file => {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: this.getFileSize(filePath),
            date: stats.mtime
          };
        })
        .sort((a, b) => b.date - a.date);
      
      if (files.length === 0) {
        console.log('   No backups found');
        return;
      }
      
      files.forEach((file, index) => {
        const dateStr = file.date.toLocaleString();
        console.log(`   ${index + 1}. ${file.name} (${file.size}) - ${dateStr}`);
      });
      
      console.log(`\n📊 Total backups: ${files.length}`);
    } catch (error) {
      console.error('❌ Error listing backups:', error.message);
    }
  }

  // Get backup statistics
  getBackupStats() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.endsWith('.tar.gz'));
      
      let totalSize = 0;
      let oldestBackup = null;
      let newestBackup = null;
      
      files.forEach(file => {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        
        if (!oldestBackup || stats.mtime < oldestBackup) {
          oldestBackup = stats.mtime;
        }
        
        if (!newestBackup || stats.mtime > newestBackup) {
          newestBackup = stats.mtime;
        }
      });
      
      return {
        count: files.length,
        totalSize: this.getFileSize(path.join(this.backupDir, 'dummy')), // Will be overwritten
        totalSizeBytes: totalSize,
        oldestBackup,
        newestBackup
      };
    } catch (error) {
      console.error('❌ Error getting backup stats:', error.message);
      return null;
    }
  }

  // Main backup function
  async createBackup() {
    try {
      console.log('🚀 Starting database backup...');
      console.log(`📅 Timestamp: ${new Date().toLocaleString()}`);
      
      // Ensure backup directory exists
      this.ensureBackupDirectory();
      
      // Create MongoDB dump
      const backupPath = await this.createMongoDump();
      
      // Compress backup
      const compressedPath = await this.compressBackup(backupPath);
      
      // Get backup info
      const backupSize = this.getFileSize(compressedPath);
      const backupName = path.basename(compressedPath);
      
      console.log('🎉 Backup created successfully!');
      console.log(`📁 Backup file: ${backupName}`);
      console.log(`📏 Backup size: ${backupSize}`);
      console.log(`📍 Backup location: ${compressedPath}`);
      
      // Clean old backups
      await this.cleanOldBackups();
      
      // List backups
      this.listBackups();
      
      return compressedPath;
    } catch (error) {
      console.error('❌ Backup creation failed:', error.message);
      throw error;
    }
  }

  // Restore from backup
  async restoreFromBackup(backupFile) {
    try {
      console.log(`🔄 Restoring from backup: ${backupFile}`);
      
      const backupPath = path.join(this.backupDir, backupFile);
      
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file not found: ${backupPath}`);
      }
      
      // Extract backup
      const extractPath = backupPath.replace('.tar.gz', '');
      const extractCommand = `tar -xzf "${backupPath}" -C "${path.dirname(extractPath)}"`;
      
      console.log('📦 Extracting backup...');
      await execAsync(extractCommand);
      
      // Restore to MongoDB
      const dbName = this.getDatabaseName();
      const restoreCommand = `mongorestore --uri="${this.mongodbUri}" --drop "${extractPath}"`;
      
      console.log('🗄️  Restoring to MongoDB...');
      const { stdout, stderr } = await execAsync(restoreCommand);
      
      if (stderr && !stderr.includes('done')) {
        throw new Error(`MongoDB restore failed: ${stderr}`);
      }
      
      // Clean up extracted files
      await execAsync(`rm -rf "${extractPath}"`);
      
      console.log('✅ Database restored successfully!');
    } catch (error) {
      console.error('❌ Database restore failed:', error.message);
      throw error;
    }
  }
}

// Main function
async function main() {
  try {
    const backup = new DatabaseBackup();
    
    // Check command line arguments
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      // Create backup
      await backup.createBackup();
    } else if (args[0] === 'list') {
      // List backups
      backup.listBackups();
    } else if (args[0] === 'restore' && args[1]) {
      // Restore from backup
      await backup.restoreFromBackup(args[1]);
    } else if (args[0] === 'clean') {
      // Clean old backups
      await backup.cleanOldBackups();
    } else {
      console.log('Usage:');
      console.log('  npm run backup           - Create backup');
      console.log('  npm run backup list      - List backups');
      console.log('  npm run backup restore <file> - Restore from backup');
      console.log('  npm run backup clean     - Clean old backups');
    }
  } catch (error) {
    console.error('❌ Backup operation failed:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = DatabaseBackup;
