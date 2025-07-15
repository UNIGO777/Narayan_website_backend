#!/usr/bin/env node

const http = require('http');
const https = require('https');

class StressTest {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:5000';
    this.concurrency = options.concurrency || 10;
    this.requests = options.requests || 100;
    this.delay = options.delay || 100; // ms between requests
    this.results = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: [],
      responseTimes: [],
      serverDistribution: {},
      startTime: null,
      endTime: null
    };
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const protocol = url.startsWith('https') ? https : http;
      
      const req = protocol.request(url, {
        method: options.method || 'GET',
        timeout: options.timeout || 10000,
        headers: {
          'User-Agent': 'Narayan-Gurukul-Stress-Test',
          'Content-Type': 'application/json',
          ...options.headers
        }
      }, (res) => {
        let data = '';
        
        res.on('data', chunk => data += chunk);
        
        res.on('end', () => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          try {
            const body = JSON.parse(data);
            resolve({
              success: true,
              statusCode: res.statusCode,
              responseTime,
              body,
              server: body.worker || body.loadBalancer || 'unknown'
            });
          } catch (error) {
            resolve({
              success: true,
              statusCode: res.statusCode,
              responseTime,
              body: data,
              server: 'unknown'
            });
          }
        });
      });

      req.on('error', (error) => {
        resolve({
          success: false,
          error: error.message,
          responseTime: Date.now() - startTime
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          error: 'Request timeout',
          responseTime: Date.now() - startTime
        });
      });

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }
      
      req.end();
    });
  }

  async runConcurrentRequests(urls, concurrency) {
    const results = [];
    const promises = [];
    
    for (let i = 0; i < urls.length; i++) {
      const promise = this.makeRequest(urls[i]);
      promises.push(promise);
      
      // Limit concurrency
      if (promises.length >= concurrency) {
        const batchResults = await Promise.all(promises);
        results.push(...batchResults);
        promises.length = 0;
        
        // Small delay between batches
        if (this.delay > 0) {
          await this.sleep(this.delay);
        }
      }
    }
    
    // Handle remaining requests
    if (promises.length > 0) {
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }
    
    return results;
  }

  async testHealthEndpoints() {
    console.log('🔍 Testing health endpoints...\n');
    
    const endpoints = [
      `${this.baseUrl}/health`,
      `${this.baseUrl}/lb-status`,
      `${this.baseUrl}/api/auth/health`,
      `${this.baseUrl}/api/content?limit=1`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const result = await this.makeRequest(endpoint);
        console.log(`${result.success ? '✅' : '❌'} ${endpoint}`);
        console.log(`   Status: ${result.statusCode || 'ERROR'}`);
        console.log(`   Response Time: ${result.responseTime}ms`);
        console.log(`   Server: ${result.server || 'unknown'}`);
        console.log('');
      } catch (error) {
        console.log(`❌ ${endpoint} - ${error.message}`);
      }
    }
  }

  async testLoadBalancing() {
    console.log(`🚀 Starting load balancing test...`);
    console.log(`📊 Requests: ${this.requests}`);
    console.log(`🔄 Concurrency: ${this.concurrency}`);
    console.log(`🌐 Target: ${this.baseUrl}`);
    console.log('');

    // Generate request URLs
    const urls = Array(this.requests).fill().map(() => `${this.baseUrl}/health`);
    
    this.results.startTime = Date.now();
    
    // Run concurrent requests
    const results = await this.runConcurrentRequests(urls, this.concurrency);
    
    this.results.endTime = Date.now();
    
    // Process results
    results.forEach(result => {
      this.results.total++;
      
      if (result.success) {
        this.results.successful++;
        this.results.responseTimes.push(result.responseTime);
        
        // Track server distribution
        const server = result.server || 'unknown';
        this.results.serverDistribution[server] = 
          (this.results.serverDistribution[server] || 0) + 1;
      } else {
        this.results.failed++;
        this.results.errors.push(result.error);
      }
    });
    
    this.displayResults();
  }

  displayResults() {
    const duration = this.results.endTime - this.results.startTime;
    const rps = Math.round((this.results.total / duration) * 1000);
    
    console.log('📈 STRESS TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`Total Requests: ${this.results.total}`);
    console.log(`Successful: ${this.results.successful}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${Math.round((this.results.successful / this.results.total) * 100)}%`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Requests/Second: ${rps}`);
    console.log('');
    
    if (this.results.responseTimes.length > 0) {
      const times = this.results.responseTimes.sort((a, b) => a - b);
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const median = times[Math.floor(times.length / 2)];
      const p95 = times[Math.floor(times.length * 0.95)];
      const p99 = times[Math.floor(times.length * 0.99)];
      
      console.log('⏱️  RESPONSE TIMES');
      console.log('─'.repeat(30));
      console.log(`Average: ${Math.round(avg)}ms`);
      console.log(`Median: ${median}ms`);
      console.log(`95th Percentile: ${p95}ms`);
      console.log(`99th Percentile: ${p99}ms`);
      console.log(`Min: ${Math.min(...times)}ms`);
      console.log(`Max: ${Math.max(...times)}ms`);
      console.log('');
    }
    
    console.log('🔄 LOAD BALANCING DISTRIBUTION');
    console.log('─'.repeat(40));
    Object.entries(this.results.serverDistribution).forEach(([server, count]) => {
      const percentage = Math.round((count / this.results.successful) * 100);
      console.log(`${server}: ${count} requests (${percentage}%)`);
    });
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS');
      console.log('─'.repeat(20));
      const errorCounts = {};
      this.results.errors.forEach(error => {
        errorCounts[error] = (errorCounts[error] || 0) + 1;
      });
      
      Object.entries(errorCounts).forEach(([error, count]) => {
        console.log(`${error}: ${count} times`);
      });
    }
  }

  async testSpecificEndpoints() {
    console.log('🎯 Testing specific API endpoints...\n');
    
    const endpoints = [
      { url: `${this.baseUrl}/api/content`, name: 'Content API' },
      { url: `${this.baseUrl}/api/media`, name: 'Media API' },
      { url: `${this.baseUrl}/api/events`, name: 'Events API' },
      { url: `${this.baseUrl}/api/navigation`, name: 'Navigation API' }
    ];
    
    for (const endpoint of endpoints) {
      console.log(`Testing ${endpoint.name}...`);
      
      const urls = Array(20).fill(endpoint.url);
      const results = await this.runConcurrentRequests(urls, 5);
      
      const successful = results.filter(r => r.success).length;
      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
      
      console.log(`  ✅ Success: ${successful}/20 (${Math.round(successful/20*100)}%)`);
      console.log(`  ⏱️  Avg Response: ${Math.round(avgResponseTime)}ms`);
      console.log('');
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
const args = process.argv.slice(2);
const options = {};

// Parse command line arguments
for (let i = 0; i < args.length; i += 2) {
  const key = args[i]?.replace('--', '');
  const value = args[i + 1];
  
  if (key && value) {
    options[key] = isNaN(value) ? value : parseInt(value);
  }
}

const stressTest = new StressTest(options);

async function main() {
  console.log('🚀 Narayan Gurukul Load Balancer Stress Test\n');
  
  try {
    await stressTest.testHealthEndpoints();
    await stressTest.testLoadBalancing();
    await stressTest.testSpecificEndpoints();
    
    console.log('\n✅ Stress test completed successfully!');
  } catch (error) {
    console.error('❌ Stress test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = StressTest; 