import { randomUUID } from "node:crypto";
import type { IVendorRepository } from "../../../domain/repositories/vendors/IVendorRepository";
import type { IVendorPayoutAccountRepository } from "../../../domain/repositories/vendors/IVendorPayoutAccountRepository";
import type { IVendorCompleteOnboardingUseCase } from "../../interfaces/vendors/IVendorUseCase";
import type {
    VendorCompleteOnboardingInputDTO,
    VendorCompleteOnboardingOutputDTO,
} from "../../dtos/vendors/vendor.dto";
import { AppError } from "../../../utils/errors/AppError";

export class CompleteVendorOnboardingUseCase implements IVendorCompleteOnboardingUseCase {
    constructor(
        private readonly _vendorRepository: IVendorRepository,
        private readonly _payoutRepository: IVendorPayoutAccountRepository,
        private readonly _defaultCommissionRate: number,
    ) {}

    async execute(input: VendorCompleteOnboardingInputDTO): Promise<VendorCompleteOnboardingOutputDTO> {
        const vendor = await this._vendorRepository.findById(input.vendorId);
        if (!vendor) throw new AppError("Vendor not found", 404);
        if (vendor.verificationStatus === "verified") throw new AppError("Vendor is already verified", 409);

        await this._payoutRepository.upsert(
            input.vendorId,
            input.bankDetails,
            this._defaultCommissionRate,
        );

        const updated = await this._vendorRepository.update(input.vendorId, {
            shopName: input.shopName,
            businessType: input.businessType,
            phone: input.phone,
            email: input.email,
            description: input.description,
            logoUrl: input.logoUrl,
            shopImages: input.shopImages,
            addresses: [{ ...input.address, id: randomUUID() }],
            dailyOrderCapacity: input.dailyOrderCapacity,
            dailyItemCapacity: input.dailyItemCapacity,
            autoPauseWhenFull: input.autoPauseWhenFull,
            workingHours: input.workingHours,
            verificationDocuments: input.verificationDocuments ?? [],
            verificationStatus: "under_review",
            rejectionReason: null,
        });
        if (!updated) throw new AppError("Vendor not found", 404);

        return {
            vendorId: input.vendorId,
            shopName: updated.shopName,
            email: updated.email,
            verificationStatus: "under_review",
            submittedAt: updated.updatedAt,
        };
    }
}