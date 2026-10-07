export type Role = "user" | "vendor" | "admin" | "delivery_partner";

export type AuthLayoutType = "centered" | "split" | "wizard";

export type RegisterFieldKey =
    | "name"
    | "firstName"
    | "lastName"
    | "phone"
    | "businessName"
    | "contactPerson"
    | "operationalZone";

export interface RegisterFieldDef {
    key: RegisterFieldKey;
    label: string;
    type: "text" | "tel" | "email";
    placeholder?: string;
}

export interface RoleTheme {
    primary: string;       
    primaryHover: string;
    ring: string;
    bg: string;
    bannerDark?: string; 
}

export interface RoleConfig {
    role: Role;
    apiBasePath: string;
    brandName: string;
    logoSrc?: string;          
    tagline?: string;          
    theme: RoleTheme;
    layout: AuthLayoutType;   
    registerFields: RegisterFieldDef[];
    afterLoginRedirect: string;
    afterRegisterRedirect: string;
}


export const roleConfigs: Record<Role, RoleConfig> = {
    user: {
        role: "user",
        apiBasePath: "/api/v1/auth/user",
        brandName: "nova",
        tagline: "Freshness delivered, daily.",
        theme: { primary: "#007BFF", primaryHover: "#1d4ed8", ring: "#3b82f6", bg: "#f8fafc" },
        layout: "centered",
        registerFields: [
            { key: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
            { key: "phone", label: "Phone Number", type: "tel" },
        ],
        afterLoginRedirect: "/home",
        afterRegisterRedirect: "/verify-otp",
    },

    vendor: {
        role: "vendor",
        apiBasePath: "/api/v1/auth/vendor",
        brandName: "nova Vendor",
        theme: {
            primary: "#065f46",
            primaryHover: "#064e3b",
            ring: "#059669",
            bg: "#f8fafc",
            bannerDark: "#022c22",
        },
        layout: "split",
        registerFields: [
            { key: "businessName", label: "Business Name", type: "text" },
            { key: "contactPerson", label: "Contact Person", type: "text" },
            { key: "phone", label: "Phone Number", type: "tel" },
        ],
        afterLoginRedirect: "/vendor/dashboard",
        afterRegisterRedirect: "/vendor/verify-otp",
    },

    admin: {
        role: "admin",
        apiBasePath: "/api/v1/auth/admin",
        brandName: "nova Super Admin Portal",
        theme: { primary: "#524be3", primaryHover: "#433bc8", ring: "#6366f1", bg: "#f3f5fc" },
        layout: "centered",
        registerFields: [],
        afterLoginRedirect: "/admin/overview",
        afterRegisterRedirect: "",
    },

    delivery_partner: {
        role: "delivery_partner",
        apiBasePath: "/api/v1/auth/delivery-partner",
        brandName: "nova Delivery",
        theme: { primary: "#2563eb", primaryHover: "#1d4ed8", ring: "#3b82f6", bg: "#f8fafc" },
        layout: "wizard",
        registerFields: [
            { key: "firstName", label: "First Name", type: "text" },
            { key: "lastName", label: "Last Name", type: "text" },
            { key: "phone", label: "Phone Number", type: "tel" },
            { key: "operationalZone", label: "City / Operational Zone", type: "text" },
        ],
        afterLoginRedirect: "/delivery/dashboard",
        afterRegisterRedirect: "/delivery/verify-otp",
    },
};