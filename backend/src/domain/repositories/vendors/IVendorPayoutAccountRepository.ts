import { IBankDetails, IVendorPayoutAccount } from "../../entities/vendors/IVendor";

export interface IVendorPayoutAccountRepository {
    create(payout: IVendorPayoutAccount): Promise<IVendorPayoutAccount>;
    findByVendorId(vendorId: string): Promise<IVendorPayoutAccount | null>;
    upsert(vendorId: string, bankDetails: IBankDetails): Promise<IVendorPayoutAccount>;
}