import type { IAdminRepository } from "../../../../domain/repositories/admin/IAdminRepository";
import type { IPasswordService } from "../../../services/IPasswordService";
import type { IAdminLoginUseCase } from "../../../interfaces/admin/IAdminUseCase";
import { AdminLoginInputDTO, AdminLoginOutputDTO } from "../../../dtos/admin/admin.dto";
import { AccountRole, ITokenService } from "../../../services/ITokenService";
import { ForbiddenError, UnauthorizedError } from "../../../../utils/errors";

export class AdminLoginUseCase implements IAdminLoginUseCase {
    constructor(
        private readonly _adminRepository: IAdminRepository,
        private readonly _passwordService: IPasswordService,
        private readonly _tokenService: ITokenService
    ) {};
    async execute(input: AdminLoginInputDTO): Promise<AdminLoginOutputDTO> {
        const admin = await this._adminRepository.findByEmail(input.email);
        if(!admin) throw new UnauthorizedError("Invalid email or password");

        const isPasswordValid = await this._passwordService.compare(input.password, admin.passwordHash);
        if(!isPasswordValid) throw new UnauthorizedError("Invalid email or password");

        if(admin.status === "SUSPENDED") throw new ForbiddenError("Your account has been blocked/suspended");

        await this._adminRepository.update(admin.id, { lastLoginAt: new Date() });

        const role = (admin.role?.toLowerCase() ?? "super_admin") as AccountRole;
        const accessToken = this._tokenService.signAccessToken({ accountId: admin.id, role });
        const refreshToken = this._tokenService.signRefreshToken({ accountId: admin.id, role });

        return {
            accessToken,
            refreshToken,
            admin: { ...admin, role }
        };
    }
}