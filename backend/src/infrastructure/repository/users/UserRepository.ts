import { BaseRepository } from "../shared/BaseRepository";
import { IUserRepository } from "../../../domain/repositories/users/IUserRepository";
import { IUser } from "../../../domain/entities/users/IUser";
import { IUserDocument, UserModel } from "./model/userModel";
import { IPasswordResettable } from "../../../domain/repositories/shared/IPasswordResettable";
import { AppError } from "../../../utils/errors/AppError";

export class UserRepository 
extends BaseRepository<IUser, IUserDocument> 
implements IUserRepository, IPasswordResettable {
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
        const doc = await UserModel.updateOne({ _id: accountId }, { $set: { passwordHash } });
        if (doc.matchedCount === 0) {
            throw new AppError("Account not found while updating password", 404);
        }
    }

    async updateStatus(id: string, status: boolean): Promise<IUser | null> {
        const doc = await UserModel.findByIdAndUpdate(id, {$set: {status}}, {new: true});
        if(!doc) {
            throw new AppError("update Status failed: User not found", 404);
        }
        return this.mapper(doc);
    }
}