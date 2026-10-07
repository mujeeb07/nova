import { Request, Response } from "express";
import { 
    IUserRegisterUseCase,
    IUserLoginUseCase,
    IUserVerifyOtpUseCase
} from "../../../../application/interfaces/users/IUserUseCase";
import { COOKIE_CONFIG } from "../../../../config/cookie_config";
import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { AppError, BadRequestError } from "../../../../utils/errors";
import { sendSuccess } from "../../../../utils/apiResponse";

export class AuthController {
    constructor(
        private _registerUseCase: IUserRegisterUseCase,
        private _loginUseCase: IUserLoginUseCase,
        private _verifyOtpUseCase: IUserVerifyOtpUseCase,
    ) {}

    // REGISTER
    register = asyncHandlor(async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            throw new BadRequestError("All fields are required.")
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

        if(!email || !password)  throw new BadRequestError("Email and Password is required");

        const result = await this._loginUseCase.execute({ email, password });
        res.cookie("accessToken", result.accessToken, {
            httpOnly: COOKIE_CONFIG.HTTP_ONLY,
            secure: COOKIE_CONFIG.SECURE,
            sameSite: COOKIE_CONFIG.SAME_SITE
        }).cookie("refreshToken", result.refreshToken, {
            httpOnly: COOKIE_CONFIG.HTTP_ONLY,
            secure: COOKIE_CONFIG.SECURE,
            sameSite: COOKIE_CONFIG.SAME_SITE
        })
        sendSuccess(res, result, "Login successful");
    });

    // FORGOT_PASSWORD.
    forgotPassword = asyncHandlor(async (req: Request, res: Response) => {
        const { email, otp } = req.body;

        const result = this._verifyOtpUseCase.execute({email, otp})
    })


}