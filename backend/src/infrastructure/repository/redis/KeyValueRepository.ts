import { IKeyValueRepository } from "../../../domain/repositories/key_value/IOtpRepository";
import { redisClient } from "../../db/config/redis_config";

export class KeyValueRepository implements IKeyValueRepository {
    async set(key: string, value: string, ttlSeconds: number): Promise<void> {
        await redisClient.set(key, value, {EX: ttlSeconds});
    }

    async get(key: string): Promise<string | null> {
        return await redisClient.get(key);
    }

    async del(key: string): Promise<void> {
        await redisClient.del(key);
    }
}