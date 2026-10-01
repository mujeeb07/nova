import { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { IPasswordResettable } from "../../../../domain/repositories/shared/IPasswordResettable";
import { IPasswordService } from "../../../services/IPasswordService";

export class ResetPasswordUseCase {
    constructor(
        private _resettableRepository: IPasswordResettable,
        private _keyValueService: IKeyValueRepository,
        private _passwordService: IPasswordService,
        private _cachePrefix: string
    ){}

    async execute(email: string, otp: string, newPassword: string): Promise<void> {
        const cacheKey = `${this._cachePrefix}:${email}`;
        const cachedOtp = await this._keyValueService.get(cacheKey);
        console.log(`cacheKey: ${cacheKey}, OTP: ${cachedOtp}`)
        if(!cachedOtp || cachedOtp !== otp) throw new Error("Invalid or expired OTP.");

        const accountId = await this._resettableRepository.findAccountByEmail(email);
        console.log("accountId:",accountId)
        if(!accountId) throw new Error("Invalid or expired OTP.");

        const passwordHash = await this._passwordService.hash(newPassword);
        await this._resettableRepository.updatePasswordHash(accountId, passwordHash);
        await this._keyValueService.del(cacheKey);

    }

}