import type { IVendorRepository } from "../../../../domain/repositories/vendors/IVendorRepository";
import type { IVendorCredentialsRepository } from "../../../../domain/repositories/vendors/IVendorCredentialRepository";
import type { IVendorVerifyOtpUseCase } from "../../../interfaces/vendors/IVendorUseCase";
import type { VendorVerifyOtpInputDTO, VendorVerifyOtpOutputDTO } from "../../../dtos/vendors/vendor.dto";
import type { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { ITokenService } from "../../../services/ITokenService";

export class VendorVerifyOtpUseCase implements IVendorVerifyOtpUseCase {
    constructor(
        private _vendorRepository: IVendorRepository,
        private _credentialsRepository: IVendorCredentialsRepository,
        private _keyValueService: IKeyValueRepository,
        private _tokenService: ITokenService
    ){}

    async execute(input: VendorVerifyOtpInputDTO): Promise<VendorVerifyOtpOutputDTO> {
        const { email, otp } = input;

        const cacheKey = `pending:register:vendor:${email}`;

        const cachedData = await this._keyValueService.get(cacheKey);
        if(!cachedData) throw new Error("Invalid or Expired OTP");

        const pending = await JSON.parse(cachedData);
        if(pending.otp !== otp) throw new Error("Invalid or Expired OTP");

        const existing = await this._vendorRepository.findByEmail(email);
        if(existing) {
            await this._keyValueService.del(cacheKey);
            throw new Error("An account with this email already exists. Please login.");
        }

        const vendor = await this._vendorRepository.create({
            shopName: pending.shopName,
            ownerName: pending.ownerName,
            email: pending.email,
            phone: pending.phone,
            shopImages: [],
            addresses: [],
            serviceIds: [],
            workingHours: null,
            dailyOrderCapacity: 0,
            currentSubscriptionId: null,
            status: "pending",
            verificationStatus: "unsubmitted",
            verificationDocuments: [],
            rejectionReason: null,
            reviewedBy: null,
            reviewedAt: null,
            isFeatured: false,
            ratingSummary: {
                average: 0,
                totalReviews: 0,
                sumOfRatings: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            },
        });

        await this._credentialsRepository.create({
            vendorId: vendor.id,
            passwordHash: pending.password,
            verifiedAt: new Date(),
        });

        await this._keyValueService.del(cacheKey);

        const accessToken = this._tokenService.signAccessToken({ accountId: vendor.id, role: "vendor" });
        const refreshToken = this._tokenService.signRefreshToken({ accountId: vendor.id, role: "vendor" });

        return {
            vendor: {
                id: vendor.id,
                shopName: vendor.shopName,
                ownerName: vendor.ownerName,
                email: vendor.email,
                phone: vendor.phone,
            },
            accessToken,
            refreshToken,
        };
    }
}