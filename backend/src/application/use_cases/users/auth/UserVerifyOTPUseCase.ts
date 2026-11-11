import type { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import type { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { IUserVerifyOtpUseCase } from "../../../interfaces/users/IUserUseCase";
import { UserVerifyOtpInputDTO } from "../../../dtos/users/user.dto";
import { AppError } from "../../../../utils/errors/AppError";

export class UserVerifyOtpUseCase implements IUserVerifyOtpUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _keyValueRepository: IKeyValueRepository
    ){}

    async execute(input:UserVerifyOtpInputDTO): Promise<void> {
        const { email, otp } = input;

        let userData = await this._keyValueRepository.get(`otp:register:user:${email}`) as any;
     
        if(userData){
            userData = JSON.parse(userData)
        }
        const userInputOtp = otp;

        if(!userData || userData.otp !== userInputOtp) {
            throw new AppError("Invalid or expired OTP", 400);
        }

        const existing = await this._userRepository.findByEmail(email);
        if(existing) {
            await this._keyValueRepository.del(`otp:register:user:${email}`);
            throw new AppError("An account with this email already exists, please login!", 409);
        }
      
        if(!userData) throw new AppError("user data not available", 400);

        const savedUser = userData;

        await this._userRepository.create({...savedUser, passwordHash:savedUser.password, isVerified: true, phone: null});
        await this._keyValueRepository.del(`pending:register:user:${email}`);
    }
}