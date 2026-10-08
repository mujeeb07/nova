import { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { IPasswordResettable } from "../../../../domain/repositories/shared/IPasswordResettable";
import { BadRequestError, UnauthorizedError } from "../../../../utils/errors";
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

        if (newPassword.length < 8) throw new BadRequestError("Password must be at least 8 characters");
        if (newPassword !== confirmPassword) throw new BadRequestError("Passwords do not match");

        const grantKey = `${this._cachePrefix}:grant:${email}`;
        const stored = await this._keyValueService.get(grantKey);
        if (!stored || stored !== resetToken) {
            throw new UnauthorizedError("Reset session expired. Please start again.");
        }

        const accountId = await this._resettableRepository.findAccountByEmail(email);
        if (!accountId) throw new UnauthorizedError("Reset session expired. Please start again.");

        const passwordHash = await this._passwordService.hash(newPassword);
        await this._resettableRepository.updatePasswordHash(accountId, passwordHash);
        await this._keyValueService.del(grantKey);
    }
}