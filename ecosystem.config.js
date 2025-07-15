module.exports = {
  apps: [
    {
      name: 'narayan-backend-cluster',
      script: './server-cluster.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5003
      },
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000
    },
    {
      name: 'narayan-backend-5004',
      script: './server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5004
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5004
      },
      max_memory_restart: '1G',
      error_file: './logs/err-5004.log',
      out_file: './logs/out-5004.log',
      log_file: './logs/combined-5004.log',
      time: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000
    },
    {
      name: 'narayan-backend-5005',
      script: './server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5005
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5005
      },
      max_memory_restart: '1G',
      error_file: './logs/err-5005.log',
      out_file: './logs/out-5005.log',
      log_file: './logs/combined-5005.log',
      time: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000
    },
    {
      name: 'narayan-backend-5006',
      script: './server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5006
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5006
      },
      max_memory_restart: '1G',
      error_file: './logs/err-5006.log',
      out_file: './logs/out-5006.log',
      log_file: './logs/combined-5006.log',
      time: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000
    }
  ]
}; 