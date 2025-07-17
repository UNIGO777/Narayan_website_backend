#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const generateSecureKey = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const setupEnvironment = () => {
  const envPath = path.join(__dirname, '..', '.env');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('   If you want to regenerate it, please delete the existing file first.');
    return;
  }

  // Generate secure keys
  const jwtSecret = generateSecureKey(64);
  const sessionSecret = generateSecureKey(32);
  
  console.log('🔧 Setting up environment variables...');
  
  const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/narayan-gurukul
MONGODB_TEST_URI=mongodb://localhost:27017/narayan-gurukul-test

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=30d

# Server Configuration
PORT=5003
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174,http://localhost:4173,http://localhost:4174

# Rate Limiting - High limits for development (adjust for production)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=10000
RATE_LIMIT_MAX_REQUESTS=10000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Email Configuration (if needed in future)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@narayangurukul.org

# Admin Configuration
ADMIN_EMAIL=admin@narayangurukul.org
ADMIN_PASSWORD=Admin@123

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=${sessionSecret}

# API Configuration
API_VERSION=v1
API_PREFIX=/api

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:3001
WEBSITE_URL=http://localhost:3000

# MongoDB Cloud Configuration (for production)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/narayan-gurukul?retryWrites=true&w=majority

# SSL/TLS Configuration (for production)
# SSL_KEY_PATH=/path/to/ssl/key.pem
# SSL_CERT_PATH=/path/to/ssl/cert.pem
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment file created successfully!');
    console.log('');
    console.log('📋 Important Notes:');
    console.log('   • JWT_SECRET and SESSION_SECRET have been auto-generated');
    console.log('   • Default admin credentials: admin@narayangurukul.org / Admin@123');
    console.log('   • MongoDB connection: mongodb://localhost:27017/narayan-gurukul');
    console.log('   • Server will run on port 5003');
    console.log('');
    console.log('🔐 Security Reminders:');
    console.log('   • Change default admin password after first login');
    console.log('   • Update MongoDB URI for production');
    console.log('   • Configure email settings for notifications');
    console.log('   • Never commit .env file to version control');
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Start MongoDB: mongod');
    console.log('   2. Install dependencies: npm install');
    console.log('   3. Seed database: npm run seed');
    console.log('   4. Start server: npm start');
    
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment, generateSecureKey }; 