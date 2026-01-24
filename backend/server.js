const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Create HTTP server (needed for Socket.IO)
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// CORS Configuration - Allow Hostinger and development origins
const allowedOrigins = [
    // Production - Hostinger domains
    process.env.FRONTEND_URL,
    'https://nextechubs.com',
    'https://www.nextechubs.com',
    'https://next.nextechubs.com',
    // Legacy Vercel deployments (remove if not needed)
    'https://nex-tech-e7pwupc3h-danishs-projects-3d11e95b.vercel.app',
    'https://nex-tech-hub.vercel.app',
    // Development
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    // Hostinger subdomains pattern
    /https:\/\/.*\.nextechubs\.com$/,
    /https:\/\/nex-tech-.*\.vercel\.app$/ // Allow all Vercel preview deployments
].filter(Boolean); // Remove undefined values

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);

        const normalizedOrigin = typeof origin === 'string' ? origin.replace(/\/$/, '') : origin;

        // Check if origin is in allowed list or matches regex pattern
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(normalizedOrigin);
            }
            return allowedOrigin === normalizedOrigin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            // In production, be strict about CORS
            if (process.env.NODE_ENV === 'production') {
                callback(new Error('Not allowed by CORS'));
            } else {
                callback(null, true); // Allow all origins in development
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Security headers for production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        next();
    });
}

// Trust proxy for Hostinger reverse proxy
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Use 'combined' format in production for better logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Serve uploaded files with proper headers
app.use('/uploads', express.static('uploads', {
    maxAge: '1d',
    etag: true
}));

// Socket.IO setup (real-time updates)
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    }
});

// Make io available in routes via req.app.get('io')
app.set('io', io);

io.use(async (socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(' ')[1] ||
            socket.handshake.query?.token;

        if (!token) {
            return next(new Error('Not authorized'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user || !user.isActive) {
            return next(new Error('Not authorized'));
        }

        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Not authorized'));
    }
});

io.on('connection', (socket) => {
    const user = socket.user;

    // Everyone gets a personal room
    socket.join(`user:${user._id.toString()}`);

    // Admins also join a shared room
    if (user.role === 'admin') {
        socket.join('admins');
    }

    socket.on('disconnect', () => {
        // no-op
    });
});

// Health check route (for monitoring services like UptimeRobot)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Info route
app.get('/', (req, res) => {
    res.json({
        message: 'NexTechHubs API Server is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            health: '/health',
            api: '/api',
            docs: 'Contact admin for API documentation'
        }
    });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    // Stop accepting new connections
    server.close(() => {
        console.log('HTTP server closed.');

        // Close database connection
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    });

    // Force close after 30 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections - log but don't crash immediately
process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION!');
    console.error('Error:', err.name, err.message);
    console.error('Stack:', err.stack);
    // Don't exit in production, just log the error
    // The process manager (PM2) will restart if needed
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION!');
    console.error('Error:', err.name, err.message);
    console.error('Stack:', err.stack);
    // For uncaught exceptions, we should exit but let PM2 restart
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});
