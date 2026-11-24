import mongoose, { Schema, Types } from "mongoose";
import {
    IVendor,
    IAddress,
    IGeoJSONPoint,
    IRatingDistribution,
    IVendorRatingSummary,
    IDailyWorkingHours,
    IWorkingHours,
} from "../../../../domain/entities/vendors/IVendor";

export interface IVendorDocument extends Omit<IVendor, "id"> {
    _id: Types.ObjectId;
}

const geoJSONPointSchema = new Schema<IGeoJSONPoint>(
    {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }
    },
    { _id: false }
);

const addressSchema = new Schema<IAddress>(
    {
        id: { type: String, required: true },
        label: { type: String, required: true },
        street: { type: String, required: true },
        street2: { type: String, required: false },
        city: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        location: { type: geoJSONPointSchema, required: true }
    },
    { _id: false }
);

const dailyWorkingHoursSchema = new Schema<IDailyWorkingHours>(
    {
        day: {
            type: String,
            enum: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
            required: true
        },
        isOpen: { type: Boolean, required: true, default: true },
        openTime: { type: String, required: true, default: "09:00" },
        closeTime: { type: String, required: true, default: "20:00" }
    },
    { _id: false }
);

const workingHourSchema = new Schema<IWorkingHours>(
    {
        schedule: { type: [dailyWorkingHoursSchema], required: true, default: [] },
        specialClosures: { type: [Date], default: [] }
    },
    { _id: false }
);

const ratingDistributionSchema = new Schema<IRatingDistribution>(
    {
        1: { type: Number, required: true, default: 0 },
        2: { type: Number, required: true, default: 0 },
        3: { type: Number, required: true, default: 0 },
        4: { type: Number, required: true, default: 0 },
        5: { type: Number, required: true, default: 0 },
    },
    { _id: false }
);

const ratingSummarySchema = new Schema<IVendorRatingSummary>(
    {
        average: { type: Number, required: true, default: 0 },
        totalReviews: { type: Number, required: true, default: 0 },
        sumOfRatings: { type: Number, required: true, default: 0 },
        distribution: { type: ratingDistributionSchema, required: true, default: () => ({}) }
    },
    { _id: false }
);

const vendorSchema = new Schema<IVendorDocument>(
    {
        shopName: { type: String, required: true, trim: true },
        ownerName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, trim: true, unique: true, sparse: true },
        businessType: { type: String, required: true, default: "Laundry Service" },
        description: { type: String, maxlength: 300, default: "" },
        logoUrl: { type: String, default: "" },
        shopImages: { type: [String], default: [] },
        addresses: { type: [addressSchema], default: [] },
        serviceIds: { type: [String], default: [] },
        workingHours: { type: workingHourSchema, default: null },
        dailyOrderCapacity: { type: Number, required: true, default: 0, min: 0 },
        dailyItemCapacity: { type: Number, required: true, default: 0, min: 0 },
        autoPauseWhenFull: { type: Boolean, default: true },
        verificationDocuments: { type: [String], default: [] },
        currentSubscriptionId: { type: String, default: null },
        status: { type: Boolean, default: true },
        verificationStatus: {
            type: String,
            enum: ["unsubmitted", "under_review", "verified", "rejected"],
            required: true,
            default: "unsubmitted"
        },
        rejectionReason: { type: String, default: null },
        reviewedBy: { type: String, default: null },
        reviewedAt: { type: Date, default: null },

        isFeatured: { type: Boolean, default: false },
        ratingSummary: { type: ratingSummarySchema, required: true, default: () => ({}) }
    },
    { timestamps: true }
);

vendorSchema.index({ "addresses.location": "2dsphere" });
vendorSchema.index({ status: 1, isFeatured: 1 });
vendorSchema.index({ email: 1 });

export const VendorModel = mongoose.model<IVendorDocument>("Vendor", vendorSchema);