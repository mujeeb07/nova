import mongoose, { Schema, Types } from "mongoose";
import { IUser, IAddress, IGeoJSONPoint, INotifications } from "../../../../domain/entities/users/IUser";

export interface IUserDocument extends Omit<IUser,"id"> {
    _id: Types.ObjectId;
}

const geoJSONPointSchema = new Schema<IGeoJSONPoint>(
    {
        type: { type: String, enum:["Point"], required: true },
        coordinates: { type: [Number], required: true }
    },
    { _id: false }
);

const addressSchema = new Schema<IAddress>(
    {
        id: { type: String, required: true },
        label: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        location: { type: geoJSONPointSchema, required: true },
        isDefault: { type: Boolean, default: true }
    }, 
    { _id: true }
);

const notificationsSchema = new Schema<INotifications>(
    {
        orderUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: true },
        aiSuggestions: { type: Boolean, default: true }
    }
)

const userSchema = new Schema<IUserDocument>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, trim: true, unique: true, sparse: true },
        googleId: { type: String, unique: true, sparse: true },
        passwordHash: { type: String, required: false },
        profileImage: { type: String, default: "" },
        walletBalance: { type: Number, default: 0, min: 0 },
        fcmToken: { type: [String], default: [] },
        notifications: {
            type: notificationsSchema,
            default: () => ({
                aiSuggestions: true,
                orderUpdates: true,
                promotions: true
            })
        },
        addresses: { type: [addressSchema], default:[] },
        isVerified: { type: Boolean, default: false },
        status: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<IUserDocument>("user", userSchema);
