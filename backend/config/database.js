const mongoose = require('mongoose');
const dns = require('dns');
const fs = require('fs');
const path = require('path');

// Set DNS servers for Node.js to use Google DNS (fixes Windows DNS SRV issues)
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Create required upload directories on startup
const createUploadDirectories = () => {
    const dirs = [
        'uploads',
        'uploads/contacts',
        'uploads/payslips',
        'uploads/tasks',
        'uploads/projects',
        'uploads/profiles',
        'uploads/documents',
        'logs'
    ];

    dirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Created directory: ${dir}`);
        }
    });
};

const connectDB = async () => {
    try {
        // Create upload directories before connecting
        createUploadDirectories();

        // Check if MONGODB_URI is defined
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not defined in environment variables');
            console.error('💡 Please set MONGODB_URI in your .env file');
            process.exit(1);
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            family: 4, // Force IPv4
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            retryWrites: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('\\n📌 Please ensure MongoDB is running or update MONGODB_URI in .env file');
        console.error('💡 For local MongoDB: Start MongoDB service');
        console.error('💡 For MongoDB Atlas: Visit https://www.mongodb.com/cloud/atlas\\n');

        // In production, exit so PM2 can restart
        if (process.env.NODE_ENV === 'production') {
            console.error('Exiting due to database connection failure...');
            process.exit(1);
        }
    }
};

module.exports = connectDB;
