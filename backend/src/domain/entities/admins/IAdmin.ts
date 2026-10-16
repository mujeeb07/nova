export enum ROLE {
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
import { AccountRole } from "../../../application/services/ITokenService";
export enum PERMISSIONS {
    CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
    DELIVERY_PARTNER_SUPPORT = "DELIVERY_PARTNER_SUPPORT",
    VENDOR_SUPPORT = "VENDOR_SUPPORT"
}

export enum STATUS {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED"
}

export interface IAdmin {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: AccountRole;
    status: STATUS;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}