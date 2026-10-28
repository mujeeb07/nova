import { AdminForgotPasswordInputDTO, AdminInviteInputDTO, AdminLoginInputDTO, AdminLoginOutputDTO } from "../../dtos/admin/admin.dto";

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

// invite new admin.
export interface IAdminInviteUseCase {
    execute(input: AdminInviteInputDTO): Promise<void>
}