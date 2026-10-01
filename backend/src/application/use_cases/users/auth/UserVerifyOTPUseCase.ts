import type { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import type { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { IUserVerifyOtpUseCase } from "../../../interfaces/users/IUserUseCase";
import { UserVerifyOtpInputDTO } from "../../../dtos/users/user.dto";
import { BadRequestError, ConflictError } from "../../../../utils/errors";


export class UserVerifyOtpUseCase implements IUserVerifyOtpUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _keyValueRepository: IKeyValueRepository
    ){}

    async execute(input:UserVerifyOtpInputDTO): Promise<void> {

        const { email, otp } = input;
        console.log("Input:", input);
        console.log(email);

        let userData = await this._keyValueRepository.get(`otp:register:user:${email}`) as any;
     
        if(userData){
            userData = JSON.parse(userData)
        }
        const userInputOtp = otp;

        console.log(userInputOtp, "input");
        console.log(userData,userInputOtp,"hereeeeeeeeeeee")
        if(!userData || userData.otp !== userInputOtp) {
            throw new BadRequestError("Invalid or expired OTP");
        }

        const existing = await this._userRepository.findByEmail(email);
        console.log("Existing:", existing);
        if(existing) {
            await this._keyValueRepository.del(`otp:register:user:${email}`);
            throw new ConflictError("An account with this email already exists, please login!");
        }
      
        console.log("user data at the redis: ",userData)
        if(!userData) throw new BadRequestError("user data not available");

        const savedUser = userData;
        console.log(savedUser);

        await this._userRepository.create({...savedUser, passwordHash:savedUser.password, isVerified: true, phone: null});
        await this._keyValueRepository.del(`pending:register:user:${email}`);
        console.log("User data saved successfully");
    }
}