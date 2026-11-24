import { PricingModel } from "../../../domain/entities/services/IService";
import { 
    IAddress, 
    IBankDetails, 
    IWorkingHours, 
    VendorStatus, 
    VerificationStatus 
} from "../../../domain/entities/vendors/IVendor";

// summary.
export interface VendorSummaryDTO {
    id: string;
    shopName: string;
    ownerName: string;
    email: string;
    phone: string;
}

// auth tokens.
export interface AuthTokensDTO {
    accessToken: string;
    refreshToken: string;
}

// register.
export interface VendorRegisterInputDTO {
    shopName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
}

export interface VendorRegisterOutputDTO {
    email: string;
    phone: string;
    otpExpiresAt: Date;
}

// verify otp.
export interface VendorVerifyOtpInputDTO {
    email: string;
    otp: string;
}

export interface VendorVerifyOtpOutputDTO extends AuthTokensDTO {
    vendor: VendorSummaryDTO;
}

// resend otp.
export interface VendorResendOtpInputDTO {
    email: string;
}

// login.
export interface VendorLoginInputDTO {
    email: string;
    password: string;
}

export interface VendorLoginOutputDTO extends AuthTokensDTO {
    vendor: VendorSummaryDTO;
    status: VendorStatus;
    verificationStatus: VerificationStatus;
}

// forgot / reset password.
export interface VendorForgotPasswordInputDTO {
    email: string;
}

export interface VendorResetPasswordInputDTO {
    email: string;
    otp: string;
    newPassword: string;
}

// complete onboarding.
export interface OnboardingServiceInputDTO {
    name: string;
    category: string;
    pricingModel: PricingModel;
    price: number;
    estimatedHours: number;
    tags?: string[];
}

export interface VendorCompleteOnboardingInputDTO {
    vendorId: string;

    // step-1 Business Profile.
    shopName: string;
    businessType: string;
    phone: string;
    email: string;
    description?: string;
    logoUrl?: string;
    shopImages: string[];

    // step-2 Location setup.
    address: Omit<IAddress, "id">;

    // step-3 Service setup.
    services: OnboardingServiceInputDTO[];

    // step-4 Capacity.
    dailyOrderCapacity: number;
    dailyItemCapacity: number;
    autoPauseWhenFull: boolean;

    // step-5 Operating Hours.
    workingHours: IWorkingHours;

    // step-6 Payout Details.
    bankDetails: IBankDetails;

    verificationDocuments?: string[];
}

export interface VendorCompleteOnboardingOutputDTO {
    vendorId: string;
    shopName: string;
    email: string;
    verificationStatus: "under_review";
    submittedAt: Date;
}

// get profile.
export interface VendorGetProfileInputDTO {
    vendorId: string;
}

export interface VendorGetProfileOutputDTO {
    vendor: VendorSummaryDTO;
    status: VendorStatus;
    verificationStatus: VerificationStatus;
    rejectionReason: string | null;
}