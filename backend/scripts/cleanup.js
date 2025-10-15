#!/usr/bin/env node

/**
 * Cleanup Script
 * 
 * This script cleans up old files, logs, and temporary data to maintain
 * system performance and storage efficiency.
 * 
 * Usage:
 * npm run cleanup
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

class CleanupService {
  constructor() {
    this.retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;
    this.logRetentionDays = 7;
    this.tempRetentionDays = 1;
  }

  // Clean old log files
  async cleanLogs() {
    try {
      console.log('🧹 Cleaning old log files...');
      
      const logDir = './logs';
      if (!fs.existsSync(logDir)) {
        console.log('📁 Log directory not found, skipping...');
        return;
      }
      
      const files = fs.readdirSync(logDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.logRetentionDays);
      
      let deletedCount = 0;
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = path.join(logDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile() && stats.mtime < cutoffDate) {
          const fileSize = stats.size;
          fs.unlinkSync(filePath);
          deletedCount++;
          totalSize += fileSize;
          console.log(`🗑️  Deleted old log: ${file}`);
        }
      }
      
      if (deletedCount > 0) {
        const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
        console.log(`✅ Cleaned ${deletedCount} log files (${totalSizeMB} MB freed)`);
      } else {
        console.log('✅ No old log files to clean');
      }
    } catch (error) {
      console.error('❌ Error cleaning logs:', error.message);
    }
  }

  // Clean old backup files
  async cleanBackups() {
    try {
      console.log('🧹 Cleaning old backup files...');
      
      const backupDir = process.env.BACKUP_PATH || './backups';
      if (!fs.existsSync(backupDir)) {
        console.log('📁 Backup directory not found, skipping...');
        return;
      }
      
      const files = fs.readdirSync(backupDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
      
      let deletedCount = 0;
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile() && stats.mtime < cutoffDate) {
          const fileSize = stats.size;
          fs.unlinkSync(filePath);
          deletedCount++;
          totalSize += fileSize;
          console.log(`🗑️  Deleted old backup: ${file}`);
        }
      }
      
      if (deletedCount > 0) {
        const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
        console.log(`✅ Cleaned ${deletedCount} backup files (${totalSizeMB} MB freed)`);
      } else {
        console.log('✅ No old backup files to clean');
      }
    } catch (error) {
      console.error('❌ Error cleaning backups:', error.message);
    }
  }

  // Clean temporary files
  async cleanTempFiles() {
    try {
      console.log('🧹 Cleaning temporary files...');
      
      const tempDirs = ['./tmp', './temp', './uploads/temp'];
      let deletedCount = 0;
      let totalSize = 0;
      
      for (const tempDir of tempDirs) {
        if (fs.existsSync(tempDir)) {
          const files = fs.readdirSync(tempDir);
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - this.tempRetentionDays);
          
          for (const file of files) {
            const filePath = path.join(tempDir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.mtime < cutoffDate) {
              const fileSize = stats.size;
              fs.unlinkSync(filePath);
              deletedCount++;
              totalSize += fileSize;
              console.log(`🗑️  Deleted temp file: ${file}`);
            }
          }
        }
      }
      
      if (deletedCount > 0) {
        const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
        console.log(`✅ Cleaned ${deletedCount} temporary files (${totalSizeMB} MB freed)`);
      } else {
        console.log('✅ No temporary files to clean');
      }
    } catch (error) {
      console.error('❌ Error cleaning temporary files:', error.message);
    }
  }

  // Clean old uploads
  async cleanOldUploads() {
    try {
      console.log('🧹 Cleaning old uploads...');
      
      const uploadDir = './uploads';
      if (!fs.existsSync(uploadDir)) {
        console.log('📁 Upload directory not found, skipping...');
        return;
      }
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90); // Keep uploads for 90 days
      
      let deletedCount = 0;
      let totalSize = 0;
      
      const cleanDirectory = (dir) => {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.isDirectory()) {
            cleanDirectory(filePath);
            // Remove empty directories
            if (fs.readdirSync(filePath).length === 0) {
              fs.rmdirSync(filePath);
              console.log(`🗑️  Removed empty directory: ${filePath}`);
            }
          } else if (stats.mtime < cutoffDate) {
            const fileSize = stats.size;
            fs.unlinkSync(filePath);
            deletedCount++;
            totalSize += fileSize;
            console.log(`🗑️  Deleted old upload: ${file}`);
          }
        }
      };
      
      cleanDirectory(uploadDir);
      
      if (deletedCount > 0) {
        const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
        console.log(`✅ Cleaned ${deletedCount} old uploads (${totalSizeMB} MB freed)`);
      } else {
        console.log('✅ No old uploads to clean');
      }
    } catch (error) {
      console.error('❌ Error cleaning old uploads:', error.message);
    }
  }

  // Clean Node.js cache
  async cleanNodeCache() {
    try {
      console.log('🧹 Cleaning Node.js cache...');
      
      const cacheDir = './node_modules/.cache';
      if (fs.existsSync(cacheDir)) {
        await execAsync(`rm -rf "${cacheDir}"`);
        console.log('✅ Node.js cache cleaned');
      } else {
        console.log('✅ No Node.js cache to clean');
      }
    } catch (error) {
      console.error('❌ Error cleaning Node.js cache:', error.message);
    }
  }

  // Clean npm cache
  async cleanNpmCache() {
    try {
      console.log('🧹 Cleaning npm cache...');
      
      await execAsync('npm cache clean --force');
      console.log('✅ npm cache cleaned');
    } catch (error) {
      console.error('❌ Error cleaning npm cache:', error.message);
    }
  }

  // Get disk usage
  async getDiskUsage() {
    try {
      console.log('💾 Checking disk usage...');
      
      const { stdout } = await execAsync('df -h .');
      console.log(stdout);
    } catch (error) {
      console.error('❌ Error checking disk usage:', error.message);
    }
  }

  // Get directory sizes
  async getDirectorySizes() {
    try {
      console.log('📊 Directory sizes:');
      
      const directories = ['./logs', './backups', './uploads', './node_modules'];
      
      for (const dir of directories) {
        if (fs.existsSync(dir)) {
          try {
            const { stdout } = await execAsync(`du -sh "${dir}"`);
            const size = stdout.split('\t')[0];
            console.log(`   ${dir}: ${size}`);
          } catch (error) {
            console.log(`   ${dir}: Error getting size`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error getting directory sizes:', error.message);
    }
  }

  // Main cleanup function
  async runCleanup() {
    try {
      console.log('🚀 Starting cleanup process...');
      console.log(`📅 Timestamp: ${new Date().toLocaleString()}`);
      console.log(`⏰ Retention periods:`);
      console.log(`   - Logs: ${this.logRetentionDays} days`);
      console.log(`   - Backups: ${this.retentionDays} days`);
      console.log(`   - Temp files: ${this.tempRetentionDays} days`);
      console.log('');
      
      // Get initial disk usage
      await this.getDiskUsage();
      console.log('');
      
      // Get initial directory sizes
      await this.getDirectorySizes();
      console.log('');
      
      // Run cleanup tasks
      await this.cleanLogs();
      await this.cleanBackups();
      await this.cleanTempFiles();
      await this.cleanOldUploads();
      await this.cleanNodeCache();
      await this.cleanNpmCache();
      
      console.log('');
      console.log('🎉 Cleanup completed successfully!');
      console.log('');
      
      // Get final disk usage
      await this.getDiskUsage();
      console.log('');
      
      // Get final directory sizes
      await this.getDirectorySizes();
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      throw error;
    }
  }
}

// Main function
async function main() {
  try {
    const cleanup = new CleanupService();
    
    // Check command line arguments
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      // Run full cleanup
      await cleanup.runCleanup();
    } else if (args[0] === 'logs') {
      // Clean logs only
      await cleanup.cleanLogs();
    } else if (args[0] === 'backups') {
      // Clean backups only
      await cleanup.cleanBackups();
    } else if (args[0] === 'uploads') {
      // Clean uploads only
      await cleanup.cleanOldUploads();
    } else if (args[0] === 'cache') {
      // Clean cache only
      await cleanup.cleanNodeCache();
      await cleanup.cleanNpmCache();
    } else if (args[0] === 'temp') {
      // Clean temp files only
      await cleanup.cleanTempFiles();
    } else if (args[0] === 'status') {
      // Show status only
      await cleanup.getDiskUsage();
      await cleanup.getDirectorySizes();
    } else {
      console.log('Usage:');
      console.log('  npm run cleanup           - Run full cleanup');
      console.log('  npm run cleanup logs      - Clean logs only');
      console.log('  npm run cleanup backups   - Clean backups only');
      console.log('  npm run cleanup uploads   - Clean uploads only');
      console.log('  npm run cleanup cache     - Clean cache only');
      console.log('  npm run cleanup temp      - Clean temp files only');
      console.log('  npm run cleanup status    - Show disk usage status');
    }
  } catch (error) {
    console.error('❌ Cleanup operation failed:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = CleanupService;
