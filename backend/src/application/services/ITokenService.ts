export interface ITokenPayload {
    vendorId: string;
}

export interface ITokenService {
    signAccessToken(payload: ITokenPayload): string;
    signRefreshToken(payload: ITokenPayload): string;
    verifyAccessToken(token: string): ITokenPayload;
    verifyRefreshToken(token: string): ITokenPayload;
}