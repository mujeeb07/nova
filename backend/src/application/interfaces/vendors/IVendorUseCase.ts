import { IUseCase } from "../IUseCase";
import {
    VendorRegisterInputDTO,
    VendorRegisterOutputDTO,
    VendorVerifyOtpInputDTO,
    VendorVerifyOtpOutputDTO,
    VendorResendOtpInputDTO,
    VendorLoginInputDTO,
    VendorLoginOutputDTO,
    VendorForgotPasswordInputDTO,
    VendorResetPasswordInputDTO,
    VendorCompleteOnboardingInputDTO,
    VendorCompleteOnboardingOutputDTO,
    VendorGetProfileInputDTO,
    VendorGetProfileOutputDTO,
} from "../../dtos/vendors/vendor.dto";

// auth
export type IVendorRegisterUseCase       = IUseCase<VendorRegisterInputDTO, VendorRegisterOutputDTO>;
export type IVendorVerifyOtpUseCase      = IUseCase<VendorVerifyOtpInputDTO, VendorVerifyOtpOutputDTO>;
export type IVendorResendOtpUseCase      = IUseCase<VendorResendOtpInputDTO, void>;
export type IVendorLoginUseCase          = IUseCase<VendorLoginInputDTO, VendorLoginOutputDTO>;
export type IVendorForgotPasswordUseCase = IUseCase<VendorForgotPasswordInputDTO, void>;
export type IVendorResetPasswordUseCase  = IUseCase<VendorResetPasswordInputDTO, void>;

// onboarding / profile
export type IVendorCompleteOnboardingUseCase = IUseCase<VendorCompleteOnboardingInputDTO, VendorCompleteOnboardingOutputDTO>;
export type IVendorGetProfileUseCase         = IUseCase<VendorGetProfileInputDTO, VendorGetProfileOutputDTO>;

