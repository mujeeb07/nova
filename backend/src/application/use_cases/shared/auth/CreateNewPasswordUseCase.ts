import { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { IPasswordResettable } from "../../../../domain/repositories/shared/IPasswordResettable";
import { AppError } from "../../../../utils/errors/AppError";
import { IPasswordService } from "../../../services/IPasswordService";

export class CreateNewPasswordUseCase {
    constructor(
        private _resettableRepository: IPasswordResettable,
        private _keyValueService: IKeyValueRepository,
        private _passwordService: IPasswordService,
        private _cachePrefix: string
    ) {}

    async execute(rawEmail: string, resetToken: string, newPassword: string, confirmPassword: string): Promise<void> {
        const email = rawEmail.toLowerCase().trim();

        if (newPassword.length < 8) throw new AppError("Password must be at least 8 characters", 400);
        if (newPassword !== confirmPassword) throw new AppError("Passwords do not match", 400);

        const grantKey = `${this._cachePrefix}:grant:${email}`;
        const stored = await this._keyValueService.get(grantKey);
        if (!stored || stored !== resetToken) {
            throw new AppError("Reset session expired. Please start again.", 401);
        }

        const accountId = await this._resettableRepository.findAccountByEmail(email);
        if (!accountId) throw new AppError("Reset session expired. Please start again.", 400);

        const passwordHash = await this._passwordService.hash(newPassword);
        await this._resettableRepository.updatePasswordHash(accountId, passwordHash);
        await this._keyValueService.del(grantKey);
    }
}