// presentation/http/controllers/vendors/VendorOnboardingController.ts
import { Request, Response } from "express";
import type { IVendorCompleteOnboardingUseCase } from "../../../../application/interfaces/vendors/IVendorUseCase";
import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { AppError } from "../../../../utils/errors/AppError";

export class VendorOnboardingController {
    constructor(private readonly _completeOnboardingUseCase: IVendorCompleteOnboardingUseCase) {}
    
    complete = asyncHandlor(async (req: Request, res: Response) => {
        // console.log("req.user:", (req as any).user);
        // console.log("req.auth:", (req as any).auth);
        // console.log("req.account:", (req as any).account);
        // console.log("req.accountId:", (req as any).accountId);
        // console.log("res.locals:", res.locals);
        // console.log("cookies:", Object.keys(req.cookies ?? {}));
        const vendorId = req.accountId;
        if (!vendorId) throw new AppError("Unauthorized", 401);

        const result = await this._completeOnboardingUseCase.execute({
            ...req.body,
            vendorId,
        });
        sendSuccess(res, result, "Store setup submitted for review");
    });
}