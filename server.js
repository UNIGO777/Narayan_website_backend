const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - Disabled for development to prevent blocking
// If you want to enable it in production, uncomment the lines below
/*
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
*/

// Alternative: Very high limits for development (uncomment if you want some protection)
const limiter = rateLimit({
  windowMs:  15 * 60 * 1000, // 15 minutes
  max:  10000, // Very high limit - 10,000 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// CORS configuration
const corsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_FILE_SIZE || '10mb' }));

// Serve uploaded files
app.use('/uploads', cors({
  origin: '*',
  methods: ['GET']
}), express.static(path.join(__dirname, 'uploads')));

// MongoDB connection (optional for development)
let isMongoConnected = false;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/narayan-gurukul', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isMongoConnected = true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('🔄 Continuing without MongoDB (using mock data)...');
    isMongoConnected = false;
  }
};

// Connect to MongoDB (non-blocking)
connectDB();

// Add middleware to inject MongoDB connection status
app.use((req, res, next) => {
  req.isMongoConnected = isMongoConnected;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/media', require('./routes/media'));
app.use('/api/navigation', require('./routes/navigation'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/social', require('./routes/social'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));

// New section routes
app.use('/api/hero-section', require('./routes/heroSection'));
app.use('/api/about-us', require('./routes/aboutUs'));
app.use('/api/what-we-offer', require('./routes/whatWeOffer'));
app.use('/api/our-guruji', require('./routes/ourGuruji'));
app.use('/api/rakt-daan', require('./routes/raktDaan'));
app.use('/api/sharm-daan', require('./routes/sharmDaan'));
app.use('/api/anya-daan', require('./routes/anyaDaan'));
app.use('/api/spiritual-growth', require('./routes/spiritualGrowth'));
app.use('/api/temple-history', require('./routes/templeHistory'));
app.use('/api/books', require('./routes/books'));
app.use('/api/maharaj-tapostal-places', require('./routes/maharajTapostalPlaces'));
app.use('/api/vip-visits', require('./routes/vipVisits'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Narayan Gurukul Backend API is running',
    status: 'healthy',
    mongodb: isMongoConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`🚀 Narayan Gurukul Backend running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 