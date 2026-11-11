import { IAdminRepository } from "../../../../domain/repositories/admin/IAdminRepository";
import { IAdminInvitationStore } from "../../../../domain/repositories/admin/superAdmin/IAdminInvitationStore";
import { IPasswordService } from "../../../services/IPasswordService";
import { AcceptInvitationInputDTO, AcceptInvitationOutputDTO } from "../../../dtos/admin/superAdmin/invitation.dto";
import { ROLE } from "../../../../domain/entities/admins/IAdmin";
import { INVALID_INVITE_MESSAGE } from "./ValidateInvitationUseCase";
import { AppError } from "../../../../utils/errors/AppError";

export class AcceptInvitationUseCase {
    constructor(
        private readonly _adminRepository: IAdminRepository,
        private readonly _store: IAdminInvitationStore,
        private readonly _passwordService: IPasswordService
    ) {}

    async execute(input: AcceptInvitationInputDTO): Promise<AcceptInvitationOutputDTO> {
        const { token, password, confirmPassword } = input;

        if (!token || typeof token !== "string") throw new AppError(INVALID_INVITE_MESSAGE, 400);
        if (!password || password.length < 8) throw new AppError("Password must be at least 8 characters", 400);
        if (password !== confirmPassword) throw new AppError("Passwords do not match", 400);

        // Atomic claim: only one concurrent request can ever receive the invitation.
        const invitation = await this._store.claim(token);
        if (!invitation || new Date(invitation.expiresAt) <= new Date()) {
            throw new AppError(INVALID_INVITE_MESSAGE, 400);
        }

        try {
            if (await this._adminRepository.findByEmail(invitation.email)) {
                throw new AppError("An admin with this email already exists", 409);
            }

            const passwordHash = await this._passwordService.hash(password);

            // Role, permissions and status come only from the trusted Redis data.
            await this._adminRepository.create({
                name: invitation.email.split("@")[0],
                email: invitation.email,
                passwordHash,
                role: ROLE.ADMIN,
                permissions: invitation.permissions,
                status: true,
                lastLoginAt: null,
            });
        } catch (err: any) {
            if (err?.code === 11000) throw new AppError("An admin with this email already exists", 409);
            await this._store.restore(token, invitation).catch(() => undefined); // transient failure: let them retry
            throw err;
        }

        return { email: invitation.email };
    }
}