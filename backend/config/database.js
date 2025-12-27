const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('\n📌 Please ensure MongoDB is running or update MONGODB_URI in .env file');
        console.error('💡 For local MongoDB: Start MongoDB service');
        console.error('💡 For MongoDB Atlas: Visit https://www.mongodb.com/cloud/atlas\n');
        process.exit(1);
    }
};

module.exports = connectDB;
