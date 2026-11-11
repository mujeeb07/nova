import { Request, Response, NextFunction } from "express";
import { ITokenService, AccountRole } from "../../application/services/ITokenService";
import { AppError } from "../../utils/errors/AppError";

export function authenticate(tokenService: ITokenService, allowedRoles?: AccountRole[]) {

    return(req: Request, res: Response, next: NextFunction): void => {
        const token = req.cookies?.accessToken;

        if (!token) throw new AppError("Not logged in", 401);

        let payload;
        
        try {
            payload = tokenService.verifyAccessToken(token);
        } catch {
            throw new AppError("Invalid or expired access token", 401);
        }

        const normalizedRole = payload.role?.toLowerCase() as AccountRole;

        if (allowedRoles && !allowedRoles.map((r) => r.toLowerCase()).includes(normalizedRole)) {
            throw new AppError("You don't have access to this resource", 403);
        }

        req.accountId = payload.accountId;
        req.role = normalizedRole;
        // console.log("user id:", req.params?.userId, "status:", req.body?.status);
        next();
    }
}