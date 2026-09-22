import { IAdmin } from "../../../domain/entities/admin/IAdmin";


export interface AdminLoginInputDTO {
    email: string;
    password: string;
}

export interface AdminLoginOutputDTO {
    token: string;
    admin: {
        id: string;
        name: string;
        eamil: string;
        role: string;
    }
}