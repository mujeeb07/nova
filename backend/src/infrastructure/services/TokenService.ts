// import jwt, { SignOptions } from "jsonwebtoken";
// import { ITokenService, ITokenPayload } from "../../application/services/ITokenService";
// import { JWT_CONFIG } from "../../config/jwt_config";

// export class TokenService implements ITokenService {
//     singAccessToken(payload: ITokenPayload): string {
//         const options: SignOptions = { expiresIn: JWT_CONFIG.ACCESS_EXPIRY };
//         return jwt.sign(payload, JWT_CONFIG.ACCESS_SECRET, options)
//     }

//     singRefreshToken(payload: ITokenPayload): string {
//         return jwt.sign(payload, JWT_CONFIG.REFRESH_SECRET, {
//             expiresIn: JWT_CONFIG.REFRESH_EXPIRY
//         }); 
//     }

//     verifyAccessToken(token: string): ITokenPayload {
//         try {
//             return jwt.verify(token, JWT_CONFIG.ACCESS_SECRET) as ITokenPayload
//         } catch {
//             throw new Error("Invalid or expired access token.");
//         }
//     }

//     verifyRefreshToken(token: string): ITokenPayload {
//         try {
//             return jwt.verify(token, JWT_CONFIG.REFRESH_SECRET) as ITokenPayload
//         } catch {
//             throw new Error("Invalid or expired refresh token");
//         }
//     }
// }

// infrastructure/services/TokenService.ts
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