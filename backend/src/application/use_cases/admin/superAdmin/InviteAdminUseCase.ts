import { IAdminRepository } from "../../../../domain/repositories/admin/IAdminRepository";
import { IAdminInvitationStore } from "../../../../domain/repositories/admin/superAdmin/IAdminInvitationStore";
import { IInviteTokenGenerator } from "../../../services/IInviteTokenGenerator";
import { IAdminInviteMailQueue } from "../../../services/IAdminInviteMailQueue";
import { InviteAdminInputDTO, InviteAdminOutputDTO } from "../../../dtos/admin/superAdmin/invitation.dto"
import { PERMISSIONS, ROLE } from "../../../../domain/entities/admins/IAdmin";
import { INVITE_CONFIG } from "../../../../config/invite_config";
import { isValidEmail } from "../../../../utils/listFilter";
import { AppError } from "../../../../utils/errors/AppError";

export class InviteAdminUseCase {
    constructor(
        private readonly _adminRepository: IAdminRepository,
        private readonly _store: IAdminInvitationStore,
        private readonly _tokens: IInviteTokenGenerator,
        private readonly _mailQueue: IAdminInviteMailQueue
    ) {}

    async execute(input: InviteAdminInputDTO): Promise<InviteAdminOutputDTO> {
        const email = String(input.email ?? "").toLowerCase().trim();
        if (!isValidEmail(email)) throw new AppError("A valid email is required", 400);

        const allowed = new Set<string>(Object.values(PERMISSIONS));
        const permissions = [...new Set(input.permissions ?? [])];
        if (permissions.length === 0) throw new AppError("Select at least one permission", 400);
        if (permissions.some((p) => !allowed.has(p))) throw new AppError("Invalid permission selected", 400);

        const inviter = await this._adminRepository.findById(input.inviterId);
        if (!inviter || inviter.role !== ROLE.SUPER_ADMIN || !inviter.status) {
            throw new AppError("Only an active super admin can invite admins", 403);
        }

        if (await this._adminRepository.findByEmail(email)) {
            throw new AppError("An admin with this email already exists", 409);
        }

        const token = this._tokens.generate();
        const now = Date.now();
        const invitation = {
            email,
            permissions,
            invitedBy: inviter.id,
            createdAt: new Date(now).toISOString(),
            expiresAt: new Date(now + INVITE_CONFIG.TTL_SECONDS * 1000).toISOString(),
        };

        const created = await this._store.create(token, invitation, INVITE_CONFIG.TTL_SECONDS);
        if (!created) throw new AppError("A pending invitation already exists for this email", 409);

        try {
            await this._mailQueue.enqueue({ email, token });
        } catch {
            await this._store.revoke(token).catch(() => undefined);
        }
        
        return { email, expiresAt: invitation.expiresAt, emailStatus: "queued" };
    }
}