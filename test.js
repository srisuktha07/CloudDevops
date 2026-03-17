const express = require('express');
const redis = require('redis');

const app = express();

// 1. Correct Configuration Structure
const client = redis.createClient({
    socket: {
        host: 'redis-server', // Fixed typo: 'sever' -> 'server'
        port: 6379
    }
});

client.on('error', (err) => console.log('Redis Error:', err));

async function startApp() {
    // 2. MUST explicitly connect
    await client.connect();
    console.log("Connected to Redis");

    // Initialize visits if it doesn't exist
    const exists = await client.exists('visits');
    if (!exists) {
        await client.set('visits', 0);
    }

    app.get('/', async (req, res) => {
        // 3. Use INCR for atomic updates (no race conditions)
        const visits = await client.incr('visits');
        
        res.send('Number Of Visits is: ' + visits);
    });

    app.listen(8086, "0.0.0.0", () => {
        console.log('Listening on Port 8086');
    });
}

startApp();
