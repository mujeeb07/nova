import { AccountRole } from "../../application/services/ITokenService";

declare global {
    namespace Express {
        interface Request {
            accountId?: string;
            role?: string;
        }
    }
}

export {};