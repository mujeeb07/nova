import { BaseRepository } from "../shared/BaseRepository";
import { IAdminRepository } from "../../../domain/repositories/admin/IAdminRepository";
import { IAdmin, ROLE, STATUS } from "../../../domain/entities/admins/IAdmin";
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
            role: (raw.role?.toLowerCase() ?? ROLE.SUPER_ADMIN) as ROLE,
            status: raw.status,
            lastLoginAt: raw.lastLoginAt,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }));
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        const doc = await this.model.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash').lean();
        return doc ? this.mapper(doc) : null;
    }

    async findAllbyRole(role: ROLE): Promise<IAdmin[]> {
        const docs = await this.model.find({ role });
        return docs.map((d) => this.mapper(d));
    }

    async updateStatus(id: string, status: STATUS): Promise<void> {
        await this.model.updateOne({ id: id }, { $set: { status} });
    }

    async updateLastLogin(id: string): Promise<void> {
        await this.model.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } });
    }


    async findAccountByEmail(email: string): Promise<string | null> {
        const doc = await this.model.findOne({ email: email.toLowerCase().trim() }).select("_id");
        return doc ? doc._id.toString() : null;
    }

    async updatePasswordHash(accountId: string, passwordHash: string): Promise<void> {
        const r = await this.model.updateOne({ _id: accountId }, { $set: { passwordHash } });
        if (r.matchedCount === 0) throw new Error("Account not found while updating password");
    }
}