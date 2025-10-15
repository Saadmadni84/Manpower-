# Career & Jobs Management System - Complete Documentation

## 🎉 System Overview

A comprehensive career and jobs management system with applicant tracking, interview scheduling, and automated workflows for efficient recruitment management.

## 📋 Features Implemented

### Backend (Node.js/Express)

#### Models Created:
- ✅ **JobOpening.js** - Complete job postings with bilingual support (EN/AR)
- ✅ **JobApplication.js** - Comprehensive applicant tracking with CV management
- ✅ **Interview.js** - Interview scheduling and feedback management

#### Controllers:
- ✅ **jobController.js** - CRUD operations for jobs with advanced filtering
- ✅ **applicationController.js** - Application management with status tracking
- ✅ Interview routes with scheduling and feedback capabilities

#### Middleware:
- ✅ **cvUpload.js** - Multi-file upload handling (CV, cover letter, documents)
- ✅ Enhanced **emailService.js** with 15+ career-related email templates

#### Routes:
- ✅ `/admin/career/jobs` - Job management endpoints
- ✅ `/admin/career/applications` - Application management endpoints  
- ✅ `/admin/career/interviews` - Interview management endpoints

### Frontend (React)

#### Custom Hooks:
- ✅ **useJobs.js** - Jobs data management
- ✅ **useApplications.js** - Applications data management
- ✅ **useInterviews.js** - Interviews data management

#### Job Components:
- ✅ **JobCard.jsx** - Individual job display with quick actions
- ✅ **JobsList.jsx** - Jobs listing with grid/list views
- ✅ **JobForm.jsx** - Comprehensive 5-tab job creation form
- ✅ **AddJobModal.jsx** - Modal for creating new jobs
- ✅ **EditJobModal.jsx** - Modal for editing existing jobs

#### Application Components:
- ✅ **ApplicationsTable.jsx** - Sortable table with bulk actions
- ✅ **ApplicationCard.jsx** - Applicant summary cards
- ✅ **ApplicationDetails.jsx** - 6-tab detailed applicant view
- ✅ **InterviewScheduler.jsx** - Interview scheduling interface
- ✅ **EvaluationForm.jsx** - Candidate evaluation form

#### UI Components:
- ✅ **CVViewer.jsx** - PDF/document viewer with download
- ✅ **StatusPipeline.jsx** - Visual application status tracker

#### Pages:
- ✅ **JobsManagement.jsx** - Complete jobs management dashboard
- ✅ **ApplicationsManagement.jsx** - Applications tracking dashboard

### Default Data:
- ✅ **seedJobs.js** - 8 pre-configured job positions:
  1. Airport Ground Handler (Jeddah)
  2. Administrative Assistant (Riyadh)
  3. Food Service Supervisor (Mecca)
  4. Warehouse Operator (Dammam)
  5. Construction Foreman (Multiple Locations)
  6. Facility Maintenance Technician (Medina)
  7. Customer Service Representative (Remote)
  8. Security Supervisor (Riyadh)

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
# Install backend dependencies (if not already done)
cd backend
npm install multer slugify

# Install frontend dependencies (if not already done)
cd ../frontend
npm install axios
```

### 2. Seed Default Job Positions

```bash
cd backend
node scripts/seedJobs.js
```

### 3. Update Backend Routes

The routes are already registered in `/backend/admin/routes/admin.js`:
```javascript
router.use('/career/jobs', jobsRoutes);
router.use('/career/applications', applicationsRoutes);
router.use('/career/interviews', interviewsRoutes);
```

### 4. Add Frontend Routes

Add to your frontend routing configuration:

```javascript
// In your admin routes file
import JobsManagement from './pages/JobsManagement';
import ApplicationsManagement from './pages/ApplicationsManagement';

