import { IBaseRepository } from "../IBaseRepository";
import { IVendor } from "../../entities/vendors/IVendor";

export interface IVendorRepository extends IBaseRepository<IVendor> {
    findByEmail(email: string): Promise<IVendor | null>;

    incrementRatingOnNewReview(vendorId: string, rating: 1 | 2 | 3 | 4 | 5 ): Promise<void>;

    adjustRatingOnReviewChange(
        vendorId: string,
        oldRating: (1 | 2 | 3 | 4 | 5) | null,
        newRating: (1 | 2 | 3 | 4 | 5) | null
    ): Promise<void>;

    recalculateRatingSummary(vendorId: string):Promise<void>;
}