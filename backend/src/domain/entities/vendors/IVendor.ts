export interface IGeoJSONPoint {
    type: "Point";
    coordinates: [longitude: number, latitude: number];
}

export interface IAddress {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    location: IGeoJSONPoint;
}

export type WeekDay =
    | "sunday" | "monday" | "tuesday" | "wednesday"
    | "thursday" | "friday" | "saturday";

export interface IWorkingHours {
    openTime: string;   
    closeTime: string;
    workingDays: WeekDay[];
}

export type VendorStatus = "pending" | "active" | "suspended" | "rejected";
export type VerificationStatus = "unsubmitted" | "under_review" | "verified" | "rejected";

export interface IVendor {
    id: string;
    shopName: string;
    ownerName: string;
    email: string;
    phone: string;
    shopImages: string[];
    addresses: IAddress[];
    serviceIds: string[];
    workingHours: IWorkingHours;
    dailyOrderCapacity: number;
    currentSubscriptionId: string | null;
    status: VendorStatus;
    verificationStatus: VerificationStatus;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export interface IVendorCredentials {
    vendorId: string;
    passwordHash: string;
    verifiedAt: Date | null;
}


export interface IBankDetails {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    upiId?: string;
}


export interface IVendorPayoutAccount {
    vendorId: string;
    bankDetails: IBankDetails;
    commissionRate: number;
    pendingSettlementAmount: number;
}

export type IRatingDistribution = Record<1 | 2 | 3 | 4 | 5, number>;

/** Denormalised read model, rebuilt from reviews. */
export interface IVendorRatingSummary {
    vendorId: string;
    average: number;
    totalReviews: number;
    distribution: IRatingDistribution;
}