import type { IAdminRepository } from "../../../../domain/repositories/admin/IAdminRepository";
import type { IPasswordService } from "../../../services/IPasswordService";
import type { ITokenService } from "../../../services/ITokenService";
import type { IAdminLoginUseCase } from "../../../interfaces/admin/IAdminUseCase";
import type { AdminLoginInputDTO, AdminLoginOutputDTO } from "../../../dtos/admin/admin.dto";
import { AppError } from "../../../../utils/errors/AppError";

export class AdminLoginUseCase implements IAdminLoginUseCase {
    constructor(
        private readonly _adminRepository: IAdminRepository,
        private readonly _passwordService: IPasswordService,
        private readonly _tokenService: ITokenService,
    ) {}

    async execute(input: AdminLoginInputDTO): Promise<AdminLoginOutputDTO> {

        const admin = await this._adminRepository.findByEmail(input.email);

        if (!admin) throw new AppError("Invalid Email or password", 400);

        const isPasswordValid = await this._passwordService.compare(input.password, admin.passwordHash);

        if (!isPasswordValid) throw new AppError("Invalid Email or password", 400);

        if(!admin.status) throw new AppError("Admin is suspended / blocked", 400);

        await this._adminRepository.update(admin.id, {lastLoginAt: new Date()})
        const role = admin.role;
        const payload = { accountId: admin.id, role: admin.role };
        return {
            accessToken: this._tokenService.signAccessToken(payload),
            refreshToken: this._tokenService.signRefreshToken(payload),
            admin: {...admin,  role},
        };
    }
}