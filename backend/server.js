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

// CORS Configuration - Allow multiple Vercel deployments
const allowedOrigins = [
    'https://nex-tech-hub.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    /https:\/\/nex-tech-hub.*\.vercel\.app$/ // Allow all Vercel preview deployments
];

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
            callback(null, true); // Allow all origins temporarily for development
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

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

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'NexTechHubs API Server is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
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
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});
