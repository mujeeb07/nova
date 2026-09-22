import { IAddress, IBankDetails, IWorkingHours } from "../../../domain/entities/vendors/IVendor";

export interface VendorSummaryDTO {
    id: string;
    shopName: string;
    ownerName: string;
    email: string;
    phone: string;
}

export interface AuthTokensDTO {
    accessToken: string;
    refreshToken: string;
}

export interface VendorRegisterInputDTO {
    shopName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
}

export interface VendorRegisterOutputDTO {
    vendorId: string;
    email: string;
    phone: string;
    otpExpiresAt: Date;
}

export interface VendorVerifyOtpInputDTO {
    email: string;
    otp: string;
}

export interface VendorVerifyOtpOutputDTO extends AuthTokensDTO {
    vendor: VendorSummaryDTO;
}

export interface VendorLoginInputDTO {
    email: string;
    password: string;
}

export interface VendorLoginOutputDTO extends AuthTokensDTO {
    vendor: VendorSummaryDTO;
}

export interface VendorForgotPasswordInputDTO {
    email: string;
}

export interface VendorResetPasswordInputDTO {
    email: string;
    otp: string;
    newPassword: string;
}

export interface VendorResendOtpInputDTO {
    email: string;
}

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

export interface VendorStoreSetupOutputDTO {
    vendorId: string;
    verificationStatus: "under_review";
}