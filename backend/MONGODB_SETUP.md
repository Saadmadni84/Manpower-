# MongoDB Database Setup Guide
## Manpower Supply Company Backend

This comprehensive guide will help you set up MongoDB for your MERN stack backend project, including both local MongoDB installation and MongoDB Atlas cloud setup.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Local Installation](#mongodb-local-installation)
3. [MongoDB Atlas Cloud Setup](#mongodb-atlas-cloud-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Connection Setup](#database-connection-setup)
6. [Database Seeding](#database-seeding)
7. [Health Checks and Monitoring](#health-checks-and-monitoring)
8. [Production Deployment](#production-deployment)
9. [Backup and Recovery](#backup-and-recovery)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- Git installed
- A code editor (VS Code recommended)

---

## MongoDB Local Installation

### Option 1: MongoDB Community Edition (Recommended for Development)

#### macOS Installation
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify installation
mongosh --version
```

#### Windows Installation
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Add MongoDB to your system PATH
4. Start MongoDB service from Services or run:
```cmd
net start MongoDB
```

#### Linux (Ubuntu/Debian) Installation
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongosh --version
```

### Option 2: MongoDB Docker (Alternative)

```bash
# Pull MongoDB Docker image
docker pull mongo:7.0

# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:7.0

# Verify container is running
docker ps
```

---

## MongoDB Atlas Cloud Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (Free tier)
3. Select your preferred cloud provider and region
4. Click "Create"

### Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Select "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, add specific IP addresses
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with your database name (e.g., `manpower_db`)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/manpower_db?retryWrites=true&w=majority
```

---

## Environment Configuration

### Step 1: Create Environment File
```bash
# Copy the example environment file
cp env.example .env
```

### Step 2: Configure Database Variables

#### For Local MongoDB:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/manpower_db
MONGODB_TEST_URI=mongodb://localhost:27017/manpower_test_db
```

#### For MongoDB Atlas:
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/manpower_db?retryWrites=true&w=majority
MONGODB_TEST_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/manpower_test_db?retryWrites=true&w=majority
```

#### Complete Environment Configuration:
```env
# ==============================================
# SERVER CONFIGURATION
# ==============================================
NODE_ENV=development
PORT=5000
HOST=localhost

# ==============================================
# DATABASE CONFIGURATION
# ==============================================
MONGODB_URI=mongodb://localhost:27017/manpower_db
MONGODB_TEST_URI=mongodb://localhost:27017/manpower_test_db

# ==============================================
# JWT CONFIGURATION
# ==============================================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# ==============================================
# EMAIL CONFIGURATION
# ==============================================
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# ==============================================
# CLOUDINARY CONFIGURATION
# ==============================================
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ==============================================
# COMPANY INFORMATION
# ==============================================
COMPANY_NAME=Manpower Supply Company
COMPANY_EMAIL=info@manpowercompany.com
COMPANY_PHONE=+966-XX-XXXXXXX
COMPANY_ADDRESS=Saudi Arabia

# ==============================================
# ADMIN CONFIGURATION
# ==============================================
ADMIN_EMAIL=admin@manpowercompany.com
ADMIN_PASSWORD=secure-password
ADMIN_NAME=System Administrator

# ==============================================
# SECURITY CONFIGURATION
# ==============================================
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-key

# ==============================================
# CORS CONFIGURATION
# ==============================================
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# ==============================================
# RATE LIMITING
# ==============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ==============================================
# API CONFIGURATION
# ==============================================
API_VERSION=v1
API_PREFIX=/api

# ==============================================
# FRONTEND URL
# ==============================================
FRONTEND_URL=http://localhost:3000
```

---

## Database Connection Setup

The database connection is already configured in your project with enhanced features:

### Features Included:
- ✅ Connection pooling for performance
- ✅ Automatic reconnection with exponential backoff
- ✅ Comprehensive error handling
- ✅ Support for both local MongoDB and MongoDB Atlas
- ✅ Connection health monitoring
- ✅ Graceful shutdown handling
- ✅ SSL/TLS encryption for production
- ✅ Connection state tracking

### Connection Configuration:
```javascript
// Located in: config/database.js
const { connectDatabase, checkDatabaseHealth } = require('./config/database');
```

---

## Database Seeding

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Database Seeding
```bash
# Seed the database with initial data
npm run seed
```

### What Gets Seeded:
- ✅ **Languages**: English and Arabic support
- ✅ **Industries**: 6 industries (Airport, Corporate, Catering, Logistics, Construction, Facility Management)
- ✅ **Job Categories**: 5 categories (Administrative, Technical, Operations, Management, Support Staff)
- ✅ **Locations**: 4 Saudi Arabia locations (Jeddah, Riyadh, Dammam, Madina)
- ✅ **Company**: Complete company information with Saudi Arabia specific data
- ✅ **Services**: 6 comprehensive services with detailed features and pricing
- ✅ **Admin Users**: Default admin account

### Default Admin Login:
- **Email**: admin@manpowercompany.com
- **Password**: admin123

### Sample Data Includes:
- Company established in 1998 (25+ years experience)
- 10,000+ employees across multiple locations
- Services for all major Saudi Arabia cities
- Multi-language support (English/Arabic)
- Realistic pricing in Saudi Riyals (SAR)
- Industry-specific requirements and certifications

---

## Health Checks and Monitoring

### Database Health Check Endpoint
```bash
# Check database health
curl http://localhost:5000/health
```

### Response Example:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development",
  "version": "v1",
  "uptime": 3600,
  "memory": {
    "rss": 45678592,
    "heapTotal": 20971520,
    "heapUsed": 15678976,
    "external": 1234567
  },
  "database": {
    "status": "connected",
    "message": "Database is healthy",
    "host": "localhost",
    "port": 27017,
    "name": "manpower_db",
    "readyState": 1
  }
}
```

### Connection State Monitoring
```javascript
// Check connection state programmatically
const { isConnected, getConnectionState } = require('./config/database');

console.log('Connected:', isConnected());
console.log('Ready State:', getConnectionState());
```

---

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/manpower_db?retryWrites=true&w=majority&ssl=true
BCRYPT_ROUNDS=14
JWT_SECRET=your-production-jwt-secret-key
SESSION_SECRET=your-production-session-secret
```

### Security Best Practices
1. **Use MongoDB Atlas** for production (recommended)
2. **Enable SSL/TLS** encryption
3. **Use strong passwords** for database users
4. **Restrict network access** to specific IP addresses
5. **Enable database auditing** (MongoDB Atlas)
6. **Regular security updates**
7. **Monitor connection logs**

### Performance Optimization
1. **Connection Pooling**: Configured for 20 connections in production
2. **Indexes**: Already configured for optimal query performance
3. **Compression**: Enabled for data transfer
4. **Read Preferences**: Secondary preferred for production
5. **Write Concern**: Majority for data consistency

---

## Backup and Recovery

### MongoDB Atlas Backups (Recommended)
MongoDB Atlas provides automatic backups:
1. Go to your cluster in Atlas
2. Click "Backups" in the left sidebar
3. Configure backup frequency and retention
4. Enable point-in-time recovery

### Manual Backup (Local MongoDB)
```bash
# Create backup
mongodump --db manpower_db --out ./backups/$(date +%Y%m%d_%H%M%S)

# Restore backup
mongorestore --db manpower_db ./backups/20240115_103000/manpower_db/
```

### Automated Backup Script
```bash
# Run backup script
npm run backup
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Connection Refused Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# macOS
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### 2. Authentication Failed
```bash
Error: Authentication failed
```
**Solution**: Check username and password in connection string

#### 3. Network Access Denied (Atlas)
```bash
Error: IP not in whitelist
```
**Solution**: Add your IP address in MongoDB Atlas Network Access

#### 4. SSL/TLS Issues
```bash
Error: SSL connection error
```
**Solution**: Ensure SSL is properly configured for Atlas
```env
MONGODB_URI=mongodb+srv://...?ssl=true&authSource=admin
```

#### 5. Memory Issues
```bash
Error: Out of memory
```
**Solution**: Increase Node.js memory limit
```bash
node --max-old-space-size=4096 server.js
```

### Debug Mode
```bash
# Enable debug mode
DEBUG=mongoose:* npm run dev
```

### Connection Testing
```bash
# Test connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manpower_db')
  .then(() => console.log('✅ Connection successful'))
  .catch(err => console.error('❌ Connection failed:', err.message));
"
```

---

## Additional Resources

### Documentation Links
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js MongoDB Driver](https://docs.mongodb.com/drivers/node/)

### Useful Commands
```bash
# Check MongoDB status
brew services list | grep mongodb

# View MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log

# Connect to MongoDB shell
mongosh

# List databases
show dbs

# Use specific database
use manpower_db

# Show collections
show collections

# Count documents
db.companies.countDocuments()
```

### Support
For additional support:
- Check the project's GitHub issues
- MongoDB Community Forums
- Stack Overflow with tags: `mongodb`, `mongoose`, `nodejs`

---

## Quick Start Checklist

- [ ] Install MongoDB (local or Atlas)
- [ ] Configure environment variables
- [ ] Install project dependencies (`npm install`)
- [ ] Run database seeding (`npm run seed`)
- [ ] Start the server (`npm start`)
- [ ] Test health endpoint (`curl http://localhost:5000/health`)
- [ ] Verify database connection in logs

Your MongoDB database is now ready for the Manpower Supply Company backend! 🚀
