# 🏢 Complete Admin System - Manpower Supply Company

## 📋 Table of Contents
1. [Overview](#overview)
2. [Access Information](#access-information)
3. [Features](#features)
4. [API Endpoints](#api-endpoints)
5. [Database Models](#database-models)
6. [Security Features](#security-features)
7. [Usage Guide](#usage-guide)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

A complete, secure admin panel system built with **Node.js**, **Express**, **React**, and **MongoDB** for managing your manpower supply company website.

### Technology Stack
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Frontend**: React + React Router + CSS Modules
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, Rate Limiting, CSRF Protection
- **File Upload**: Multer (ready for implementation)

---

## 🔐 Access Information

### Admin Login
- **URL**: http://localhost:3000/admin-login
- **Username**: `admin`
- **Password**: `Admin123!`
- **Email**: admin@manpowercompany.sa
- **Role**: super_admin

### Backend API
- **Base URL**: http://localhost:5001/api/admin-new
- **Health Check**: http://localhost:5001/health

---

## ✨ Features

### 1. **Authentication System**
- ✅ Secure JWT-based authentication
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Rate limiting (5 attempts per 15 minutes)
- ✅ Session management with secure cookies
- ✅ Remember me functionality
- ✅ Token expiration (24 hours)

### 2. **Dashboard**
- ✅ Real-time statistics cards
  - Total Services
  - Total Clients
  - Active Jobs
  - Pending CVs
  - Gallery Images
  - Contact Enquiries
- ✅ Quick action buttons
- ✅ Recent activities feed
- ✅ Responsive design

### 3. **Services Management**
- ✅ Create, Read, Update, Delete services
- ✅ Bilingual support (English/Arabic)
- ✅ Service icons and images
- ✅ Active/Inactive toggle
- ✅ Display order management
- ✅ Drag & drop reordering

### 4. **Clients Management**
- ✅ Full CRUD operations
- ✅ Client logo upload
- ✅ Industry categorization
- ✅ Contract date tracking
- ✅ Active/Inactive status
- ✅ Display order management

### 5. **Careers & Jobs Management**
- ✅ Job postings CRUD
- ✅ Bilingual job descriptions
- ✅ Location-based filtering (Riyadh, Jeddah, Dammam, Madina)
- ✅ Job status management (active/inactive/filled)
- ✅ CV submissions viewing
- ✅ CV status tracking (new/reviewed/shortlisted/rejected/hired)
- ✅ CV file download
- ✅ Review notes
- ✅ Statistics dashboard

### 6. **Gallery Management**
- ✅ Image upload and management
- ✅ Bilingual titles and descriptions
- ✅ Category organization (Events, Projects, Workforce, Awards, General)
- ✅ Display order management
- ✅ Active/Inactive toggle
- ✅ Image preview

### 7. **Contact Enquiries**
- ✅ View all enquiries
- ✅ Status management (new/read/replied/closed)
- ✅ Admin notes
- ✅ Service type filtering
- ✅ Export to CSV
- ✅ Statistics dashboard
- ✅ Auto-mark as read

### 8. **Website Content Management**
- ✅ Edit site content (About Us, Mission, Vision)
- ✅ Update homepage statistics
- ✅ Bilingual content editing
- ✅ Content sections management

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/admin-new/login              - Admin login
POST   /api/admin-new/logout             - Admin logout
GET    /api/admin-new/profile            - Get admin profile
PUT    /api/admin-new/change-password    - Change password
GET    /api/admin-new/verify-token       - Verify JWT token
```

### Dashboard
```
GET    /api/admin-new/dashboard/stats         - Get dashboard statistics
GET    /api/admin-new/dashboard/quick-stats   - Get quick stats for header
```

### Services
```
GET    /api/admin-new/services           - Get all services
GET    /api/admin-new/services/:id       - Get service by ID
POST   /api/admin-new/services           - Create new service
PUT    /api/admin-new/services/:id       - Update service
DELETE /api/admin-new/services/:id       - Delete service
PATCH  /api/admin-new/services/:id/toggle - Toggle active status
POST   /api/admin-new/services/reorder   - Reorder services
```

### Clients
```
GET    /api/admin-new/clients            - Get all clients
GET    /api/admin-new/clients/:id        - Get client by ID
POST   /api/admin-new/clients            - Create new client
PUT    /api/admin-new/clients/:id        - Update client
DELETE /api/admin-new/clients/:id        - Delete client
PATCH  /api/admin-new/clients/:id/toggle - Toggle active status
```

### Jobs & Careers
```
GET    /api/admin-new/jobs               - Get all jobs
GET    /api/admin-new/jobs/:id           - Get job by ID
POST   /api/admin-new/jobs               - Create new job
PUT    /api/admin-new/jobs/:id           - Update job
DELETE /api/admin-new/jobs/:id           - Delete job

GET    /api/admin-new/cvs                - Get all CV submissions
GET    /api/admin-new/cvs/:id            - Get CV by ID
PUT    /api/admin-new/cvs/:id/status     - Update CV status
DELETE /api/admin-new/cvs/:id            - Delete CV
GET    /api/admin-new/cvs/stats          - Get CV statistics
```

### Gallery
```
GET    /api/admin-new/gallery            - Get all images
GET    /api/admin-new/gallery/:id        - Get image by ID
POST   /api/admin-new/gallery            - Upload new image
PUT    /api/admin-new/gallery/:id        - Update image
DELETE /api/admin-new/gallery/:id        - Delete image
PATCH  /api/admin-new/gallery/:id/toggle - Toggle active status
GET    /api/admin-new/gallery/categories - Get all categories
```

### Enquiries
```
GET    /api/admin-new/enquiries          - Get all enquiries
GET    /api/admin-new/enquiries/:id      - Get enquiry by ID
PUT    /api/admin-new/enquiries/:id/status - Update enquiry status
DELETE /api/admin-new/enquiries/:id      - Delete enquiry
GET    /api/admin-new/enquiries/stats    - Get enquiry statistics
GET    /api/admin-new/enquiries/export   - Export enquiries to CSV
```

### Content
```
GET    /api/admin-new/content            - Get all content
PUT    /api/admin-new/content/:id        - Update content
```

---

## 🗄️ Database Models

### AdminUser
- username, email, password_hash
- role (super_admin, admin, editor)
- last_login, is_active
- created_at, updated_at

### AdminService
- title_en, title_ar
- description_en, description_ar
- short_description_en, short_description_ar
- icon, image
- is_active, display_order

### AdminClient
- name, logo, website
- industry
- contract_start, contract_end
- is_active, display_order

### JobOpening
- title_en, title_ar
- description_en, description_ar
- requirements_en, requirements_ar
- location, salary, job_type
- experience, department
- status (active/inactive/filled)
- deadline

### CVSubmission
- job_id (reference to JobOpening)
- applicant_name, email, phone
- nationality, experience
- cv_file, cover_letter
- status (new/reviewed/shortlisted/rejected/hired)
- review_notes
- submitted_at, reviewed_at

### Gallery
- image_path
- title_en, title_ar
- description_en, description_ar
- category
- display_order, is_active

### ContactEnquiry
- name, email, phone, company
- subject, message
- service_type
- status (new/read/replied/closed)
- admin_notes, response_date

### SiteContent
- section, content_key
- content_value_en, content_value_ar
- data_type
- is_active

---

## 🛡️ Security Features

### 1. **Authentication**
- JWT tokens with 24-hour expiration
- Secure HTTP-only cookies
- Password hashing with bcrypt (12 rounds)
- Session validation on every request

### 2. **Rate Limiting**
- Login attempts: 5 per 15 minutes per IP
- Automatic lockout after failed attempts
- Retry-after headers

### 3. **Input Validation**
- Request body validation
- SQL injection prevention (MongoDB)
- XSS protection
- CSRF token support (ready)

### 4. **File Upload Security**
- File type validation
- File size limits (5MB images, 10MB CVs)
- Secure file naming
- Path traversal prevention

### 5. **Access Control**
- Role-based authorization
- Protected routes
- Token verification middleware
- Admin-only endpoints

---

## 📖 Usage Guide

### Starting the System

1. **Start MongoDB**:
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

2. **Start Backend** (Port 5001):
   ```bash
   cd backend
   PORT=5001 node server.js
   ```

3. **Start Frontend** (Port 3000):
   ```bash
   cd frontend
   npm start
   ```

4. **Access Admin Panel**:
   - Open browser: http://localhost:3000
   - Click "Admin Panel" button in header
   - Login with: admin / Admin123!

### Creating New Admin User

```javascript
// Using MongoDB shell or create via API
const newAdmin = {
  username: 'newadmin',
  email: 'newadmin@company.com',
  password_hash: 'SecurePassword123!',
  role: 'admin'
};
```

### API Usage Example

```javascript
// Login
const response = await fetch('http://localhost:5001/api/admin-new/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'Admin123!'
  })
});

const { token } = await response.json();

// Use token for authenticated requests
const services = await fetch('http://localhost:5001/api/admin-new/services', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🔧 Troubleshooting

### Issue: Backend won't start on port 5000
**Solution**: Port 5000 is used by Apple's AirTunes. Use port 5001:
```bash
PORT=5001 node server.js
```

### Issue: White page on admin login
**Solution**: 
1. Check if backend is running
2. Verify frontend is pointing to correct backend URL
3. Check browser console for errors

### Issue: Cannot login
**Solution**:
1. Verify MongoDB is running
2. Check if admin user exists in database
3. Verify credentials: admin / Admin123!

### Issue: CORS errors
**Solution**: Backend already configured for CORS. Ensure frontend is on port 3000.

### Issue: Token expired
**Solution**: Tokens expire after 24 hours. Re-login to get new token.

---

## 📝 Sample Data

The system comes pre-seeded with:
- **1 Admin User**: admin / Admin123!
- **6 Services**: Airport Operations, Corporate Offices, Catering, Logistics, Construction, Facility Management
- **5 Clients**: Saudi Aramco, NEOM, Red Sea Global, Royal Commission for AlUla, KAFD
- **Site Content**: Homepage stats, About Us content

---

## 🚀 Next Steps

### Recommended Enhancements:
1. **Email Integration**: Send notifications for new enquiries/CVs
2. **Advanced Analytics**: Charts and graphs for statistics
3. **Bulk Operations**: Import/export data in bulk
4. **Activity Logs**: Track all admin actions
5. **Two-Factor Authentication**: Enhanced security
6. **Real-time Updates**: WebSocket for live notifications
7. **Advanced Search**: Full-text search across all sections
8. **Backup System**: Automated database backups

---

## 📞 Support

For issues or questions:
- Check logs in `/backend/logs/`
- Review error messages in browser console
- Verify all environment variables are set
- Ensure MongoDB is running and accessible

---

**Built with ❤️ for Manpower Supply Company**
**Version**: 1.0.0
**Last Updated**: October 2025
