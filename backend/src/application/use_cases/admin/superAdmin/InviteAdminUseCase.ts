import { IAdminRepository } from "../../../../domain/repositories/admin/IAdminRepository";
import { IAdminInvitationStore } from "../../../../domain/repositories/admin/superAdmin/IAdminInvitationStore";
import { IInviteTokenGenerator } from "../../../services/IInviteTokenGenerator";
import { IAdminInviteMailQueue } from "../../../services/IAdminInviteMailQueue";
import { InviteAdminInputDTO, InviteAdminOutputDTO } from "../../../dtos/admin/superAdmin/invitation.dto"
import { PERMISSIONS, ROLE, STATUS } from "../../../../domain/entities/admins/IAdmin";
import { AppError, BadRequestError, ConflictError, ForbiddenError } from "../../../../utils/errors";
import { HttpStatus } from "../../../../utils/httpStatus";
import { INVITE_CONFIG } from "../../../../config/invite_config";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class InviteAdminUseCase {
    constructor(
        private readonly _adminRepository: IAdminRepository,
        private readonly _store: IAdminInvitationStore,
        private readonly _tokens: IInviteTokenGenerator,
        private readonly _mailQueue: IAdminInviteMailQueue
    ) {}

    async execute(input: InviteAdminInputDTO): Promise<InviteAdminOutputDTO> {
        const email = String(input.email ?? "").toLowerCase().trim();
        if (!EMAIL_RX.test(email)) throw new BadRequestError("A valid email is required");

        const allowed = new Set<string>(Object.values(PERMISSIONS));
        const permissions = [...new Set(input.permissions ?? [])];
        if (permissions.length === 0) throw new BadRequestError("Select at least one permission");
        if (permissions.some((p) => !allowed.has(p))) throw new BadRequestError("Invalid permission selected");

        const inviter = await this._adminRepository.findById(input.inviterId);
        if (!inviter || inviter.role !== ROLE.SUPER_ADMIN || inviter.status !== STATUS.ACTIVE) {
            throw new ForbiddenError("Only an active super admin can invite admins");
        }

        if (await this._adminRepository.findByEmail(email)) {
            throw new ConflictError("An admin with this email already exists");
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
        if (!created) throw new ConflictError("A pending invitation already exists for this email");

        try {
            await this._mailQueue.enqueue({ email, token });
        } catch {
            await this._store.revoke(token).catch(() => undefined);
            throw new AppError("Could not queue the invitation email. Please try again.", HttpStatus.BAD_GATEWAY);
        }

        return { email, expiresAt: invitation.expiresAt, emailStatus: "queued" };
    }
}