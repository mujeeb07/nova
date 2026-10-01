import { IVendorDocument, VendorModel } from "./model/vendorModel";
import { IVendorRepository } from "../../../domain/repositories/vendors/IVendorRepository";
import { ReviewModel } from "../review/model/reviewModel";
import { BaseRepository } from "../shared/BaseRepository";
import { IVendor } from "../../../domain/entities/vendors/IVendor";
import { Types } from "mongoose";
import { toVendorDomain } from "./vendorMapper";
import { IPasswordResettable } from "../../../domain/repositories/shared/IPasswordResettable";

export class VendorRepository 
    extends BaseRepository<IVendor, IVendorDocument> 
    implements IVendorRepository, IPasswordResettable{
    constructor(){
        super(VendorModel, toVendorDomain);
    }

    async findByEmail(email: string): Promise<IVendor | null> {
        const doc = await this.model.findOne({ email: email.toLowerCase() }).lean();
        if(!doc) return null;
        return this.mapper(doc);
    }

    // forgot password.
    async findAccountByEmail(email: string): Promise<string | null> {
        const doc = await VendorModel.findOne({ email }).select("_id");
        return doc ? doc._id.toString() : null;
    }

    async updatePasswordHash(accountId: string, passwordHash: string): Promise<void> {
        await VendorModel.updateOne({ accountId }, { $set: { passwordHash } });
    }


    async incrementRatingOnNewReview(vendorId: string, rating: 1 | 2 | 3 | 4 | 5): Promise<void> {
        await VendorModel.updateOne({_id: vendorId}, [
            {
                $set: {
                    "ratingSummary.sumOfRatings": { $add: ["$ratingSummary.sumOfRatings", rating]},
                    "ratingSummary.totalReviews": { $add: ["$ratingSummary.totalReviews", 1] },
                    [`ratingSummary.distribution.${rating}`]: {
                        $add:[`$ratingSummary.distribution.${rating}`, 1]
                    },
                },
            },
            {
                $set: {
                    "ratingSummary.average": {
                        $cond: [
                            {$eq: ["$ratingSummary.totalReviews", 0] },
                            0,
                            { $divide: ["$ratingSummary.sumOfRatings", "$ratingSummary.totalReviews"] },
                        ],
                    },
                },
            },
        ]);
    }

    async adjustRatingOnReviewChange(
        vendorId: string, 
        oldRating: (1 | 2 | 3 | 4 | 5) | null, 
        newRating: (1 | 2 | 3 | 4 | 5) | null
    ): Promise<void> {
        const sumDelta = (newRating ?? 0) - (oldRating ?? 0);
        const countDelta = (newRating ? 1 : 0) - (oldRating ? 1 : 0);

        const setStage: Record<string, any> = {
            "ratingSummary.sumOfRatings": { $add: ["$ratingSummary.sumOfRatings", sumDelta] },
            "ratingSummary.totalReviews": { $add: ["$ratingSummary.totalReviews", countDelta] },
        };
        if (oldRating) {
            setStage[`ratingSummary.distribution.${oldRating}`] = {
                $subtract: [`$ratingSummary.distribution.${oldRating}`, 1],
            };
        }
        if (newRating) {
            const key = `ratingSummary.distribution.${newRating}`;
            
            setStage[key] =
                oldRating === newRating
                    ? { $add: [`$${key}`, 1] }
                    : { $add: [`$${key}`, 1] };
        }

        await VendorModel.updateOne({ _id: vendorId }, [
            { $set: setStage },
            {
                $set: {
                    "ratingSummary.average": {
                        $cond: [
                            { $eq: ["$ratingSummary.totalReviews", 0] },
                            0,
                            { $divide: ["$ratingSummary.sumOfRatings", "$ratingSummary.totalReviews"] },
                        ],
                    },
                },
            },
        ]);
    };

    async recalculateRatingSummary(vendorId: string): Promise<void> {
        const [agg] = await ReviewModel.aggregate([
            { $match: { vendorId: new Types.ObjectId(vendorId), status:"visible"} },
            {
                $group: {
                    _id:"$vendorId",
                    totalReviews: { $sum: 1 },
                    sumOfRatings: { $sum: "$rating" },
                    d1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
                    d2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                    d3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                    d4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                    d5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                },
            },
        ]);

        const summary = agg  
            ? {
                totalReviews: agg.totalReviews,
                sumOfRatings: agg.sumOfRatings,
                average: agg.sumOfRatings / agg.totalReviews,
                distribution: { 1: agg.d1, 2: agg.d2, 3: agg.d3, 4: agg.d4, 5: agg.d5 }
            } 
            : {
                totalReviews: 0,
                sumOfRatings: 0,
                average: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };

        await ReviewModel.updateOne({_id: vendorId}, {$set: { ratingSummary: summary } });
    }
}