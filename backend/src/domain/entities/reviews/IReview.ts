export type ReviewStatus = "visible" | "hidden" | "flag";

export interface IVendorReply {
    text: string;
    repliedAt: Date;
    editedAt: Date | null;
}

export interface IReview {
    id: string;
    vendorId: string;
    customerId: string;
    orderId: string | null;
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string | null;
    images: string[];
    vendorReply: IVendorReply | null;
    status: ReviewStatus;
    createdAt: Date;
    updatedAt: Date;
}