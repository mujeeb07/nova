import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenService, ITokenPayload } from "../../application/services/ITokenService";
import {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRY,
    JWT_REFRESH_EXPIRY,
} from "../../config/jwt_config";

export class TokenService implements ITokenService {
    signAccessToken(payload: ITokenPayload): string {
        const options: SignOptions = { expiresIn: JWT_ACCESS_EXPIRY };
        return jwt.sign(payload, JWT_ACCESS_SECRET, options);
    }

    signRefreshToken(payload: ITokenPayload): string {
        const options: SignOptions = { expiresIn: JWT_REFRESH_EXPIRY };
        return jwt.sign(payload, JWT_REFRESH_SECRET, options);
    }

    verifyAccessToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token, JWT_ACCESS_SECRET) as ITokenPayload;
        } catch {
            throw new Error("Invalid or expired access token.");
        }
    }

    verifyRefreshToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET) as ITokenPayload;
        } catch {
            throw new Error("Invalid or expired refresh token.");
        }
    }
}