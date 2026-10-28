import { createHash } from "crypto";
import type { Redis } from "ioredis";
import { IAdminInvitationStore } from "../../../domain/repositories/admin/superAdmin/IAdminInvitationStore";
import { IAdminInvitation } from "../../../domain/entities/admins/superAdmin/IAdminInvitation";

const tokenKey = (token: string) =>
    `invite:admin:token:${createHash("sha256").update(token).digest("hex")}`;
const emailKey = (email: string) => `invite:admin:email:${email}`;

// KEYS[1]=email lock, KEYS[2]=invitation | ARGV[1]=token key, ARGV[2]=json, ARGV[3]=ttl
const CREATE_SCRIPT = `
if redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[3], 'NX') then
  redis.call('SET', KEYS[2], ARGV[2], 'EX', ARGV[3])
  return 1
end
return 0`;

// KEYS[1]=invitation. Read and delete in one atomic step.
const CLAIM_SCRIPT = `
local v = redis.call('GET', KEYS[1])
if v then redis.call('DEL', KEYS[1]) end
return v`;

export class RedisAdminInvitationStore implements IAdminInvitationStore {
    constructor(private readonly _redis: Redis) {}

    async create(token: string, invitation: IAdminInvitation, ttlSeconds: number): Promise<boolean> {
        const key = tokenKey(token);
        const res = await this._redis.eval(
            CREATE_SCRIPT, 2, emailKey(invitation.email), key,
            key, JSON.stringify(invitation), String(ttlSeconds)
        );
        return res === 1;
    }

    async find(token: string): Promise<IAdminInvitation | null> {
        const raw = await this._redis.get(tokenKey(token));
        return raw ? (JSON.parse(raw) as IAdminInvitation) : null;
    }

    async claim(token: string): Promise<IAdminInvitation | null> {
        const raw = (await this._redis.eval(CLAIM_SCRIPT, 1, tokenKey(token))) as string | null;
        if (!raw) return null;
        const invitation = JSON.parse(raw) as IAdminInvitation;
        await this._redis.del(emailKey(invitation.email));
        return invitation;
    }

    async restore(token: string, invitation: IAdminInvitation): Promise<void> {
        const remaining = Math.floor((new Date(invitation.expiresAt).getTime() - Date.now()) / 1000);
        if (remaining <= 0) return;
        await this.create(token, invitation, remaining);
    }

    async revoke(token: string): Promise<void> {
        await this.claim(token);
    }
}