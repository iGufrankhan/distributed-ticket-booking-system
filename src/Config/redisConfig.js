import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } from '../../utils/constant.js';

export const client = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    connectTimeout: 10000,
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
