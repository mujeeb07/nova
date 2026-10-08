import { Request, Response } from "express";
import { ForgotPasswordUseCase } from "../../../../application/use_cases/shared/auth/ForgotPasswordUseCase";
import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { BadRequestError } from "../../../../utils/errors";
import { VerifyForgotPasswordOtpUseCase } from "../../../../application/use_cases/shared/auth/VerifyForgotPasswordOtpUseCase";
import { CreateNewPasswordUseCase } from "../../../../application/use_cases/shared/auth/CreateNewPasswordUseCase";


export class ForgotPasswordController {
    constructor(
        private _sendOtp: ForgotPasswordUseCase,
        private _verifyOtp: VerifyForgotPasswordOtpUseCase,
        private _createPassword: CreateNewPasswordUseCase
    ) {}

    sendOtp = asyncHandlor(async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) throw new BadRequestError("Email is required");
        await this._sendOtp.execute(email);
        sendSuccess(res, null, "If this email is registered, you'll receive an OTP shortly.");
    });

    verifyOtp = asyncHandlor(async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        if (!email || !otp) throw new BadRequestError("Email and OTP are required");
        const result = await this._verifyOtp.execute(email, otp);
        sendSuccess(res, result, "OTP verified");
    });

    createPassword = asyncHandlor(async (req: Request, res: Response) => {
        const { email, resetToken, newPassword, confirmPassword } = req.body;
        if (!email || !resetToken || !newPassword || !confirmPassword) {
            throw new BadRequestError("All fields are required");
        }
        await this._createPassword.execute(email, resetToken, newPassword, confirmPassword);
        sendSuccess(res, null, "Password updated. Please log in.");
    });
}