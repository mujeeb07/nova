import mongoose, { Schema,Types } from "mongoose";
import { IAdmin , ROLE, STATUS } from "../../../../domain/entities/admins/IAdmin";

export interface IAdminDocument extends Omit<IAdmin,"id">{
     _id: Types.ObjectId;
}

const adminSchema = new Schema<IAdminDocument>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLE), required: true, default: ROLE.SUPER_ADMIN },
    status: { type: String, enum: Object.values(STATUS), default: STATUS.ACTIVE, required: true },
    lastLoginAt: { type: Date, default: null }
}, {timestamps: true});

adminSchema.index({ role: 1});

export const AdminModel = mongoose.model<IAdminDocument>('Admin', adminSchema);

