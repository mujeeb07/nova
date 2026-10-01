import { IVendorPayoutAccountDocument, VendorPayoutAccountModel } from "./model/vendorPayoutAccountModel";
import { IVendorPayoutAccountRepository } from "../../../domain/repositories/vendors/IVendorPayoutAccountRepository";
import { IBankDetails, IVendorPayoutAccount } from "../../../domain/entities/vendors/IVendor";

export class VendorPayoutAccountRepository implements IVendorPayoutAccountRepository {
    private toDomain(doc: IVendorPayoutAccountDocument): IVendorPayoutAccount {
        return {
            vendorId: doc.vendorId.toString(),
            bankDetails: doc.bankDetails,
            commissionRate: doc.commissionRate,
            pendingSettlementAmount: doc.pendingSettlementAmount
        };
    }

    async create(payout: IVendorPayoutAccount): Promise<IVendorPayoutAccount> {
        const doc = await VendorPayoutAccountModel.create(payout);
        return this.toDomain(doc);
    }

    async findByVendorId(vendorId: string): Promise<IVendorPayoutAccount | null> {
        const doc = await VendorPayoutAccountModel.findOne({ vendorId });
        return doc ? this.toDomain(doc) : null
    }

    async upsert(vendorId: string, bankDetails: IBankDetails): Promise<IVendorPayoutAccount> {
        const doc = await VendorPayoutAccountModel.findByIdAndUpdate(
            { vendorId },
            {
                $set: { bankDetails },
                $setOnInsert: { commissionRate: 0.01, pendingSettlementAmount: 0 }
            },
            { new: true, upsert: true }
        );

        return this.toDomain(doc);
    }
}