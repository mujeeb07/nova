
import { randomBytes } from "crypto";
import { UnauthorizedError } from "../../../../utils/errors";
import type { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";

const RESET_TOKEN_TTL_SECONDS = 600;

export class VerifyForgotPasswordOtpUseCase {
    constructor(
        private _keyValueService: IKeyValueRepository,
        private _cachePrefix: string
    ) {}

    async execute(rawEmail: string, otp: string): Promise<{ resetToken: string }> {
        const email = rawEmail.toLowerCase().trim();
        const otpKey = `${this._cachePrefix}:otp:${email}`;

        const stored = await this._keyValueService.get(otpKey);
        if (!stored || stored !== otp) throw new UnauthorizedError("Invalid or expired OTP");

        await this._keyValueService.del(otpKey);

        const resetToken = randomBytes(32).toString("hex");
        await this._keyValueService.set(
            `${this._cachePrefix}:grant:${email}`,
            resetToken,
            RESET_TOKEN_TTL_SECONDS
        );
        return { resetToken };
    }
}