import type { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import type { IUserLoginUseCase } from "../../../interfaces/users/IUserUseCase";
import type { IPasswordService } from "../../../services/IPasswordService";
import type { ITokenService } from "../../../services/ITokenService";
import type { UserLoginInputDTO, UserLoginOutputDTO } from "../../../dtos/users/user.dto";
import { AppError } from "../../../../utils/errors/AppError";
export class LoginUserUseCase implements IUserLoginUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordService: IPasswordService,
        private readonly _tokenService: ITokenService
    ) {}

    async execute(input: UserLoginInputDTO): Promise<UserLoginOutputDTO> {
        const user = await this._userRepository.findByEmail(input.email.toLowerCase().trim());

        if (!user || !user.passwordHash) throw new AppError("Invalid email or password", 401);

        const isMatch = await this._passwordService.compare(input.password, user.passwordHash);
        if (!isMatch) throw new AppError("Invalid email or password", 401);

        if (!user.isVerified) throw new AppError("Please verify your email first", 403);
        if (!user.status) throw new AppError("Your account has been blocked. Contact support", 403);

        const accessToken = this._tokenService.signAccessToken({ accountId: user.id, role: "user" });
        const refreshToken = this._tokenService.signRefreshToken({ accountId: user.id, role: "user" });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profileImage: user.profileImage,
                walletBalance: user.walletBalance,
                notifications: user.notifications,
                addresses: user.addresses,
                status: user.status,
            },
        };
    }
}