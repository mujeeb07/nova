import { Router } from "express";
import { TokenService } from "../../infrastructure/services/TokenService";
import { authenticate } from "../middlewares/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import { COOKIE_CONFIG } from "../../config/cookie_config";


const authRouter = Router();
const tokenService = new TokenService();

authRouter.get("/me", authenticate(tokenService), (req, res) => {
    sendSuccess(res, { accountId: req.accountId, role: req.role }, "OK");
});

authRouter.get("/logout", (_req, res) => {
    const options = {
        httpOnly: COOKIE_CONFIG.HTTP_ONLY,
        secure: COOKIE_CONFIG.SECURE,
        sameSite: COOKIE_CONFIG.SAME_SITE,
    };
    res.clearCookie("accessToken", options).clearCookie("refreshToken", options);
    sendSuccess(res, null, "Logged out");
});

export default authRouter