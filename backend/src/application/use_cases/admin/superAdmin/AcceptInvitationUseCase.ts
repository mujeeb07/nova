// application/use_cases/admin/invitations/AcceptInvitationUseCase.ts
import { IAdminRepository } from "../../../../domain/repositories/admin/IAdminRepository";
import { IAdminInvitationStore } from "../../../../domain/repositories/admin/superAdmin/IAdminInvitationStore";
import { IPasswordService } from "../../../services/IPasswordService";
import { AcceptInvitationInputDTO, AcceptInvitationOutputDTO } from "../../../dtos/admin/superAdmin/invitation.dto";
import { ROLE, STATUS } from "../../../../domain/entities/admins/IAdmin";
import { BadRequestError, ConflictError, NotFoundError } from "../../../../utils/errors";
import { INVALID_INVITE_MESSAGE } from "./ValidateInvitationUseCase";

export class AcceptInvitationUseCase {
    constructor(
        private readonly _adminRepository: IAdminRepository,
        private readonly _store: IAdminInvitationStore,
        private readonly _passwordService: IPasswordService
    ) {}

    async execute(input: AcceptInvitationInputDTO): Promise<AcceptInvitationOutputDTO> {
        const { token, password, confirmPassword } = input;

        if (!token || typeof token !== "string") throw new NotFoundError(INVALID_INVITE_MESSAGE);
        if (!password || password.length < 8) throw new BadRequestError("Password must be at least 8 characters");
        if (password !== confirmPassword) throw new BadRequestError("Passwords do not match");

        // Atomic claim: only one concurrent request can ever receive the invitation.
        const invitation = await this._store.claim(token);
        if (!invitation || new Date(invitation.expiresAt) <= new Date()) {
            throw new NotFoundError(INVALID_INVITE_MESSAGE);
        }

        try {
            if (await this._adminRepository.findByEmail(invitation.email)) {
                throw new ConflictError("An admin with this email already exists");
            }

            const passwordHash = await this._passwordService.hash(password);

            // Role, permissions and status come only from the trusted Redis data.
            await this._adminRepository.create({
                name: invitation.email.split("@")[0],
                email: invitation.email,
                passwordHash,
                role: ROLE.ADMIN,
                permissions: invitation.permissions,
                status: STATUS.ACTIVE,
                lastLoginAt: null,
            });
        } catch (err: any) {
            if (err instanceof ConflictError) throw err;                        // invitation stays consumed
            if (err?.code === 11000) throw new ConflictError("An admin with this email already exists");
            await this._store.restore(token, invitation).catch(() => undefined); // transient failure: let them retry
            throw err;
        }

        return { email: invitation.email };
    }
}