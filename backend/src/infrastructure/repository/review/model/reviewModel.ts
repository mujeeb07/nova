import mongoose, { Schema, Types } from "mongoose";
import { IReview, IVendorReply, ReviewStatus } from "../../../../domain/entities/reviews/IReview";

export interface IReviewDocument extends Omit<IReview, "id" | "vendorId" | "customerId" | "orderId" > {
    _id: Types.ObjectId;
    vendorId: Types.ObjectId;
    customerId: Types.ObjectId;
    orderId: Types.ObjectId;
}

const vendorReplySchema = new Schema<IVendorReply>(
    {
        text: {
            type: String,
            required: true
        },

        repliedAt: {
            type: Date,
            required: true
        },

        editedAt: {
            type: Date,
            dufault: null
        }
    }, { _id: false }
);

const reviewSchema = new Schema<IReviewDocument>(
    {
        vendorId: {
            type: Types.ObjectId,
            ref: "vendor",
            required: true
        },

        customerId: {
            type: Types.ObjectId,
            ref: "user",
            required: true
        },

        orderId: {
            type: Types.ObjectId,
            ref: "order",
            default: null
        },

        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            required: true
        },

        comment: {
            type: String,
            default: null,
            trim: true,
            maxlength: 2000
        },

        images: {
            type: [String],
            default: []
        },

        vendorReply: {
            type: vendorReplySchema,
            default: null
        },

        status: {
            type: String,
            enum: ["visible", "hidden", "flagged"] as ReviewStatus[],
            required: true,
            default: "visible"
        }
    }, { timestamps: true }
);

reviewSchema.index({ vendorId: 1, status: 1, createdAt: -1 });

reviewSchema.index(
    { orderId: 1, customerId: 1 },
    { unique: true, partialFilterExpression: {orderId: { $type: "objectId" } } }
);

export const ReviewModel = mongoose.model<IReviewDocument>("review", reviewSchema);