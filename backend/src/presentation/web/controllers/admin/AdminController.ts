import { Request, Response } from "express";
import { ILoginAdminUseCase } from "../../../../application/interfaces/admin/ILoginAdminUseCase";

import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { BadRequestError } from "../../../../utils/errors";

export class AdminController {
    constructor(private _loginAdminUsecase: ILoginAdminUseCase){}
    login = asyncHandlor(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if(!email || !password) throw new BadRequestError("All fields are required");

        const result = await this._loginAdminUsecase.execute({ email: email, password: password });
        sendSuccess(res, result, "Login Successful");
    })
}