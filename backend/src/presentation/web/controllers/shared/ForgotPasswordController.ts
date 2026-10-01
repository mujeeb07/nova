import { Request, Response } from "express";
import { ForgotPasswordUseCase } from "../../../../application/use_cases/shared/auth/ForgotPasswordUseCase";

import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { BadRequestError } from "../../../../utils/errors";
import { HttpStatus } from "../../../../utils/httpStatus";

export class ForgotPasswordController {
    constructor( private _useCase: ForgotPasswordUseCase ){}
    handle = asyncHandlor( async (req: Request, res: Response) => {
        const { email } = req.body;
        if(!email) throw new BadRequestError("Email is required");

        await this._useCase.execute(email);
        sendSuccess(res, null, "If this email is registered, you'll receive an OTP shortly.");
    });
}