import { Request, Response } from "express";
import { ResetPasswordUseCase } from "../../../../application/use_cases/shared/auth/ResetPasswordUseCase";


import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { BadRequestError } from "../../../../utils/errors";
import { HttpStatus } from "../../../../utils/httpStatus"; 

export class ResetPasswordController {
    constructor(private _useCase: ResetPasswordUseCase) {};

    handle = asyncHandlor(async (req: Request, res: Response): Promise<void> => {
        const { email, otp, newPassword } = req.body;
        if(!email || !otp || !newPassword) {
            throw new BadRequestError("All fields are required.");
        }
        
        await this._useCase.execute(email, otp, newPassword);
        sendSuccess(res, null, "Password reset successful. Please login.");
    });
}