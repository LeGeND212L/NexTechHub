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
 * 
 * Note: Using single instance (fork mode) because Socket.IO requires sticky sessions
 * If you need cluster mode with Socket.IO, you need to use Redis adapter
 */

module.exports = {
    apps: [
        {
            name: 'nextechhubs-backend',
            script: 'server.js',
            instances: 1, // Single instance for Socket.IO compatibility
            exec_mode: 'fork', // Fork mode (not cluster) for Socket.IO
            autorestart: true,
            watch: false, // Disable in production
            max_memory_restart: '500M', // Restart if memory exceeds 500MB
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
            // Restart Delay - wait 4 seconds before restarting
            restart_delay: 4000,
            // Graceful shutdown - wait 5 seconds for connections to close
            kill_timeout: 5000,
            listen_timeout: 10000,
            // Health monitoring
            min_uptime: '10s',
            max_restarts: 10,
            // Exponential backoff restart delay
            exp_backoff_restart_delay: 100
        }
    ]
};
