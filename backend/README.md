# Manpower Company Backend API

Backend API for the Manpower Supply Company website, built with Node.js, Express, and MongoDB.

## Features

- **Company Management**: Complete company information, achievements, and statistics
- **Job Management**: Job postings, applications, and candidate management
- **Contact System**: Contact form handling and inquiry management
- **Gallery Management**: Image uploads and gallery organization
- **Admin Panel**: Secure admin authentication and content management
- **File Uploads**: Cloudinary integration for image and document uploads
- **Email Notifications**: Automated email notifications for various events
- **Multi-language Support**: English and Arabic language support
- **Security**: JWT authentication, rate limiting, and input validation
- **Analytics**: Dashboard with statistics and performance metrics

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Custom logger with file rotation

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-company/manpower-backend.git
   cd manpower-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. **Database Setup**
   - Ensure MongoDB is running
   - Update `MONGODB_URI` in `.env`

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/manpower_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Company Information
COMPANY_NAME=Manpower Supply Company
COMPANY_EMAIL=info@manpowercompany.com
COMPANY_PHONE=+966-XX-XXXXXXX
COMPANY_ADDRESS=Saudi Arabia

# Admin Configuration
ADMIN_EMAIL=admin@manpowercompany.com
ADMIN_PASSWORD=secure-password
ADMIN_NAME=System Administrator

# Frontend URL
FRONTEND_URL=http://localhost:3000

# API Configuration
API_VERSION=v1
API_PREFIX=/api
```

## API Endpoints

### Public Endpoints

- `GET /api/v1/company` - Get company information
- `GET /api/v1/company/stats` - Get company statistics
- `GET /api/v1/jobs` - Get job postings
- `GET /api/v1/jobs/:slug` - Get single job posting
- `POST /api/v1/jobs/:jobId/apply` - Apply for job
- `POST /api/v1/contact/submit` - Submit contact inquiry
- `GET /api/v1/gallery` - Get gallery images

### Admin Endpoints

- `POST /api/admin/v1/auth/login` - Admin login
- `GET /api/admin/v1/dashboard/stats` - Dashboard statistics
- `GET /api/admin/v1/jobs` - Manage job postings
- `GET /api/admin/v1/applications` - Manage job applications
- `GET /api/admin/v1/contacts` - Manage contact inquiries
- `PUT /api/admin/v1/company` - Update company information

## Project Structure

```
manpower-backend/
├── config/                 # Configuration files
│   ├── database.js         # MongoDB connection
│   ├── cloudinary.js       # Cloudinary setup
│   ├── mailer.js          # Email configuration
│   ├── jwt.js             # JWT configuration
│   ├── constants.js       # Application constants
│   └── keys.js            # Environment variables
├── controllers/           # Route controllers
│   ├── admin/            # Admin controllers
│   └── public/           # Public controllers
├── middleware/           # Custom middleware
│   ├── auth.js          # Authentication
│   ├── validation.js    # Input validation
│   ├── errorHandler.js  # Error handling
│   ├── cors.js         # CORS configuration
│   ├── rateLimiter.js  # Rate limiting
│   └── upload.js       # File upload
├── models/              # MongoDB models
├── routes/              # API routes
│   ├── admin/          # Admin routes
│   └── public/         # Public routes
├── services/           # Business logic services
├── utils/             # Utility functions
├── uploads/           # File upload storage
├── logs/             # Application logs
├── scripts/          # Database scripts
├── tests/           # Test files
├── app.js          # Express app configuration
├── server.js       # Server entry point
└── package.json    # Dependencies and scripts
```

## Database Models

- **Company**: Company information and settings
- **Service**: Company services and offerings
- **Client**: Client companies and partnerships
- **Contract**: Contracts and achievements
- **Location**: Business locations
- **Industry**: Industry categories
- **JobPosting**: Job postings and requirements
- **JobApplication**: Job applications and CVs
- **GalleryImage**: Gallery images and metadata
- **ContactInquiry**: Contact form submissions
- **AdminUser**: Admin users and permissions
- **Language**: Supported languages
- **Translation**: Multi-language content
- **AuditLog**: Admin activity tracking

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permission levels
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schema validation
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP security headers
- **Password Hashing**: bcrypt password encryption
- **Audit Logging**: Track admin activities

## File Upload

The application supports file uploads through Cloudinary:

- **Company Logos**: Company branding images
- **Service Icons**: Service category icons
- **Client Logos**: Client company logos
- **Gallery Images**: Company photos and events
- **CVs**: Candidate resumes and documents

## Email Notifications

Automated email notifications for:

- Contact form submissions
- Job applications
- Admin notifications
- Password reset
- Email verification

## Multi-language Support

- English (default)
- Arabic (RTL support)
- Translation management
- Language-specific content

## Development

### Scripts

```bash
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run seed         # Seed database
npm run backup       # Backup database
npm run cleanup      # Cleanup old files
```

### Testing

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
```

### Database Operations

```bash
npm run seed               # Seed database with sample data
npm run backup             # Create database backup
npm run migrate            # Run database migrations
npm run cleanup            # Cleanup old files and logs
```

## Deployment

### Production Setup

1. **Environment Configuration**
   - Set `NODE_ENV=production`
   - Configure production database
   - Set up SSL certificates
   - Configure domain and DNS

2. **Server Requirements**
   - Node.js v18+
   - MongoDB
   - PM2 (process manager)
   - Nginx (reverse proxy)

3. **Deployment Steps**
   ```bash
   # Install dependencies
   npm ci --production
   
   # Build application (if needed)
   npm run build
   
   # Start with PM2
   pm2 start server.js --name manpower-backend
   
   # Setup Nginx
   # Configure reverse proxy to port 5000
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Monitoring and Logging

- **Application Logs**: Structured logging with rotation
- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Request timing and metrics
- **Audit Trail**: Admin activity tracking
- **Health Checks**: System health monitoring

## API Documentation

Complete API documentation is available at:
- Development: `http://localhost:5000/api/docs`
- Production: `https://api.manpowercompany.com/docs`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is proprietary software owned by Manpower Supply Company.

## Support

For support and questions:
- Email: support@manpowercompany.com
- Documentation: https://docs.manpowercompany.com
- Issues: GitHub Issues

## Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Complete backend API
- Admin panel functionality
- File upload system
- Email notifications
- Multi-language support
- Security features
- Documentation
