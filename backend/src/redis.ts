import { createClient } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();
export const redisClient = createClient({
    // password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_URL ?? "localhost",
        // port: 15599
        port: 6379
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect();