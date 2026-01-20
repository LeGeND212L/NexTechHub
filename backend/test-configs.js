const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection with different configurations...\n');

const testConfigs = [
    {
        name: 'Current config (with replicaSet)',
        uri: process.env.MONGODB_URI
    },
    {
        name: 'Without replicaSet parameter',
        uri: process.env.MONGODB_URI.replace(/&replicaSet=[^&]+/, '')
    },
    {
        name: 'Single host only',
        uri: `mongodb://233606_db_user:tbOI310rVM5w5l2p@ac-cz2ithl-shard-00-00.qfsavlm.mongodb.net:27017/nextechhubs?ssl=true&authSource=admin`
    }
];

async function testConnection(config) {
    console.log(`\n🔹 Testing: ${config.name}`);
    console.log(`   URI: ${config.uri.substring(0, 50)}...`);

    try {
        const conn = await mongoose.connect(config.uri, {
            serverSelectionTimeoutMS: 15000,
            family: 4
        });

        console.log(`   ✅ SUCCESS! Connected to: ${conn.connection.host}`);
        await mongoose.disconnect();
        return true;
    } catch (error) {
        console.log(`   ❌ FAILED: ${error.message}`);
        try { await mongoose.disconnect(); } catch (e) { }
        return false;
    }
}

async function runTests() {
    for (const config of testConfigs) {
        const success = await testConnection(config);
        if (success) {
            console.log(`\n✅ Found working configuration: ${config.name}`);
            console.log(`\nUpdate your .env with this URI:\n${config.uri}\n`);
            process.exit(0);
        }
    }

    console.log('\n❌ All configurations failed. Please check:');
    console.log('1. Cluster is Running (not paused) in Atlas');
    console.log('2. Wait 5 minutes after restarting cluster');
    console.log('3. Verify username/password are correct');
    process.exit(1);
}

runTests();
