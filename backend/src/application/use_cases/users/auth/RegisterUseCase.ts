import type { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import type { IUserRegisterUseCase } from "../../../interfaces/users/IUserUseCase";
import type { UserRegisterInputDTO } from "../../../dtos/users/user.dto";
import type { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { IPasswordService } from "../../../services/IPasswordService";
import { generateOtp } from "../../../../utils/generateOtp";
import { sendOtpEmail } from "../../../../infrastructure/services/otp_service";
import { OTP_CONFIG } from "../../../../config/otp_config";
import { BadRequestError, ConflictError } from "../../../../utils/errors";

export class UserRegisterUseCase implements IUserRegisterUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _passwordService: IPasswordService,
        private _keyValueService: IKeyValueRepository
    ) {};

    async execute({ name, email, password }: UserRegisterInputDTO ): Promise<void> {
        if(!name || !email || !password) throw new BadRequestError("All fields are required");

        const existing = await this._userRepository.findByEmail(email);

        if(existing?.status) throw new ConflictError("conflict, user already exist. please login");

        const hashed = await this._passwordService.hash(password); 
        const otp = generateOtp();
        const TTL_SECONDS = Math.floor(OTP_CONFIG.EXPIRY_MS / 1000);

        const pendingUserData = { name, email, password: hashed };
        console.log("user data redis:",pendingUserData)
        // saving the user metadata into redis
        await this._keyValueService.set(
            `otp:register:user:${email}`,
            JSON.stringify({ ...pendingUserData, otp }),
            TTL_SECONDS
        );

        try {
            await sendOtpEmail(email, otp);
        } catch (error: unknown) {
            throw new Error("OTP email failed");
        }
    }
}