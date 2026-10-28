import IORedis from "ioredis";

// Log this to see exactly what string your app sees during startup
console.log("🔍 Checking REDIS_URL during queue initialization:", process.env.REDIS_URL ? "FOUND ✅" : "MISSING ❌");

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  // If it falls back here, it proves your environment configuration tool isn't loaded yet!
  console.warn("⚠️ REDIS_URL is not defined! Falling back to localhost.");
}

const parsedUrl = new URL(redisUrl || 'redis://127.0.0.1:6379');

export const connection = new IORedis({
  host: parsedUrl.hostname,
  port: Number(parsedUrl.port) || 6379,
  username: parsedUrl.username || undefined,
  password: parsedUrl.password || undefined,
  maxRetriesPerRequest: null,
});
