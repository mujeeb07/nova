import mongoose, { Schema, Types }  from "mongoose";
import { IVendorCredentials } from "../../../../domain/entities/vendors/IVendor";

export interface IVendorCredentialsDocument extends Omit<IVendorCredentials, "vendorId"> {
    _id: Types.ObjectId;
    vendorId: Types.ObjectId
}

const vendorCredentialSchema  = new Schema<IVendorCredentialsDocument>(
    {
        vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true , unique: true },
        passwordHash: { type: String, required: true },
        verifiedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

export const VendorCredentialsModel = mongoose.model<IVendorCredentialsDocument>(
    "VendorCredential", 
    vendorCredentialSchema
);