import { Request, Response} from "express";
import { 
    IVendorLoginUseCase,
    IVendorRegisterUseCase,
    IVendorVerifyOtpUseCase
} from "../../../../application/interfaces/vendors/IVendorUseCase";
import { COOKIE_CONFIG } from "../../../../config/cookie_config";
import { HttpStatus } from "../../../../utils/httpStatus";
import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { BadRequestError } from "../../../../utils/errors";
import { sendSuccess } from "../../../../utils/apiResponse";

export class AuthController {
    constructor(
        private _loginUseCase: IVendorLoginUseCase,
        private _registerUseCase: IVendorRegisterUseCase,
        private _verifyOtpUseCase: IVendorVerifyOtpUseCase,
    ){}

    // login.
    login = asyncHandlor(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if(!email || !password) throw new BadRequestError("All fields are required");

        const result = await this._loginUseCase.execute({ email, password });
        res.cookie("accessToken", result.accessToken, {
            httpOnly: COOKIE_CONFIG.HTTP_ONLY,
            secure: COOKIE_CONFIG.SECURE,
            sameSite: COOKIE_CONFIG.SAME_SITE,
            maxAge: COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE,
            path: COOKIE_CONFIG.PATH,
        }).cookie("refreshToken", result.refreshToken, {
            httpOnly: COOKIE_CONFIG.HTTP_ONLY,
            secure: COOKIE_CONFIG.SECURE,
            sameSite: COOKIE_CONFIG.SAME_SITE,
            maxAge: COOKIE_CONFIG.REFRESH_TOKEN_MAX_AGE,
            path: COOKIE_CONFIG.PATH,
        });
        sendSuccess(res, result, "Login successful.");
    });

    // register.
    register =asyncHandlor(async(req: Request, res: Response) => {
        const { email, password, shopName, ownerName, phone } = req.body;
        if( !email || !password || !shopName || !ownerName || !phone ) {
            throw new BadRequestError("All fields are required");
        }

        const result = await this._registerUseCase.execute({ email, password, shopName, ownerName, phone });
        sendSuccess(res, result, "An otp has been send to the email");
    });

    // verify otp.
    verifyOtp = asyncHandlor(async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        const result = await this._verifyOtpUseCase.execute({ email, otp });
        sendSuccess(res, result, "OTP verified, Please Login.");
    })
}