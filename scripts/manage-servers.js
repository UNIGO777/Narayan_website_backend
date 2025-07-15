#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const SERVERS = [
  { name: 'Backend Main', port: 5003, script: 'server.js' },
  { name: 'Backend 5004', port: 5004, script: 'server.js' },
  { name: 'Backend 5005', port: 5005, script: 'server.js' },
  { name: 'Backend 5006', port: 5006, script: 'server.js' },
  { name: 'Load Balancer', port: 5000, script: 'load-balancer.js' }
];

const processes = new Map();

class ServerManager {
  constructor() {
    this.setupSignalHandlers();
  }

  setupSignalHandlers() {
    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT. Shutting down all servers...');
      this.stopAllServers();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM. Shutting down all servers...');
      this.stopAllServers();
      process.exit(0);
    });
  }

  async startServer(serverConfig) {
    return new Promise((resolve, reject) => {
      const env = {
        ...process.env,
        PORT: serverConfig.port,
        NODE_ENV: 'production'
      };

      const serverProcess = spawn('node', [serverConfig.script], {
        cwd: path.join(__dirname, '..'),
        env,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      serverProcess.stdout.on('data', (data) => {
        console.log(`[${serverConfig.name}] ${data.toString().trim()}`);
      });

      serverProcess.stderr.on('data', (data) => {
        console.error(`[${serverConfig.name}] ERROR: ${data.toString().trim()}`);
      });

      serverProcess.on('close', (code) => {
        console.log(`[${serverConfig.name}] Process exited with code ${code}`);
        processes.delete(serverConfig.name);
      });

      serverProcess.on('error', (err) => {
        console.error(`[${serverConfig.name}] Failed to start: ${err.message}`);
        reject(err);
      });

      // Wait a bit to see if the server starts successfully
      setTimeout(() => {
        if (serverProcess.pid) {
          processes.set(serverConfig.name, serverProcess);
          console.log(`✅ [${serverConfig.name}] Started on port ${serverConfig.port} (PID: ${serverProcess.pid})`);
          resolve(serverProcess);
        } else {
          reject(new Error(`Failed to start ${serverConfig.name}`));
        }
      }, 1000);
    });
  }

  async startAllServers() {
    console.log('🚀 Starting all servers...\n');
    
    // Start backend servers first
    const backendServers = SERVERS.filter(s => s.name !== 'Load Balancer');
    
    for (const server of backendServers) {
      try {
        await this.startServer(server);
        await this.sleep(2000); // Wait between server starts
      } catch (error) {
        console.error(`❌ Failed to start ${server.name}:`, error.message);
      }
    }

    // Wait a bit then start load balancer
    await this.sleep(3000);
    
    const loadBalancer = SERVERS.find(s => s.name === 'Load Balancer');
    try {
      await this.startServer(loadBalancer);
    } catch (error) {
      console.error(`❌ Failed to start Load Balancer:`, error.message);
    }

    console.log('\n🎉 All servers started successfully!');
    console.log('📊 Load Balancer URL: http://localhost:5000');
    console.log('🔍 Load Balancer Status: http://localhost:5000/lb-status');
    console.log('📈 Backend Health Check: http://localhost:5000/health');
  }

  stopAllServers() {
    console.log('🛑 Stopping all servers...');
    
    for (const [name, process] of processes) {
      console.log(`🔄 Stopping ${name}...`);
      process.kill('SIGTERM');
    }

    processes.clear();
    console.log('✅ All servers stopped.');
  }

  async restartAllServers() {
    console.log('🔄 Restarting all servers...');
    this.stopAllServers();
    await this.sleep(3000);
    await this.startAllServers();
  }

  async checkServerHealth(port) {
    return new Promise((resolve) => {
      const http = require('http');
      const req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/health',
        method: 'GET',
        timeout: 5000
      }, (res) => {
        resolve(res.statusCode === 200);
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => resolve(false));
      req.end();
    });
  }

  async getServerStatus() {
    console.log('\n📊 Server Status:');
    console.log('─'.repeat(60));

    for (const server of SERVERS) {
      const isRunning = processes.has(server.name);
      const isHealthy = isRunning ? await this.checkServerHealth(server.port) : false;
      
      const status = isRunning && isHealthy ? '✅ RUNNING' : 
                    isRunning && !isHealthy ? '⚠️  UNHEALTHY' : 
                    '❌ STOPPED';
      
      console.log(`${server.name.padEnd(20)} | Port: ${server.port} | ${status}`);
    }
    
    console.log('─'.repeat(60));
    console.log(`Total Servers: ${SERVERS.length} | Running: ${processes.size}`);
  }

  async monitorServers() {
    console.log('📡 Starting server monitoring...');
    
    setInterval(async () => {
      await this.getServerStatus();
    }, 30000); // Check every 30 seconds

    // Initial status
    await this.getServerStatus();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
const command = process.argv[2];
const manager = new ServerManager();

switch (command) {
  case 'start':
    manager.startAllServers();
    break;
  
  case 'stop':
    manager.stopAllServers();
    break;
  
  case 'restart':
    manager.restartAllServers();
    break;
  
  case 'status':
    manager.getServerStatus();
    break;
  
  case 'monitor':
    manager.startAllServers().then(() => {
      manager.monitorServers();
    });
    break;
  
  default:
    console.log(`
🚀 Narayan Gurukul Server Manager

Usage: node manage-servers.js [command]

Commands:
  start     Start all servers (4 backend + 1 load balancer)
  stop      Stop all servers
  restart   Restart all servers
  status    Check server status
  monitor   Start servers and monitor continuously

Examples:
  node manage-servers.js start
  node manage-servers.js monitor
  node manage-servers.js status
    `);
    break;
}

module.exports = ServerManager; 