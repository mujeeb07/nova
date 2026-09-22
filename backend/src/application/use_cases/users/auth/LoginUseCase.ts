import { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { IUserLoginUseCase } from "../../../interfaces/users/IUserUseCase";
import { UserLoginInputDTO, UserLoginOutputDTO } from "../../../dtos/users/user.dto";

export class LoginUserUseCase implements IUserLoginUseCase {
    constructor ( private readonly _userRepository: IUserRepository ) {};

    async execute(input: UserLoginInputDTO): Promise<UserLoginOutputDTO> {
        const user = await this._userRepository.findByEmail(input.email);
        if(!user) {
            throw new Error("invalid email or password");
        }
        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
        if(!isPasswordValid) throw new Error("invalid email or password");
        if(!user.status) {
            throw new Error("something wrong with your account activity");
        }

        const jwtSecret = process.env.JWT_SECRET || "falback_secret_key";
        const accessToken = jwt.sign(
            {
                sub: user.id,
                role: "user",
                tokenType: "access"
            },
            jwtSecret,
            {
                expiresIn: "15m"
            }
        );

        const refreshToken = jwt.sign(
            {
                sub: user.id,
                role: "user",
                tokenType: "refresh"
            },
            jwtSecret,
            {
                expiresIn: "7d"
            }
        );

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
                
            }
        }
    }
}