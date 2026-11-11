import { Router, Request, Response } from "express";
import { TokenService } from "../../infrastructure/services/TokenService";
import { authenticate } from "../middlewares/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import { COOKIE_CONFIG } from "../../config/cookie_config";
import { AccountRole } from "../../application/services/ITokenService";
import { AppError } from "../../utils/errors/AppError";

const authRouter = Router();
const tokenService = new TokenService();

authRouter.get("/me", authenticate(tokenService), (req, res) => {
    sendSuccess(res, { accountId: req.accountId, role: req.role }, "OK");
});

const logoutHandler = (_req: Request, res: Response) => {
    const options = {
        httpOnly: COOKIE_CONFIG.HTTP_ONLY,
        secure: COOKIE_CONFIG.SECURE,
        sameSite: COOKIE_CONFIG.SAME_SITE,
        path: COOKIE_CONFIG.PATH,
    };
    res.clearCookie("accessToken", options).clearCookie("refreshToken", options);
    sendSuccess(res, null, "Logged out");
};

authRouter.post("/logout", logoutHandler);
authRouter.get("/logout", logoutHandler);

authRouter.post("/refresh", (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    // console.log("RefreshToken:", refreshToken)
    if (!refreshToken) {
        throw new AppError("Refresh token missing", 401);
    }

    let payload;
    try {
        payload = tokenService.verifyRefreshToken(refreshToken);
    } catch {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const newAccessToken = tokenService.signAccessToken({
        accountId: payload.accountId,
        role: payload.role.toLowerCase() as AccountRole,
    });

    res.cookie("accessToken", newAccessToken, {
        httpOnly: COOKIE_CONFIG.HTTP_ONLY,
        secure: COOKIE_CONFIG.SECURE,
        sameSite: COOKIE_CONFIG.SAME_SITE,
        maxAge: COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE,
        path: COOKIE_CONFIG.PATH,
    });

    sendSuccess(res, { accessToken: newAccessToken }, "Token refreshed");
});

export default authRouter;