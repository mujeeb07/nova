import { IAddress, IBankDetails, IWorkingHours, VendorStatus, VerificationStatus } from "../../../domain/entities/vendors/IVendor";

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

// register input.
export interface VendorRegisterInputDTO {
    shopName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
}

// register output.
export interface VendorRegisterOutputDTO {
    email: string;
    phone: string;
    otpExpiresAt: Date;
}

// verify otp input.
export interface VendorVerifyOtpInputDTO {
    email: string;
    otp: string;
}

// verify otp output.
export interface VendorVerifyOtpOutputDTO extends AuthTokensDTO {
    vendor: VendorSummaryDTO;
}

// login input.
export interface VendorLoginInputDTO {
    email: string;
    password: string;
}

// login output.
export interface VendorLoginOutputDTO extends AuthTokensDTO {
    vendor: VendorSummaryDTO;
    status: VendorStatus;
    verificationStatus: VerificationStatus;
    accessToken: string;
    refreshToken: string;
}

// forgot password input.
export interface VendorForgotPasswordInputDTO {
    email: string;
}

// reset password input.
export interface VendorResetPasswordInputDTO {
    email: string;
    otp: string;
    newPassword: string;
}

// resend otp input.
export interface VendorResendOtpInputDTO {
    email: string;
}

// store setup input.
export interface VendorStoreSetupInputDTO {
    vendorId: string;
    shopImages: string[];
    address: Omit<IAddress, "id">;
    serviceIds: string[];
    workingHours: IWorkingHours;
    dailyOrderCapacity: number;
    bankDetails: IBankDetails;
    documentUrls: string[];
}

// store setup output.
export interface VendorStoreSetupOutputDTO {
    vendorId: string;
    verificationStatus: "under_review";
}