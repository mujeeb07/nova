import { BaseRepository } from "../shared/BaseRepository";
import { IUserRepository } from "../../../domain/repositories/users/IUserRepository";
import { IUser } from "../../../domain/entities/users/IUser";
import { IUserDocument, UserModel } from "./model/userModel";

export class UserRepository 
    extends BaseRepository<IUser, IUserDocument>
    implements IUserRepository
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
}