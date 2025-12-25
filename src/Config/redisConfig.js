import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } from '../../utils/constant.js';

export const client = createClient({
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        connectTimeout: 10000
    }
});

client.on('error', (err) => {
    console.error('❌ Redis Client Error:', err.message);
});

client.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

client.on('ready', () => {
    console.log('✅ Redis ready to accept commands');
});

client.connect()
    .then(() => console.log('✅ Redis connection established'))
    .catch((err) => {
        console.error('❌ Failed to connect to Redis:', err.message);
    });
