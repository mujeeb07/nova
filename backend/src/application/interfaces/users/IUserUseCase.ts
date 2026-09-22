import {
    UserRegisterInputDTO,
    UserVerifyOtpInputDTO, 

    UserLoginInputDTO, 
    UserLoginOutputDTO, 

    UserForgotPasswordInpnutDTO,
    UserResetPasswordInputDTO,

    UserResendOtpInputDTO
 } from "../../dtos/users/user.dto";
import { IUser } from "../../../domain/entities/users/IUser";


// retgister.
export interface IUserRegisterUseCase {
    execute(input: UserRegisterInputDTO): Promise<void>;
}

export interface IUserVerifyOtpUseCase {
    execute(input: UserVerifyOtpInputDTO): Promise<void>;
}

// login.
export interface IUserLoginUseCase {
    execute(input: UserLoginInputDTO): Promise<UserLoginOutputDTO>;
}

// forgot_password.
export interface IUserForgotPasswordUseCase {
    execute(input: UserForgotPasswordInpnutDTO): Promise<void>;
}

// reset_password.
export interface IUserResetPasswordUseCase {
    execute(input: UserResetPasswordInputDTO): Promise<void>;
}

// resend_otp.
export interface IUserResendOtpInputUseCase {
    execute(input: UserResendOtpInputDTO): Promise<void>;
}

// logout.
export interface IUserLogoutUseCase {
    execute(input: {accessToken?: string, refreshToken?: string}): Promise<boolean>;
}

// refresh_token.
export interface IUserRefreshTokenUseCase {
    execute(inpnut: string): Promise<string>;
}

// get_user_profile.
export interface IGetUserProfileUseCase {
    execute(id: string): Promise<IUser>
}

// google-auth.
export interface IUserGoogleAuthUseCase {
    execute(credential: string): Promise<UserLoginOutputDTO>
}

