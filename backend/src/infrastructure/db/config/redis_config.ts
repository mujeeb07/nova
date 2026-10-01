import { createClient, RedisClientType } from 'redis';

export const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("connect", () => console.log('🚀 Successfully connected to Redis Cloud!'));
redisClient.on("error", (err) => console.error('❌ Redis Cloud Connection Error:', err));

export async function connectRedis(): Promise<void> {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error('Failed to initiate connection to Redis Cloud:', error);
    }
}
