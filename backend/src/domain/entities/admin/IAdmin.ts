export enum ROLE {
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

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
    role: ROLE;
    permissions: PERMISSIONS[];
    status: STATUS;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}