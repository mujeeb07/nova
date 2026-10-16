import { IAdmin } from "../../../domain/entities/admins/IAdmin";

export interface AdminLoginInputDTO {
    email: string;
    password: string;
}

export interface AdminLoginOutputDTO {
    accessToken: string;
    refreshToken: string;
    admin: IAdmin;
}

export interface AdminForgotPasswordInputDTO {
    email: string;
}

