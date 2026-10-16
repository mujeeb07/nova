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
    VendorStoreSetupInputDTO,
    VendorStoreSetupOutputDTO,
} from "../../dtos/vendors/vendor.dto";

// register.
export interface IVendorRegisterUseCase {
    execute(input: VendorRegisterInputDTO): Promise<VendorRegisterOutputDTO>;
}

export interface IVendorVerifyOtpUseCase {
    execute(input: VendorVerifyOtpInputDTO): Promise<VendorVerifyOtpOutputDTO>;
}

// login.
export interface IVendorLoginUseCase {
    execute(input: VendorLoginInputDTO): Promise<VendorLoginOutputDTO>;
}

// forgot password.
export interface IVendorForgotPasswordUseCase {
    execute(input: VendorForgotPasswordInputDTO): Promise<void>;
}

// reset password.
export interface IVendorResetPasswordUseCase {
    execute(input: VendorResetPasswordInputDTO): Promise<void>;
}

// resend otp.
export interface IVendorResendOtpUseCase {
    execute(input: VendorResendOtpInputDTO): Promise<void>;
}

// store setup.
export interface IVendorStoreSetupUseCase {
    execute(input: VendorStoreSetupInputDTO): Promise<VendorStoreSetupOutputDTO>;
}