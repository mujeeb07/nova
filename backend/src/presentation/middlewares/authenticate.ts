import { Request, Response, NextFunction } from "express";
import { ITokenService, AccountRole } from "../../application/services/ITokenService";
import { UnauthorizedError, ForbiddenError } from "../../utils/errors";

export function authenticate(tokenService: ITokenService, allowedRoles?: AccountRole[]) {
    return(req: Request, res: Response, next: NextFunction): void => {
        const token = req.cookies?.accessToken;
        if (!token) throw new UnauthorizedError("Not logged in");

        let payload;
        try {
            payload = tokenService.verifyAccessToken(token);
        } catch {
            throw new UnauthorizedError("Invalid or expired access token");
        }

        const normalizedRole = payload.role?.toLowerCase() as AccountRole;

        if (allowedRoles && !allowedRoles.map((r) => r.toLowerCase()).includes(normalizedRole)) {
            throw new ForbiddenError("You don't have access to this resource");
        }

        req.accountId = payload.accountId;
        req.role = normalizedRole;
        next();
    }
}