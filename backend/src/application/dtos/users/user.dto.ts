import {
    IUser, 
    IAddress, 
    INotifications
} from "../../../domain/entities/users/IUser";

export interface UserRegisterInputDTO { // register input.
    name: string;
    email: string;
    password: string;
}

export interface UserVerifyOtpInputDTO { // verify otp input.
    email: string;
    otp: string;
}

export interface UserVerifyOtpOutputDTO { // verify otp output.
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface UserLoginInputDTO { // login input.
    email: string;
    password: string;
}

export interface UserLoginOutputDTO { // login output.
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

export interface UserForgotPasswordInpnutDTO { // forgot password input.
    email: string;
}

export interface UserResetPasswordInputDTO { // reset password input.
    email: string;
    otp: string;
    oldPassword: string;
    newPassword: string;
}

export interface UserResendOtpInputDTO { // resend otp input.
    email: string;
}