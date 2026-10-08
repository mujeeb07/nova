import type { IPasswordResettable } from "../../../../domain/repositories/shared/IPasswordResettable";
import type { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { generateOtp } from "../../../../utils/generateOtp";
import { OTP_CONFIG } from "../../../../config/otp_config";


export class ForgotPasswordUseCase {
    constructor(
        private _resettableRepository: IPasswordResettable,
        private _keyValueService: IKeyValueRepository,
        private _sendOtpEmail: (email: string, otp: string) => Promise<void>,
        private _cacheKeyPrefix: string
    ){};

    async execute(rawEmail: string): Promise<void> {
        const email = rawEmail.toLocaleLowerCase().trim();
        const accountId = await this._resettableRepository.findAccountByEmail(email);
        if(!accountId) return;

        const otp = generateOtp();
        const ttl = Math.floor(OTP_CONFIG.EXPIRY_MS / 1000);

        await this._keyValueService.set(`${this._cacheKeyPrefix}:otp:${email}`, otp, ttl);
        await this._sendOtpEmail(email, otp);
    }

}