import { BaseRepository } from "../shared/BaseRepository";
import { IUserRepository } from "../../../domain/repositories/users/IUserRepository";
import { IUser } from "../../../domain/entities/users/IUser";
import { IUserDocument, UserModel } from "./model/userModel";
import { IPasswordResettable } from "../../../domain/repositories/shared/IPasswordResettable";

export class UserRepository 
extends BaseRepository<IUser, IUserDocument> 
implements IUserRepository, IPasswordResettable
{
    constructor() {
        super(UserModel, (raw: any): IUser => ({
            id: raw._id.toString(),
            name: raw.name,
            email: raw.email,
            phone:raw.phone,
            passwordHash: raw.passwordHash,
            addresses: raw.addresses,
            notifications: raw.notifications,
            profileImage: raw.profileImage,
            fcmToken: raw.fcmToken,
            isVerified: raw.isVerified,
            status: raw.status,
            walletBalance: raw.walletBalance,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }));
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const doc = await this.model.findOne({ email:email }).lean();

        console.log("DOC:",doc)
        if(!doc) return null;
        return this.mapper(doc);
    }

    // forgot password.
    async findAccountByEmail(email: string): Promise<string | null> {
        const doc = await UserModel.findOne({ email: email.toLowerCase().trim() }).select("_id");
        return doc ? doc._id.toString() : null
    }

    // set new password
    async updatePasswordHash(accountId: string, passwordHash: string): Promise<void> {
        const result = await UserModel.updateOne({ _id: accountId }, { $set: { passwordHash } });
        if (result.matchedCount === 0) {
            throw new Error("Account not found while updating password");
        }
    }
}