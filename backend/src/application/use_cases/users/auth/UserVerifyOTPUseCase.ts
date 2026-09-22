import type { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import type { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { IUserVerifyOtpUseCase } from "../../../interfaces/users/IUserUseCase";
import { UserVerifyOtpInputDTO } from "../../../dtos/users/user.dto";

export class UserVerifyOtpUseCase implements IUserVerifyOtpUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _keyValueRepository: IKeyValueRepository
    ){}

    async execute(input:UserVerifyOtpInputDTO): Promise<void> {

        const { email, otp } = input;
        console.log("Input:", input);
        console.log(email);

        const cachedOtp = await this._keyValueRepository.get(`otp:register:user:${email}`);
        console.log(cachedOtp);

        const userInputOtp = otp;

        console.log(userInputOtp, "input");

        if(!cachedOtp || cachedOtp !== userInputOtp) {
            throw new Error("Invalid or expired OTP");
        }

        const existing = await this._userRepository.findByEmail(email);
        console.log("Existing:", existing)
        if(existing) {
            await this._keyValueRepository.del(cachedOtp);
            throw new Error("An account with this email already exists, please login!");
        }
        const userData = await this._keyValueRepository.get(`pending:register:user:${email}`);
        console.log("user data at the redis: ",userData)
        if(!userData) throw new Error("user data not available");

        const savedUser = JSON.parse(userData);
        console.log(savedUser);

        await this._userRepository.create({...savedUser, passwordHash:savedUser.password, isVerified: true, phone: null});
        await this._keyValueRepository.del(`pending:register:user:${email}`);
        console.log("User data saved successfully");
    }
}