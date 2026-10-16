export type AccountRole = "vendor" | "user" | "super_admin" | "admin";

export interface ITokenPayload {
    accountId: string;
    role: AccountRole;
}

export interface ITokenService {
    signAccessToken(payload: ITokenPayload): string;
    signRefreshToken(payload: ITokenPayload): string;
    verifyAccessToken(token: string): ITokenPayload;
    verifyRefreshToken(token: string): ITokenPayload;
}