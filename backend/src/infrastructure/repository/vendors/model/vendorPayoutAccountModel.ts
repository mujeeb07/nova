import mongoose, { Schema, Types } from "mongoose";
import { 
    IBankDetails, 
    IVendorPayoutAccount 
} from "../../../../domain/entities/vendors/IVendor";

export interface IVendorPayoutAccountDocument 
extends Omit<IVendorPayoutAccount, "vendorId"> {
    _id: Types.ObjectId;
    vendorId: Types.ObjectId
}

const bankDetailsSchema = new Schema<IBankDetails>(
    {
        accountHolderName: { type: String, required: true, trim: true },
        accountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true, uppercase: true, trim: true },
        bankName: { type: String, required: true, trim: true },
        branchName: { type: String, required: true, trim: true },
        upiId: { type: String, required: false, trim: true }
    },
    { _id: false }
);

const vendorPayoutAccountSchema = new Schema<IVendorPayoutAccountDocument>(
    {
        vendorId: {
            type: Schema.Types.ObjectId,
            ref: "vendor",
            required: true,
            unique: true
        },
        bankDetails: { type: bankDetailsSchema, required: true },
        commissionRate: { type: Number, required: true, default: 0, min: 0.1, max: 1 },
        pendingSettlementAmount: { type: Number, required: true, default: 0, min: 0, }
    },
    { timestamps: true }
);

export const VendorPayoutAccountModel = mongoose.model<IVendorPayoutAccountDocument>(
    "vendorPayoutAccount",
    vendorPayoutAccountSchema
)