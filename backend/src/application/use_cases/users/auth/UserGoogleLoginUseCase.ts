import { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import { UnauthorizedError } from "../../../../utils/errors";
import { IGoogleAuthService } from "../../../services/IGoogleAuthService";
import { ITokenService } from "../../../services/ITokenService";

export class UserGoogleLoginUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _googleAuth: IGoogleAuthService,
        private _tokenService: ITokenService
    ) {}

    async execute(googleAccessToken: string) {
        const profile = await this._googleAuth.verifyAccessToken(googleAccessToken);

        let user = await this._userRepository.findByEmail(profile.email);

        if (!user) {
            user = await this._userRepository.create({
                name: profile.name,
                email: profile.email,
                googleId: profile.googleId,
                profileImage: profile.picture ?? "",
                isVerified: true,
            });
        } else {
            if (user.googleId && user.googleId !== profile.googleId) {
                throw new UnauthorizedError("This email is linked to a different Google account");
            }
            if (!user.googleId || !user.isVerified) {
                user = await this._userRepository.update(user.id, {
                    googleId: profile.googleId,
                    isVerified: true,
                }) as typeof user;
            }
        }

        if (!user.status) throw new UnauthorizedError("Your account has been blocked");

        const accessToken = this._tokenService.signAccessToken({ accountId: user.id, role: "user" });
        const refreshToken = this._tokenService.signRefreshToken({ accountId: user.id, role: "user" });

        return {
            user: { id: user.id, name: user.name, email: user.email },
            accessToken,
            refreshToken,
        };
    }
}