import { Request, Response } from "express";
import { LoginAdminUseCase } from "../../../../application/use_cases/admin/auth/LoginAdminUseCase";
import { AdminRepository } from "../../../../infrastructure/repository/admin/AdminRepository";
import { ILoginAdminUseCase } from "../../../../application/interfaces/admin/ILoginAdminUseCase";


export class AdminController {
    constructor(
        private _loginAdminUsecase: ILoginAdminUseCase,
        
    ){}

    async login(req: Request, res: Response): Promise<void> {

        try {
            const { email, password } = req.body;
            console.log("req body: ",req.body);
            if(!email || !password) {
                res.status(400).json({message:"Email and Password are required"});
                return;
            }

            const result = await this._loginAdminUsecase.execute({ email: email, password: password });
            console.log("Result: ",result);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({error:error.message || "authentication failed"});
        }
    }
}