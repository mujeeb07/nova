import { AdminForgotPasswordInputDTO, AdminLoginInputDTO, AdminLoginOutputDTO } from "../../dtos/admin/admin.dto";

// login.
export interface IAdminLoginUseCase {
    execute(input: AdminLoginInputDTO): Promise<AdminLoginOutputDTO>
}

// logout.
export interface IAdminLogoutUseCase {
    execute(input: {accessToek: string, refreshToken: string}): Promise<boolean>
}

// forgot_password.
export interface IAdminForgotPasswordUseCase {
    execute(input: AdminForgotPasswordInputDTO): Promise<void>
}