// Add routes
<Route path="/admin/jobs" element={<JobsManagement />} />
<Route path="/admin/applications" element={<ApplicationsManagement />} />
```

### 5. Update Navigation

Add menu items to your admin sidebar:

```javascript
{
  title: 'Career Management',
  icon: '💼',
  items: [
    { title: 'Jobs Management', path: '/admin/jobs', icon: '📋' },
    { title: 'Applications', path: '/admin/applications', icon: '📝' },
    { title: 'Interviews', path: '/admin/interviews', icon: '📅' }
  ]
}
```

## 📡 API Endpoints

### Jobs API

```
GET    /admin/career/jobs                 - Get all jobs with filters
GET    /admin/career/jobs/active          - Get active jobs (public)
GET    /admin/career/jobs/featured        - Get featured jobs
GET    /admin/career/jobs/statistics/overview - Get job statistics
GET    /admin/career/jobs/expiring/soon   - Get expiring jobs
GET    /admin/career/jobs/:id             - Get single job
POST   /admin/career/jobs                 - Create new job
PUT    /admin/career/jobs/:id             - Update job
PATCH  /admin/career/jobs/:id/status      - Update job status
POST   /admin/career/jobs/:id/clone       - Clone job
DELETE /admin/career/jobs/:id             - Delete job
PATCH  /admin/career/jobs/bulk/update     - Bulk update jobs
```

### Applications API

```
GET    /admin/career/applications                    - Get all applications
GET    /admin/career/applications/statistics/overview - Get statistics
GET    /admin/career/applications/export/csv         - Export to CSV
GET    /admin/career/applications/:id                - Get single application
POST   /admin/career/applications/submit             - Submit application (public)
PUT    /admin/career/applications/:id                - Update application
PATCH  /admin/career/applications/:id/status         - Update status
POST   /admin/career/applications/:id/evaluation     - Add evaluation
POST   /admin/career/applications/:id/communication  - Log communication
PATCH  /admin/career/applications/:id/assign-recruiter - Assign recruiter
POST   /admin/career/applications/:id/schedule-interview - Schedule interview
DELETE /admin/career/applications/:id                - Delete application
```

### Interviews API

```
GET    /admin/career/interviews           - Get all interviews
GET    /admin/career/interviews/today     - Get today's interviews
GET    /admin/career/interviews/upcoming  - Get upcoming interviews
GET    /admin/career/interviews/my-interviews - Get user's interviews
GET    /admin/career/interviews/:id       - Get single interview
POST   /admin/career/interviews           - Create interview
PUT    /admin/career/interviews/:id       - Update interview
POST   /admin/career/interviews/:id/reschedule - Reschedule interview
POST   /admin/career/interviews/:id/cancel     - Cancel interview
POST   /admin/career/interviews/:id/feedback   - Add feedback
DELETE /admin/career/interviews/:id       - Delete interview
```

## 🎨 Key Features

### Job Management
- ✅ Bilingual support (English/Arabic)
- ✅ Auto-generated job codes (JOB-YYYY-XXXX)
- ✅ SEO-friendly slugs
- ✅ Featured and urgent job flags
- ✅ Multiple locations per job
- ✅ Customizable hiring stages
- ✅ Salary ranges with negotiability
- ✅ Application deadline tracking
- ✅ View and application counters

### Application Tracking
- ✅ Auto-generated application IDs (APP-YYYY-XXXX)
- ✅ Multi-file upload (CV, cover letter, documents)
- ✅ Complete applicant profiles
- ✅ Work experience timeline
- ✅ Education history
- ✅ Skills and certifications
- ✅ Status pipeline with 10 stages
- ✅ Communication logs
- ✅ Evaluation and ratings
- ✅ Source tracking

### Interview Management
- ✅ Auto-generated interview IDs (INT-YYYY-XXXX)
- ✅ Multiple interview types (phone, video, in-person, technical, panel)
- ✅ Online meeting integration ready (Zoom, Teams)
- ✅ Calendar scheduling
- ✅ Multiple interviewers support
- ✅ Feedback and ratings system
- ✅ Reschedule history
- ✅ Email notifications

### Email Notifications
- ✅ Application confirmation to candidate
- ✅ New application notification to recruiter
- ✅ Interview invitations
- ✅ Interview reminders (24 hours before)
- ✅ Interview reschedule notifications
- ✅ Application status updates
- ✅ Job offer emails
- ✅ Rejection emails
- ✅ Onboarding emails
- ✅ Bulk updates to applicants

## 📊 Default Job Status Flow

```
Draft → Active → (Paused) → Filled/Cancelled/Expired
```

## 📈 Application Status Pipeline

```
Submitted → Screening → Interview Scheduled → Interviewed → 
Technical Test → Reference Check → Offer Made → Hired
                                              ↓
                                          Rejected/Withdrawn
