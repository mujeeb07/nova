import { IAdminInvitationStore } from "../../../../domain/repositories/admin/superAdmin/IAdminInvitationStore";
import { ValidateInvitationOutputDTO } from "../../../dtos/admin/superAdmin/invitation.dto";
import { AppError } from "../../../../utils/errors/AppError";

export const INVALID_INVITE_MESSAGE = "This invitation is invalid, expired, or has already been used";

export class ValidateInvitationUseCase {
    constructor(private readonly _store: IAdminInvitationStore) {}

    async execute(token: string): Promise<ValidateInvitationOutputDTO> {
        const invitation = token ? await this._store.find(token) : null;
        if (!invitation || new Date(invitation.expiresAt) <= new Date()) {
            throw new AppError(INVALID_INVITE_MESSAGE, 400);
        }
        return { email: invitation.email, expiresAt: invitation.expiresAt };
    }
}