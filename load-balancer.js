const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.LOAD_BALANCER_PORT || 5000;

// Enable CORS
app.use(cors({
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
}));

// Backend server instances
const servers = [
  { url: 'http://localhost:5003', active: true, requests: 0 },
  { url: 'http://localhost:5004', active: true, requests: 0 },
  { url: 'http://localhost:5005', active: true, requests: 0 },
  { url: 'http://localhost:5006', active: true, requests: 0 }
];

let currentServerIndex = 0;

// Health check function
const checkServerHealth = async (server) => {
  try {
    const response = await fetch(`${server.url}/health`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Health check all servers periodically
setInterval(async () => {
  for (const server of servers) {
    const isHealthy = await checkServerHealth(server);
    if (server.active !== isHealthy) {
      server.active = isHealthy;
      console.log(`🔄 Server ${server.url} is now ${isHealthy ? 'ACTIVE' : 'INACTIVE'}`);
    }
  }
}, 30000); // Check every 30 seconds

// Get next available server (Round Robin)
const getNextServer = () => {
  const activeServers = servers.filter(server => server.active);
  
  if (activeServers.length === 0) {
    throw new Error('No active servers available');
  }
  
  const server = activeServers[currentServerIndex % activeServers.length];
  currentServerIndex++;
  server.requests++;
  
  return server;
};

// Get server with least requests (Least Connection)
const getLeastConnectionServer = () => {
  const activeServers = servers.filter(server => server.active);
  
  if (activeServers.length === 0) {
    throw new Error('No active servers available');
  }
  
  const server = activeServers.reduce((prev, current) => 
    prev.requests < current.requests ? prev : current
  );
  
  server.requests++;
  return server;
};

// Load balancer status endpoint
app.get('/lb-status', (req, res) => {
  res.json({
    success: true,
    loadBalancer: {
      port: PORT,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    },
    servers: servers.map(server => ({
      url: server.url,
      active: server.active,
      requests: server.requests
    }))
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Load balancer is running',
    activeServers: servers.filter(s => s.active).length,
    totalServers: servers.length
  });
});

// Proxy configuration with load balancing
const proxyOptions = {
  target: 'http://localhost:5003', // Default target
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  timeout: 30000,
  proxyTimeout: 30000,
  
  // Router function for load balancing
  router: (req) => {
    try {
      // Use least connection strategy for better load distribution
      const server = getLeastConnectionServer();
      console.log(`📨 Routing ${req.method} ${req.url} to ${server.url}`);
      return server.url;
    } catch (error) {
      console.error('❌ Load balancer error:', error.message);
      return 'http://localhost:5003'; // Fallback
    }
  },
  
  // Handle errors
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Backend server error',
      error: err.message
    });
  },
  
  // Log requests
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying ${req.method} ${req.url}`);
  },
  
  // Handle responses
  onProxyRes: (proxyRes, req, res) => {
    // Decrement request count when response is complete
    proxyRes.on('end', () => {
      const serverUrl = proxyRes.req.agent?.protocol + '//' + proxyRes.req._headers?.host;
      const server = servers.find(s => s.url === serverUrl);
      if (server && server.requests > 0) {
        server.requests--;
      }
    });
  }
};

// Apply proxy middleware to all routes
app.use('/api', createProxyMiddleware(proxyOptions));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Load balancer error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Load balancer error',
    error: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Load balancer: Route not found'
  });
});

// Start load balancer
app.listen(PORT, () => {
  console.log(`🚀 Load Balancer running on port ${PORT}`);
  console.log(`📊 Distributing requests across ${servers.length} backend servers`);
  console.log(`🔄 Load balancing strategy: Least Connection`);
  
  // Initial health check
  setTimeout(async () => {
    console.log('🔍 Performing initial health check...');
    for (const server of servers) {
      const isHealthy = await checkServerHealth(server);
      server.active = isHealthy;
      console.log(`${isHealthy ? '✅' : '❌'} Server ${server.url} is ${isHealthy ? 'ACTIVE' : 'INACTIVE'}`);
    }
  }, 2000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Load balancer received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Load balancer received SIGINT, shutting down gracefully');
  process.exit(0);
});

module.exports = app; 