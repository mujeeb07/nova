import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

function required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
}

export const JWT_ACCESS_SECRET = required("JWT_ACCESS_SECRET");
export const JWT_REFRESH_SECRET = required("JWT_REFRESH_SECRET");

export const JWT_ACCESS_EXPIRY: NonNullable<SignOptions["expiresIn"]> = "15m";
export const JWT_REFRESH_EXPIRY: NonNullable<SignOptions["expiresIn"]> = "7d";