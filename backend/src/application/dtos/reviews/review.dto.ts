import { ReviewStatus } from "../../../domain/entities/reviews/IReview";

export interface SubmitReviewInputDTO {
    vendorId: string;
    customerId: string;
    orderid: string;
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
    images?: string[];
}

export interface ReviewDTO {
    id: string;
    customerName: string;
    customerAvatar: string | null;
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
    images: string[];
    vendorReply : {
        text: string;
        repliedAt: Date;
    } | null;
    createdAt: Date;
}

export interface VendorReplyInputDTO {
    reviewId: string;
    vendorId: string;
    text: string;
}

export interface ReviewListOutputDTO {
    review: ReviewDTO[];
    ratingSummary: {
        average: number;
        totalReviews: number;
        distribution: Record<1 | 2 | 3 | 4 | 5, number>;
    };
    page: number;
    totalPages: number;
}
