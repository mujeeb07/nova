import mongoose, { Schema,Types } from "mongoose";
import { IAdmin ,ROLE,PERMISSIONS,STATUS} from "../../../../domain/entities/admin/IAdmin";

export interface IAdminDocument extends Omit<IAdmin,"id">{
     _id: Types.ObjectId;
}

const adminSchema = new Schema<IAdminDocument>({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    passwordHash: {
        type: String,
        required: true,
        select: false
    },

    role: {
        type: String,
        enum: Object.values(ROLE),
        required: true
    },

    permissions: {
        type: [String],
        enum: Object.values(PERMISSIONS),
        default: []
    },

    status: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.ACTIVE,
        required: true
    },

    lastLoginAt: {
        type: Date,
        default: null
    }
}, {timestamps: true});

export const AdminModel = mongoose.model<IAdminDocument>('Admin', adminSchema);

