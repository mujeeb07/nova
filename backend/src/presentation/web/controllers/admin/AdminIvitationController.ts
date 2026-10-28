// presentation/web/controllers/admin/AdminInvitationController.ts
import { Request, Response } from "express";
import { InviteAdminUseCase } from "../../../../application/use_cases/admin/superAdmin/InviteAdminUseCase";
import { ValidateInvitationUseCase } from "../../../../application/use_cases/admin/superAdmin/ValidateInvitationUseCase";
import { AcceptInvitationUseCase } from "../../../../application/use_cases/admin/superAdmin/AcceptInvitationUseCase";
import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { HttpStatus } from "../../../../utils/httpStatus";
import { BadRequestError, UnauthorizedError } from "../../../../utils/errors";

export class AdminInvitationController {
    constructor(
        private _invite: InviteAdminUseCase,
        private _validate: ValidateInvitationUseCase,
        private _accept: AcceptInvitationUseCase
    ) {}

    invite = asyncHandlor(async (req: Request, res: Response) => {
        if (!req.accountId) throw new UnauthorizedError("Not logged in");
        const { email, permissions } = req.body;
        if (!email || !Array.isArray(permissions)) throw new BadRequestError("Email and permissions are required");

        const result = await this._invite.execute({ inviterId: req.accountId, email, permissions });
        sendSuccess(res, result, "Invitation created. The email has been queued for delivery.", HttpStatus.ACCEPTED);
    });

    validate = asyncHandlor(async (req: Request, res: Response) => {
        sendSuccess(res, await this._validate.execute(req.body?.token), "Invitation is valid");
    });

    accept = asyncHandlor(async (req: Request, res: Response) => {
        const { token, password, confirmPassword } = req.body;
        const result = await this._accept.execute({ token, password, confirmPassword });
        sendSuccess(res, result, "Your admin account is ready. Please log in.", HttpStatus.CREATED);
    });
}