import type { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import type { IUserLoginUseCase } from "../../../interfaces/users/IUserUseCase";
import type { IPasswordService } from "../../../services/IPasswordService";
import type { ITokenService } from "../../../services/ITokenService";
import type { UserLoginInputDTO, UserLoginOutputDTO } from "../../../dtos/users/user.dto";
import { UnauthorizedError, ForbiddenError } from "../../../../utils/errors";

export class LoginUserUseCase implements IUserLoginUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordService: IPasswordService,
        private readonly _tokenService: ITokenService
    ) {}

    async execute(input: UserLoginInputDTO): Promise<UserLoginOutputDTO> {
        const user = await this._userRepository.findByEmail(input.email.toLowerCase().trim());

        if (!user || !user.passwordHash) throw new UnauthorizedError("Invalid email or password");

        const isMatch = await this._passwordService.compare(input.password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedError("Invalid email or password");

        if (!user.isVerified) throw new ForbiddenError("Please verify your email first");
        if (!user.status) throw new ForbiddenError("Your account has been blocked");

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