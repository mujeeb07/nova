import mongoose, { Schema, Types } from "mongoose";
import { IService } from "../../../domain/entities/services/IService";

export interface IServiceDocument extends Omit<IService, "id" | "vendorId"> {
    _id: Types.ObjectId;
    vendorId: Types.ObjectId;
}

const serviceSchema = new Schema<IServiceDocument>(
    {
        vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        pricingModel: {
            type: String,
            enum: ["PER_KG", "PER_ITEM"],
            required: true
        },
        price: { type: Number, required: true, min: 0 },
        estimatedHours: { type: Number, required: true, min: 1, default: 24 },
        tags: { type: [String], default: [] },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

serviceSchema.index({ vendorId: 1, isActive: 1 });

export const ServiceModel = mongoose.model<IServiceDocument>("Service", serviceSchema);