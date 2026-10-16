import { TokenService } from "../../infrastructure/services/TokenService";
import { authenticate } from "./authenticate";

const tokenService = new TokenService();

export const authenticateAdmin = authenticate(tokenService, ["admin", "super_admin"]);
export const authenticateSuperAdmin = authenticate(tokenService, ["super_admin"]);