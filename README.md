# Manpower Supply Company - Full Stack Application

A comprehensive manpower supply company website built with MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Option 1: Automated Setup (Recommended)
```bash
# Make the script executable and run
chmod +x scripts/quick-start.sh
./scripts/quick-start.sh
```

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
# Install all dependencies (backend + frontend)
npm run install-all

# Or install separately:
cd backend && npm install
cd frontend && npm install
```

#### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `backend/.env` with your MongoDB URI

#### 3. Configure Environment
```bash
cd backend
cp env.example .env
# Edit .env file with your configurations
```

#### 4. Start the Application

**Full Stack Application (Recommended):**
```bash
# Start both frontend and backend together
npm start

# Or use the dev command
npm run dev
```

**Individual Servers:**
```bash
# Backend Server only
npm run backend

# Frontend Server only  
npm run frontend

# Or from individual directories
cd backend && npm run dev
cd frontend && npm start
```

**Control Scripts:**
```bash
# Stop all servers
npm run stop

# Restart all servers
npm run restart

# View logs
npm run logs:backend    # Backend logs
npm run logs:frontend   # Frontend logs
```

## 📁 Project Structure

```
company/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   ├── uploads/           # File uploads
│   ├── scripts/           # Database scripts
│   ├── tests/             # Test files
│   └── server.js          # Server entry point
├── frontend/               # React.js frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── scripts/               # Setup and utility scripts
```

## 🔧 Available Scripts

### Root Level Scripts
```bash
npm start           # Start full-stack application (frontend + backend)
npm run dev         # Start full-stack application (frontend + backend)
npm run stop        # Stop all servers
npm run restart     # Restart all servers
npm run backend     # Start backend server only
npm run frontend    # Start frontend server only
npm run backend:watch # Start backend with auto-restart
npm run backend:debug # Start backend in debug mode
npm run install-all # Install all dependencies
npm run test        # Run backend tests
npm run test:api    # Test API endpoints
npm run seed        # Seed database with sample data
npm run backup      # Backup database
npm run cleanup     # Clean up old files
npm run logs:backend # View backend logs
npm run logs:frontend # View frontend logs
npm run setup       # Quick setup script
```

### Backend Scripts (from backend/ directory)
```bash
npm run dev          # Start development server
npm run dev:watch    # Start with Node.js watch mode
npm run dev:debug    # Start in debug mode
npm start           # Start production server
npm test            # Run tests
npm run seed        # Seed database
npm run backup      # Backup database
npm run migrate     # Run database migrations
npm run cleanup     # Clean up old files
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/v1/company` - Get company information
- `GET /api/v1/jobs` - Get job listings
- `POST /api/v1/jobs/:id/apply` - Submit job application
- `GET /api/v1/services` - Get services
- `GET /api/v1/clients` - Get clients
- `GET /api/v1/gallery/images` - Get gallery images
- `POST /api/v1/contact` - Submit contact form
- `GET /api/health` - Health check

### Admin Endpoints (Authentication Required)
- `POST /api/admin/v1/auth/login` - Admin login
- `GET /api/admin/v1/dashboard/stats` - Dashboard analytics
- `GET /api/admin/v1/jobs/postings` - Manage job postings
- `GET /api/admin/v1/jobs/applications` - Manage job applications
- `GET /api/admin/v1/contacts` - Manage contact inquiries
- `POST /api/admin/v1/gallery/upload` - Upload gallery images
- `GET /api/admin/v1/company` - Manage company information
- `GET /api/admin/v1/users` - Manage admin users

## 🔒 Authentication

The application uses JWT-based authentication for admin users.

### Admin Login
```bash
POST /api/admin/v1/auth/login
Content-Type: application/json

{
  "email": "admin@manpowercompany.com",
  "password": "admin123"
}
```

### Default Admin Credentials
- **Email:** admin@manpowercompany.com
- **Password:** admin123

## 🌐 Access URLs

### Development
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **API Health Check:** http://localhost:5001/api/health

### Testing
```bash
# Test API endpoints
npm run test:api

# Test full-stack integration
./test-integration.sh

# Test individual components
curl http://localhost:3000/api/v1/company
curl http://localhost:5001/api/health
```

## 🗄️ Database

### MongoDB Collections
- `companies` - Company information
- `services` - Service offerings
- `clients` - Client portfolio
- `contracts` - Contracts and achievements
- `jobpostings` - Job postings
- `jobapplications` - Job applications
- `galleryimages` - Gallery images
- `contactinquiries` - Contact form submissions
- `adminusers` - Admin users
- `auditlogs` - Admin activity logs

## 🛠️ Development

### Environment Variables
Copy `backend/env.example` to `backend/.env` and configure:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/manpower_db

# JWT
JWT_SECRET=your-secret-key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Testing
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Configure email service
5. Set up file upload service (Cloudinary)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to hosting service (Vercel, Netlify, etc.)
3. Update API endpoints for production

## 📝 Features

### Admin Panel
- Dashboard with analytics
- Job posting management
- Application management
- Contact inquiry management
- Gallery image management
- User management
- Audit logging

### Public Website
- Company information
- Service listings
- Client portfolio
- Job listings and applications
- Contact form
- Gallery
- Multi-language support (English/Arabic)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```bash
# Install and start MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Port 5001 Already in Use:**
```bash
# Kill process using port 5001
lsof -ti:5001 | xargs kill -9
```

**Permission Denied:**
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

## 📞 Support

For support and questions:
- Email: info@manpowercompany.com
- Phone: +966-XX-XXXXXXX
