import { createClient } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();
const host = process.env.REDIS_URL ?? "localhost";

// Redis Cloud endpoints embed their port in the hostname (redis-11737.<...>),
// and they never listen on 6379. Falling back to 6379 there makes node-redis
// queue every command against a port that silently drops connections, so any
// request touching Redis hangs forever instead of failing.
const portFromHost = /^redis-(\d+)\./.exec(host)?.[1];

const resolvePort = (): number => {
    const configured = parseInt(process.env.REDIS_PORT ?? "", 10);
    if (!isNaN(configured)) return configured;
    if (portFromHost) return parseInt(portFromHost, 10);
    return 6379;
};

export const redisClient = createClient({
    password: process.env.REDIS_PASS,
    username: "default",
    socket: {
        host,
        port: resolvePort()
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect();