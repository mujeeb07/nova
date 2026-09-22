import { Request, Response } from "express";
import { UserRegisterUseCase } from "../../../../application/use_cases/users/auth/RegisterUseCase";
import { 
    IUserRegisterUseCase,
    IUserLoginUseCase,
    IUserVerifyOtpUseCase
} from "../../../../application/interfaces/users/IUserUseCase";
import { COOKIE_CONFIG } from "../../../../config/cookie_config";

export class AuthController {
    constructor(
        private _registerUseCase: IUserRegisterUseCase,
        private _loginUseCase: IUserLoginUseCase,
        private _verifyOtpUseCase: IUserVerifyOtpUseCase,
    ) {}

    // REGISTER
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password } = req.body;

            if( !name || !email || !password ) {
                res.status(400).json({message:"All fields are required"});
            }

            await this._registerUseCase.execute({ name, email, password});
            res.status(201).json({message:"an otp has been send to the email"})
        } catch (error: any) {
            res.status(401).json({error:error.message || "registration failed"});
        }
    }

    // MAIL OTP VERFICATION
    verify = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, otp } = req.body;
            await this._verifyOtpUseCase.execute({ email, otp });
            res.json({message:"OTP verified, please login"});
        } catch (error: any) {
            res.status(401).json({error:error.message || "otp verification failed"});
        }
    }

    // LOGIN
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if(!email || !password) {
                res.status(400).json({message:"email and password is required"});
            }

            const result = await this._loginUseCase.execute({ email, password });
            res
            .cookie("accessToken", result.accessToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                secure: COOKIE_CONFIG.SECURE,
                sameSite: COOKIE_CONFIG.SAME_SITE
            })
            .cookie("refreshToken", result.refreshToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                secure: COOKIE_CONFIG.SECURE,
                sameSite: COOKIE_CONFIG.SAME_SITE
            })
            .json({message:"logged in successfully"});
        } catch (error: any) {
            console.log("login error: ",error);
            res.status(401).json({error:error.message || "authentication failed"});
        }    
    }

}