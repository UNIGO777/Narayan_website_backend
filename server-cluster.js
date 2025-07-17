const cluster = require('cluster');
const os = require('os');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const mediaRoutes = require('./routes/media');
const navigationRoutes = require('./routes/navigation');
const contactRoutes = require('./routes/contact');
const socialRoutes = require('./routes/social');
const eventsRoutes = require('./routes/events');
const adminRoutes = require('./routes/admin');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`🚀 Master Process ${process.pid} is running`);
  console.log(`💻 CPU Cores: ${numCPUs}`);
  
  // Fork workers based on CPU cores
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    console.log(`🔄 Worker ${worker.process.pid} started`);
  }

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`💀 Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    console.log('🔄 Starting a new worker...');
    const newWorker = cluster.fork();
    console.log(`✅ New worker ${newWorker.process.pid} started`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Master received SIGTERM, shutting down gracefully');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('🛑 Master received SIGINT, shutting down gracefully');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
    process.exit(0);
  });

} else {
  // Worker process
  const app = express();
  const PORT = process.env.PORT || 5003;

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        childSrc: ["'none'"],
        workerSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        manifestSrc: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
  }));

  // Compression middleware
  app.use(compression());

  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true,
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));

  // Rate limiting - High limits for development to prevent blocking
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000, // Very high limit - 10,000 requests per 15 minutes
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Body parsing middleware
  app.use(express.json({ limit: process.env.JSON_LIMIT || '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: process.env.URL_ENCODED_LIMIT || '10mb' }));

  // Static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      worker: process.pid,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage()
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/navigation', navigationRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/social', socialRoutes);
  app.use('/api/events', eventsRoutes);
  app.use('/api/admin', adminRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(`❌ Worker ${process.pid} - Error:`, err.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      worker: process.pid
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      worker: process.pid
    });
  });

  // MongoDB connection
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  })
  .then(() => {
    console.log(`✅ Worker ${process.pid} - MongoDB connected`);
  })
  .catch(err => {
    console.error(`❌ Worker ${process.pid} - MongoDB connection error:`, err);
    process.exit(1);
  });

  // Start server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} - Server running on port ${PORT}`);
  });

  // Graceful shutdown for workers
  process.on('SIGTERM', () => {
    console.log(`🛑 Worker ${process.pid} received SIGTERM, shutting down gracefully`);
    server.close(() => {
      mongoose.connection.close(() => {
        console.log(`✅ Worker ${process.pid} - Database connection closed`);
        process.exit(0);
      });
    });
  });
} 