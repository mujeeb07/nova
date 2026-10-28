import { IAdminInvitationStore } from "../../../../domain/repositories/admin/superAdmin/IAdminInvitationStore";
import { ValidateInvitationOutputDTO } from "../../../dtos/admin/superAdmin/invitation.dto";
import { NotFoundError } from "../../../../utils/errors";

export const INVALID_INVITE_MESSAGE = "This invitation is invalid, expired, or has already been used";

export class ValidateInvitationUseCase {
    constructor(private readonly _store: IAdminInvitationStore) {}

    async execute(token: string): Promise<ValidateInvitationOutputDTO> {
        const invitation = token ? await this._store.find(token) : null;
        if (!invitation || new Date(invitation.expiresAt) <= new Date()) {
            throw new NotFoundError(INVALID_INVITE_MESSAGE);
        }
        return { email: invitation.email, expiresAt: invitation.expiresAt };
    }
}