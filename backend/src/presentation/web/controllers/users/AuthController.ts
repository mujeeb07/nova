import { Request, Response } from "express";
import { 
    IUserRegisterUseCase,
    IUserLoginUseCase,
    IUserVerifyOtpUseCase
} from "../../../../application/interfaces/users/IUserUseCase";
import { COOKIE_CONFIG } from "../../../../config/cookie_config";
import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { UserGoogleLoginUseCase } from "../../../../application/use_cases/users/auth/UserGoogleLoginUseCase";
import { AppError } from "../../../../utils/errors/AppError";


export class AuthController {
    constructor(
        private _registerUseCase: IUserRegisterUseCase,
        private _loginUseCase: IUserLoginUseCase,
        private _verifyOtpUseCase: IUserVerifyOtpUseCase,
        private _googleLoginUseCase: UserGoogleLoginUseCase
    ) {}

    // REGISTER
    register = asyncHandlor(async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            throw new AppError("All fields are required.", 400)
        }
        const result = await this._registerUseCase.execute({ name, email, password });
        sendSuccess(res, result, "An otp has been send to the email")
    })

    // MAIL OTP VERFICATION
    verify = asyncHandlor(async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        const result = await this._verifyOtpUseCase.execute({ email, otp });
        sendSuccess(res, result, "OTP verified, Please Login.");
    })

    // LOGIN
    login = asyncHandlor(async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        if(!email || !password)  throw new AppError("Email and Password is required", 400);

        const result = await this._loginUseCase.execute({ email, password });

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
        sendSuccess(res, result, "Login successful");
    });

    // GOOGLE LOGIN.
    googleLogin = asyncHandlor(async (req: Request, res: Response) => {
        const { googleAccessToken } = req.body;
        if (!googleAccessToken) throw new AppError("Google token is required", 400);

        const result = await this._googleLoginUseCase.execute(googleAccessToken);
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

        sendSuccess(res, result, "Login successful");
    });
}