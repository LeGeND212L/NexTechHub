const mongoose = require('mongoose');
const dns = require('dns');
const https = require('https');
require('dotenv').config();

console.log('═══════════════════════════════════════════════════════════════');
console.log('🔍 MONGODB ATLAS CONNECTION DIAGNOSTICS');
console.log('═══════════════════════════════════════════════════════════════\n');

const uri = process.env.MONGODB_URI;
console.log('📋 Step 1: Checking Environment Variables');
console.log('─────────────────────────────────────────');
if (!uri) {
    console.log('❌ MONGODB_URI not found in .env file!');
    process.exit(1);
}
console.log('✅ MONGODB_URI exists');
console.log(`   Protocol: ${uri.startsWith('mongodb+srv') ? 'SRV (mongodb+srv)' : 'Standard (mongodb)'}`);
console.log(`   Database: ${uri.split('/')[3]?.split('?')[0] || 'Not specified'}\n`);

// Extract hostname
const hostnameMatch = uri.match(/@([^/]+)\//);
const hostname = hostnameMatch ? hostnameMatch[1] : null;

if (hostname) {
    console.log('📋 Step 2: DNS Resolution Test');
    console.log('─────────────────────────────────────────');

    if (uri.startsWith('mongodb+srv')) {
        const srvRecord = `_mongodb._tcp.${hostname}`;
        console.log(`   Testing SRV lookup: ${srvRecord}`);

        dns.resolveSrv(srvRecord, (err, addresses) => {
            if (err) {
                console.log(`   ❌ SRV DNS lookup FAILED: ${err.code}`);
                console.log(`   💡 This means Node.js cannot resolve the cluster address`);
                console.log(`   💡 Solution: Use standard connection string or fix DNS\n`);
            } else {
                console.log(`   ✅ SRV DNS resolved successfully (${addresses.length} records)`);
                addresses.forEach((addr, i) => {
                    console.log(`      ${i + 1}. ${addr.name}:${addr.port}`);
                });
                console.log('');
            }
            proceedToStep3();
        });
    } else {
        console.log('   ℹ️ Standard connection (no SRV lookup needed)\n');
        proceedToStep3();
    }
} else {
    proceedToStep3();
}

function proceedToStep3() {
    console.log('📋 Step 3: Internet Connectivity Test');
    console.log('─────────────────────────────────────────');

    https.get('https://www.mongodb.com', (res) => {
        if (res.statusCode === 200) {
            console.log('   ✅ Internet connection working');
            console.log('   ✅ Can reach MongoDB domains\n');
        } else {
            console.log(`   ⚠️ Unexpected status: ${res.statusCode}\n`);
        }
        proceedToStep4();
    }).on('error', (err) => {
        console.log('   ❌ Cannot reach internet or MongoDB domains');
        console.log(`   Error: ${err.message}\n`);
        proceedToStep4();
    });
}

function proceedToStep4() {
    console.log('📋 Step 4: MongoDB Connection Attempt');
    console.log('─────────────────────────────────────────');
    console.log('   Attempting to connect...\n');

    const startTime = Date.now();

    mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 10000,
        family: 4
    })
        .then((conn) => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('✅ SUCCESS! MongoDB Connected');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log(`   Host: ${conn.connection.host}`);
            console.log(`   Port: ${conn.connection.port}`);
            console.log(`   Database: ${conn.connection.name}`);
            console.log(`   Time: ${elapsed}s\n`);
            process.exit(0);
        })
        .catch((error) => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('❌ CONNECTION FAILED');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log(`   Error: ${error.message}`);
            console.log(`   Time: ${elapsed}s\n`);

            console.log('🔧 DIAGNOSIS & SOLUTIONS:');
            console.log('─────────────────────────────────────────');

            if (error.message.includes('querySrv ECONNREFUSED')) {
                console.log('❌ Issue: DNS SRV lookup is failing');
                console.log('   Root Cause: Node.js cannot resolve MongoDB cluster address');
                console.log('   Solutions:');
                console.log('   1. Use standard (non-SRV) connection string from Atlas');
                console.log('   2. Change Windows DNS to 8.8.8.8 (Google DNS)');
                console.log('   3. Disable VPN/Firewall temporarily\n');
            }
            else if (error.message.includes('ENOTFOUND')) {
                console.log('❌ Issue: Hostname not found');
                console.log('   Root Cause: Cluster might be deleted or hostname is wrong');
                console.log('   Solutions:');
                console.log('   1. Verify cluster exists in MongoDB Atlas');
                console.log('   2. Get fresh connection string from Atlas\n');
            }
            else if (error.message.includes('Server selection timed out') || error.message.includes('ETIMEDOUT')) {
                console.log('❌ Issue: Connection timeout');
                console.log('   Root Cause: Your IP is NOT whitelisted in Atlas');
                console.log('   Solutions:');
                console.log('   1. Go to Atlas → Network Access');
                console.log('   2. Add your IP or 0.0.0.0/0 (allow all)');
                console.log('   3. Wait 2-3 minutes after adding');
                console.log('   4. Ensure cluster status is "Running"\n');
            }
            else if (error.message.includes('Authentication failed') || error.message.includes('auth')) {
                console.log('❌ Issue: Authentication failed');
                console.log('   Root Cause: Wrong username or password');
                console.log('   Solutions:');
                console.log('   1. Verify username and password in Atlas');
                console.log('   2. Create new database user if needed');
                console.log('   3. Check for special characters in password (need URL encoding)\n');
            }
            else {
                console.log('❌ Issue: Unknown error');
                console.log('   Solutions:');
                console.log('   1. Check Atlas cluster is Running (not paused)');
                console.log('   2. Verify Network Access whitelist');
                console.log('   3. Check database user credentials');
                console.log('   4. Ensure connection string is correct\n');
            }

            console.log('═══════════════════════════════════════════════════════════════\n');
            process.exit(1);
        });
}
