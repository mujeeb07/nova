import { VendorCredentialsModel, IVendorCredentialsDocument } from "./model/vendorCredentialsModel";
import { IVendorCredentialsRepository } from "../../../domain/repositories/vendors/IVendorCredentialRepository";
import { IVendorCredentials } from "../../../domain/entities/vendors/IVendor";
import { IPasswordResettable } from "../../../domain/repositories/shared/IPasswordResettable";
import { VendorModel } from "../vendors/model/vendorModel";

export class VendorCredentialsRepository 
implements IVendorCredentialsRepository, IPasswordResettable {

    private toDomain(doc: IVendorCredentialsDocument): IVendorCredentials {
        console.log("password:",doc.passwordHash)
        return {
            vendorId: doc.vendorId.toString(),
            passwordHash: doc.passwordHash.toString(),
            verifiedAt: doc.verifiedAt
        }
    }

    async create(credentials: IVendorCredentials): Promise<IVendorCredentials> {
        const doc = await VendorCredentialsModel.create(credentials);
        return this.toDomain(doc);
    }

    async findByVendorId(vendorId: string): Promise<IVendorCredentials | null> {
        const doc = await VendorCredentialsModel.findOne({ vendorId });
        return doc ? this.toDomain(doc) : null;
    }

    // forgot-password.
    async findAccountByEmail(email: string): Promise<string | null> {
        const vendor = await VendorModel.findOne({ email }).select("_id");
        return vendor ? vendor._id.toString() : null;
    }

    async verifyForgotPasswordOtp(otp: string): Promise<string | null> {
        return null;
    }

    // reset-password.
    async updatePasswordHash(vendorId: string, passwordHash: string): Promise<void> {
        await VendorCredentialsModel.updateOne({ vendorId }, { $set: { passwordHash } });
    }
}