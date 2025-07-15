# Narayan Gurukul Backend API

A comprehensive content management system backend for the Narayan Gurukul website, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Content Management**: Full CRUD operations for website content
- **Media Management**: File upload, image processing, and thumbnail generation
- **User Management**: Authentication, authorization, and role-based access
- **Navigation Management**: Dynamic menu and navigation system
- **Contact Management**: Comprehensive contact information system
- **Social Media Management**: Social media links with analytics
- **Event Management**: Event creation, management, and registration
- **Analytics Dashboard**: Comprehensive statistics and insights
- **RESTful API**: Clean, documented API endpoints
- **Security**: JWT authentication, input validation, and rate limiting

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Image Processing**: Sharp
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Environment Variables

The application uses the following environment variables for configuration:

### Database Configuration
- `MONGODB_URI` - MongoDB connection string (default: `mongodb://localhost:27017/narayan-gurukul`)
- `MONGODB_TEST_URI` - MongoDB test database connection string

### JWT Configuration
- `JWT_SECRET` - Secret key for JWT token generation (auto-generated during setup)
- `JWT_EXPIRE` - JWT token expiration time (default: `30d`)

### Server Configuration
- `PORT` - Server port (default: `5003`)
- `NODE_ENV` - Environment mode (`development`, `production`, `test`)

### CORS Configuration
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins for CORS

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds (default: `900000` - 15 minutes)
- `RATE_LIMIT_MAX` - Maximum requests per window (default: `100`)

### File Upload Configuration
- `MAX_FILE_SIZE` - Maximum file size in bytes (default: `10485760` - 10MB)
- `UPLOAD_DIR` - Directory for uploaded files (default: `uploads`)

### Email Configuration (Optional)
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `EMAIL_FROM` - Default sender email address

### Admin Configuration
- `ADMIN_EMAIL` - Default admin email (default: `admin@narayangurukul.org`)
- `ADMIN_PASSWORD` - Default admin password (default: `Admin@123`)

### Security Configuration
- `BCRYPT_ROUNDS` - Password hashing rounds (default: `12`)
- `SESSION_SECRET` - Session secret key (auto-generated during setup)

### API Configuration
- `API_VERSION` - API version (default: `v1`)
- `API_PREFIX` - API prefix (default: `/api`)

### Frontend URLs
- `FRONTEND_URL` - Admin panel URL (default: `http://localhost:3001`)
- `WEBSITE_URL` - Main website URL (default: `http://localhost:3000`)

### Production Configuration
For production deployment, update these variables:
- Set `NODE_ENV=production`
- Use MongoDB Atlas or production MongoDB server for `MONGODB_URI`
- Generate strong, unique secrets for `JWT_SECRET` and `SESSION_SECRET`
- Configure `ALLOWED_ORIGINS` to your production domain(s)
- Set up SSL/TLS certificates if needed

## 🔧 Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd narayan-gurukul/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   # Quick setup with auto-generated secure keys
   npm run setup
   
   # Or manually copy and edit
   cp .env.example .env
   ```
   
   The `.env` file includes all necessary configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/narayan-gurukul
   
   # JWT Secret (auto-generated during setup)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Server Configuration
   PORT=5003
   NODE_ENV=development
   
   # Admin Configuration
   ADMIN_EMAIL=admin@narayangurukul.org
   ADMIN_PASSWORD=Admin@123
   
   # CORS, Rate Limiting, File Upload, and Security settings
   # See Environment Variables section below for all options
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Seed the database** (optional, for initial data):
   ```bash
   npm run seed
   ```

6. **Start the server**:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5003`

## 📚 API Documentation

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Base URL
```
http://localhost:5003/api
```

### Endpoints Overview

#### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - Create new user (Admin only)
- `GET /me` - Get current user
- `PUT /profile` - Update user profile
- `PUT /password` - Change password
- `GET /users` - Get all users (Admin only)
- `PUT /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

#### Content Management (`/api/content`)
- `GET /` - Get all content
- `GET /sections` - Get content grouped by sections
- `GET /:id` - Get single content by ID
- `GET /slug/:slug` - Get content by slug
- `POST /` - Create new content (Editor+)
- `PUT /:id` - Update content (Editor+)
- `DELETE /:id` - Delete content (Editor+)
- `POST /bulk` - Bulk operations (Editor+)

#### Media Management (`/api/media`)
- `GET /` - Get all media files
- `GET /:id` - Get single media file
- `POST /upload` - Upload media file (Editor+)
- `PUT /:id` - Update media metadata (Editor+)
- `DELETE /:id` - Delete media file (Editor+)
- `POST /bulk-delete` - Bulk delete media (Editor+)

#### Navigation (`/api/navigation`)
- `GET /` - Get navigation menus
- `GET /:id` - Get single navigation menu
- `POST /` - Create navigation menu (Editor+)
- `PUT /:id` - Update navigation menu (Editor+)
- `DELETE /:id` - Delete navigation menu (Editor+)

#### Contact Information (`/api/contact`)
- `GET /` - Get contact information
- `GET /:id` - Get single contact
- `POST /` - Create contact info (Editor+)
- `PUT /:id` - Update contact info (Editor+)
- `DELETE /:id` - Delete contact info (Editor+)

#### Social Media (`/api/social`)
- `GET /` - Get social media links
- `GET /:id` - Get single social link
- `POST /` - Create social link (Editor+)
- `PUT /:id` - Update social link (Editor+)
- `DELETE /:id` - Delete social link (Editor+)
- `POST /:id/click` - Track social link click

#### Events (`/api/events`)
- `GET /` - Get all events
- `GET /upcoming` - Get upcoming events
- `GET /:id` - Get single event
- `GET /slug/:slug` - Get event by slug
- `POST /` - Create event (Editor+)
- `PUT /:id` - Update event (Editor+)
- `DELETE /:id` - Delete event (Editor+)
- `POST /:id/register` - Register for event

#### Admin Dashboard (`/api/admin`)
- `GET /dashboard` - Get dashboard statistics (Editor+)
- `GET /system-info` - Get system information (Admin only)
- `GET /logs` - Get application logs (Admin only)
- `POST /backup` - Create database backup (Admin only)
- `GET /analytics` - Get detailed analytics (Editor+)

### Content Sections

The content management system supports the following sections:

- `hero-home` - Home page hero section
- `hero-about` - About page hero section
- `hero-donations` - Donations page hero section
- `hero-events` - Events page hero section
- `about-us` - About us content
- `our-guruji` - Our Guruji information
- `spiritual-growth` - Spiritual growth content
- `temple-history` - Temple history
- `services` - Services information
- `donations-info` - Donations information
- `events-list` - Events listing
- `contact-info` - Contact information
- `footer-text` - Footer content
- `navbar-text` - Navigation text
- `general` - General content

### User Roles

- **Admin**: Full access to all features
- **Editor**: Can manage content, media, events, navigation, contact, and social media
- **Viewer**: Read-only access (not implemented in routes)

### Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Validation errors (if any)
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📁 Project Structure

```
backend/
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   ├── User.js          # User model
│   ├── Content.js       # Content model
│   ├── Media.js         # Media model
│   ├── Navigation.js    # Navigation model
│   ├── Contact.js       # Contact model
│   ├── Social.js        # Social media model
│   └── Event.js         # Event model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── content.js       # Content management routes
│   ├── media.js         # Media management routes
│   ├── navigation.js    # Navigation routes
│   ├── contact.js       # Contact routes
│   ├── social.js        # Social media routes
│   ├── events.js        # Event routes
│   └── admin.js         # Admin dashboard routes
├── scripts/
│   └── seed.js          # Database seeding script
├── uploads/             # File upload directory
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers
- File upload restrictions

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-very-secure-jwt-secret
PORT=5003
```

### PM2 Process Manager (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start server.js --name "narayan-gurukul-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 📊 Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'editor', 'viewer'],
  avatar: String,
  isActive: Boolean,
  lastLogin: Date,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Content Collection
```javascript
{
  title: String,
  slug: String (unique),
  section: String,
  content: String,
  excerpt: String,
  images: [Object],
  videos: [Object],
  metadata: Object,
  customFields: Map,
  isPublished: Boolean,
  publishedAt: Date,
  order: Number,
  author: ObjectId,
  lastModifiedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Commit your changes
6. Push to the branch
7. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@narayangurukul.org or create an issue in the repository.

## 📞 Health Check

Check if the server is running:
```bash
curl http://localhost:5003/api/health
```

Response:
```json
{
  "message": "Narayan Gurukul Backend API is running",
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔄 API Examples

### Login
```bash
curl -X POST http://localhost:5003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@narayangurukul.org",
    "password": "Admin@123"
  }'
```

### Create Content
```bash
curl -X POST http://localhost:5003/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Sample Content",
    "content": "<p>This is sample content</p>",
    "section": "general",
    "isPublished": true
  }'
```

### Upload Media
```bash
curl -X POST http://localhost:5003/api/media/upload \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@/path/to/image.jpg" \
  -F "subcategory=general" \
  -F "alt=Sample image"
``` 