```

## 🔐 Permissions Required

All career management routes require admin authentication:
```javascript
const { authenticateToken } = require('../middleware/auth');
```

Public routes:
- `GET /admin/career/jobs/active` - View active jobs
- `GET /admin/career/jobs/featured` - View featured jobs
- `POST /admin/career/applications/submit` - Submit application

## 📝 Environment Variables

Add to your `.env` file:

```env
# Email Configuration (already configured)
ADMIN_EMAIL=hr@company.com
HR_EMAIL=hr@company.com

# Frontend URL for email links
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000/admin

# File Upload Settings (optional)
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=./uploads
```

## 🎯 Usage Examples

### Creating a New Job

```javascript
const newJob = {
  title: { en: 'Software Engineer', ar: 'مهندس برمجيات' },
  department: 'it',
  category: 'specialist',
  jobType: 'full_time',
  locations: [{ city: 'Riyadh', region: 'Central', isPrimary: true }],
  summary: { en: 'Join our tech team...' },
  // ... other fields
};

const response = await fetch('/admin/career/jobs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newJob)
});
```

### Submitting an Application

```javascript
const formData = new FormData();
formData.append('jobId', jobId);
formData.append('personalInfo', JSON.stringify(personalInfo));
formData.append('cv', cvFile);
formData.append('coverLetter', coverLetterFile);

const response = await fetch('/admin/career/applications/submit', {
  method: 'POST',
  body: formData
});
```

### Scheduling an Interview

```javascript
const interview = {
  type: 'video_call',
  scheduledDate: '2025-11-01',
  scheduledTime: '10:00',
  duration: 60,
  location: {
    type: 'online',
    platform: 'Zoom',
    meetingLink: 'https://zoom.us/j/...'
  }
};

const response = await fetch(`/admin/career/applications/${appId}/schedule-interview`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(interview)
});
```

## 🐛 Troubleshooting

### Issue: Routes not found (404)
**Solution**: Ensure routes are properly registered in `/backend/admin/routes/admin.js`

### Issue: File upload fails
**Solution**: Check upload directory permissions and multer configuration

### Issue: Emails not sending
**Solution**: Verify email service configuration in `/backend/config/mailer.js`

### Issue: Database connection error
**Solution**: Check MongoDB connection string in environment variables

## 🔄 Next Steps & Enhancements

Consider adding:
- [ ] CV parsing and auto-population
- [ ] LinkedIn integration
- [ ] Video interview integration (Zoom/Teams API)
- [ ] Skills assessment platform integration
- [ ] Background check integration
- [ ] Offer letter generation with e-signature
- [ ] Analytics dashboard with charts
- [ ] Email template customization interface
- [ ] Automated candidate scoring
- [ ] Interview calendar sync
- [ ] SMS notifications
- [ ] Multi-language application forms

## 📚 File Structure

```
backend/
├── models/
│   ├── JobOpening.js
│   ├── JobApplication.js
│   └── Interview.js
├── controllers/
│   ├── jobController.js
│   └── applicationController.js
├── routes/
│   ├── jobs.js
│   ├── applications.js
│   └── interviews.js
├── middleware/
│   └── cvUpload.js
├── services/
│   └── emailService.js (updated)
└── scripts/
    └── seedJobs.js

frontend/
├── src/
│   ├── hooks/
│   │   ├── useJobs.js
│   │   ├── useApplications.js
│   │   └── useInterviews.js
│   ├── components/
│   │   ├── Jobs/
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobsList.jsx
│   │   │   ├── JobForm.jsx
│   │   │   ├── AddJobModal.jsx
│   │   │   └── EditJobModal.jsx
│   │   ├── Applications/
│   │   │   ├── ApplicationsTable.jsx
│   │   │   ├── ApplicationCard.jsx
│   │   │   ├── ApplicationDetails.jsx
│   │   │   ├── InterviewScheduler.jsx
│   │   │   └── EvaluationForm.jsx
│   │   └── UI/
│   │       ├── CVViewer.jsx
│   │       └── StatusPipeline.jsx
│   └── pages/
│       ├── JobsManagement.jsx
│       └── ApplicationsManagement.jsx
```

## 🎓 Support & Maintenance

For issues or questions:
1. Check API endpoint responses in browser DevTools
2. Review backend logs for error messages
3. Verify authentication tokens are valid
4. Check database connections

## ✨ Success!

Your comprehensive career management system is now ready to use! Run the seed script to populate default jobs and start managing your recruitment process efficiently.

```bash
# Seed default jobs
node backend/scripts/seedJobs.js

# Start your servers
npm run start  # Or your custom start command
```

Visit `/admin/jobs` to see your job management dashboard!
