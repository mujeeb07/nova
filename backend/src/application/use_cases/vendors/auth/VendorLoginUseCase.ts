import type { IVendorRepository } from "../../../../domain/repositories/vendors/IVendorRepository";
import type { IVendorCredentialsRepository } from "../../../../domain/repositories/vendors/IVendorCredentialRepository";
import type { IVendorLoginUseCase } from "../../../interfaces/vendors/IVendorUseCase";
import type { VendorLoginInputDTO, VendorLoginOutputDTO } from "../../../dtos/vendors/vendor.dto";
import type { PasswordService } from "../../../../infrastructure/services/password_services";
import type { ITokenService } from "../../../services/ITokenService";
import { AppError } from "../../../../utils/errors/AppError";


export class VendorLoginUseCase implements IVendorLoginUseCase {
    constructor(
        private _vendorRepository: IVendorRepository,
        private _credentialsRepository: IVendorCredentialsRepository,
        private _passwordService: PasswordService,
        private _tokenService: ITokenService
    ) {}

    async execute(input: VendorLoginInputDTO): Promise<VendorLoginOutputDTO> {
        const { email, password } = input;

        const vendor = await this._vendorRepository.findByEmail(email);
        if(!vendor) throw new AppError("Invalid email or password", 401);

        const credentials = await this._credentialsRepository.findByVendorId(vendor.id);
        if(!credentials) throw new AppError("Invalid email or password", 401);

        const isMatch = await this._passwordService.compare(password, credentials.passwordHash);
        if(!isMatch) throw new AppError("Invalid email or password", 401);

        if(!vendor.status) {
            throw new AppError("Your account has been suspended. Contact support.", 401);
        }

        const accessToken = this._tokenService.signAccessToken({ accountId: vendor.id, role: "vendor" });
        const refreshToken = this._tokenService.signRefreshToken({ accountId: vendor.id, role: "vendor" });

        return {
            vendor: {
                id: vendor.id,
                shopName: vendor.shopName,
                ownerName: vendor.ownerName,
                email: vendor.email,
                phone: vendor.phone
            },
            status: vendor.status,
            verificationStatus: vendor.verificationStatus,
            accessToken,
            refreshToken
        };
    }
}