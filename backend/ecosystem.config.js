/**
 * PM2 Ecosystem Configuration File
 * This file is used by PM2 process manager to run and manage the Node.js application
 * 
 * Usage:
 * - Start: pm2 start ecosystem.config.js
 * - Stop: pm2 stop nextechhubs-backend
 * - Restart: pm2 restart nextechhubs-backend
 * - Logs: pm2 logs nextechhubs-backend
 * - Monitor: pm2 monit
 */

module.exports = {
    apps: [
        {
            name: 'nextechhubs-backend',
            script: 'server.js',
            instances: 'max', // Use all available CPU cores
            exec_mode: 'cluster', // Enable cluster mode for load balancing
            autorestart: true,
            watch: false, // Disable in production
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                PORT: 5000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            // Logging
            log_file: './logs/combined.log',
            error_file: './logs/error.log',
            out_file: './logs/output.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,
            // Restart Delay
            restart_delay: 4000,
            // Graceful shutdown
            kill_timeout: 5000,
            listen_timeout: 10000,
            // Health monitoring
            min_uptime: '10s',
            max_restarts: 10
        }
    ]
};
