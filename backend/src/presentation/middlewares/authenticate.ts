import { Request, Response, NextFunction } from "express";
import { ITokenService, AccountRole } from "../../application/services/ITokenService";
import { UnAuthorizedError, ForbiddenError } from "../../utils/errors";


export interface AuthenticatedRequest extends Request{
    accountId: string;
    role?: AccountRole;
}

export function authenticate(tokenService: ITokenService, allowedRoles?: AccountRole[]) {
    return(req: Request, res: Response, next: NextFunction): void => {
        const header = req.headers.authorization;
        if(!header?.startsWith("Bearer ")) {
            throw new UnAuthorizedError("Missing or malformed token");
        }

        const token = header.slice("Bearer ".length);
        const payload = tokenService.verifyAccessToken(token);

        if(allowedRoles && !allowedRoles.includes(payload.role)) {
            throw new ForbiddenError("You don't have access to this resource");
        }

        req.accountId = payload.accountId;
        req.role = payload.role;
        next();
    }
}