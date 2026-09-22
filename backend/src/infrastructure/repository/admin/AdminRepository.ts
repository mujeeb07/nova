import { BaseRepository } from "../shared/BaseRepository";
import { IAdminRepository } from "../../../domain/repositories/admin/IAdminRepository";
import { IAdmin } from "../../../domain/entities/admin/IAdmin";
import { IAdminDocument, AdminModel } from "./model/adminModel";

export class AdminRepository 
    extends BaseRepository< IAdmin, IAdminDocument> 
    implements IAdminRepository
{
    constructor() {
        super(AdminModel, (raw: any): IAdmin => ({
            id: raw._id.toString(),
            name: raw.name,
            email: raw.email,
            passwordHash: raw.passwordHash,
            role: raw.role,
            permissions: raw.permissions,
            status: raw.status,
            lastLoginAt: raw.lastLoginAt,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }));
    }

    async findByEmail(mail: string): Promise<IAdmin | null> {
        const doc = await this.model.findOne({ mail }).select("+passwordHash").lean();
        if(!doc) return null;
        return this.mapper(doc);
    }
}