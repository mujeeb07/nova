import { Request, Response } from "express";
import { IAdminLoginUseCase } from "../../../../application/interfaces/admin/IAdminUseCase";

import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { BadRequestError } from "../../../../utils/errors";
import { COOKIE_CONFIG } from "../../../../config/cookie_config";

export class AuthController {
    constructor(private _loginAdminUsecase: IAdminLoginUseCase){}
    login = asyncHandlor(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if(!email || !password) throw new BadRequestError("All fields are required");

        const result = await this._loginAdminUsecase.execute({ email: email, password: password });
        res
        .cookie("accessToken", result.accessToken, {
            httpOnly: COOKIE_CONFIG.HTTP_ONLY,
            secure: COOKIE_CONFIG.SECURE,
            sameSite: COOKIE_CONFIG.SAME_SITE,
            maxAge: COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE,
            path: COOKIE_CONFIG.PATH,
        })
        .cookie("refreshToken", result.refreshToken, {
            httpOnly: COOKIE_CONFIG.HTTP_ONLY,
            secure: COOKIE_CONFIG.SECURE,
            sameSite: COOKIE_CONFIG.SAME_SITE,
            maxAge: COOKIE_CONFIG.REFRESH_TOKEN_MAX_AGE,
            path: COOKIE_CONFIG.PATH,
        });
        sendSuccess(res, result, "Login Successful");
    });


}


