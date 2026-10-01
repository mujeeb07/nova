// import type { IPasswordResettable } from "./IPasswordResettable";
// import type { IKeyValueRepository } from "../key_value/IOtpRepository";
// import type { IPasswordService } from "../../../application/services/IPasswordService";

// export class ResetPasswordUseCase {
//     constructor(
//         private _resettableRepository: IPasswordResettable,
//         private _keyValueService: IKeyValueRepository,
//         private _passwordService: IPasswordService,
//         private _cacheKeyPrefix: string
//     ){};

//     async execute (email: string, otp: string, newPassword: string): Promise<void> {
//         const cacheKey = `${this._cacheKeyPrefix}:${email}`;

//         const cachedOtp = await this._keyValueService.get(cacheKey);
//         if(!cachedOtp) throw new Error("Invalid or expired OTP.");

//         const accountId = await this._resettableRepository.findAccountByEmail(email);
//         if(!accountId) throw new Error("Invalid or expired OTP.");

//         const passwordHash = await this._passwordService.hash(newPassword);
//         await this._resettableRepository.updatePasswordHash(accountId, passwordHash);
//         await this._keyValueService.del(cacheKey);
//     }
// }