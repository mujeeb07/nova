import { IUser, IAddress, INotifications } from "../../../domain/entities/users/IUser";

// register input.
export interface UserRegisterInputDTO { 
    name: string;
    email: string;
    password: string;
}

// verify otp input.
export interface UserVerifyOtpInputDTO {
    email: string;
    otp: string;
}

// verify otp output.
export interface UserVerifyOtpOutputDTO {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

// login input.
export interface UserLoginInputDTO {
    email: string;
    password: string;
}

// login output.
export interface UserLoginOutputDTO { 
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        profileImage: string;
        walletBalance: number;
        notifications: INotifications;
        addresses: IAddress[];
        status: boolean;
    };

    accessToken: string;
    refreshToken: string;
}

// forgot password input.
export interface UserForgotPasswordInpnutDTO {
    email: string;
}

// reset password input.
export interface UserResetPasswordInputDTO { 
    email: string;
    otp: string;
    oldPassword: string;
    newPassword: string;
}

// resend otp input.
export interface UserResendOtpInputDTO {
    email: string;
}