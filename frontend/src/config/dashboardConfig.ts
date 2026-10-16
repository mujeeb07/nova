// config/dashboardConfig.ts
import {
    LayoutDashboard, ShieldCheck, Store, Truck, Users, ShoppingBag, CreditCard, Percent,
    FolderTree, Megaphone, Sparkles, CheckSquare, HelpCircle, FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { roleConfigs } from "./roleConfig";
import type { RoleTheme } from "./roleConfig";

export interface NavItem {
    label: string;
    path: string;
    icon: LucideIcon;
}

export interface DashboardConfig {
    title: string;
    theme: RoleTheme;
    logoutRedirect: string;
    nav: NavItem[];
}

export const dashboardConfigs = {
    super_admin: {
        title: "⭐SUPER ADMIN CONSOLE",
        theme: roleConfigs.admin.theme,
        logoutRedirect: "/super-admin/login",
        nav: [
            { label: "Overview", path: "/super-admin/overview", icon: LayoutDashboard },
            { label: "Admins", path: "/super-admin/admins", icon: ShieldCheck },
            { label: "Vendors", path: "/super-admin/vendors", icon: Store },
            { label: "Delivery Partners", path: "/super-admin/delivery-partners", icon: Truck },
            { label: "Users", path: "/super-admin/users", icon: Users },
            { label: "Orders", path: "/super-admin/orders", icon: ShoppingBag },
            { label: "Settlements", path: "/super-admin/settlements", icon: CreditCard },
            { label: "Commission", path: "/super-admin/commission", icon: Percent },
            { label: "Catalog", path: "/super-admin/catalog", icon: FolderTree },
            { label: "Promotions", path: "/super-admin/promotions", icon: Megaphone },
            { label: "AI/Notifications", path: "/super-admin/notifications", icon: Sparkles },
            { label: "Verification Queue", path: "/super-admin/verification", icon: CheckSquare },
            { label: "Support & Complaints", path: "/super-admin/support", icon: HelpCircle },
            { label: "Audit Log", path: "/super-admin/audit-log", icon: FileText },
        ],
    },

    admin: {
        title: "ADMIN",
        theme: roleConfigs.admin.theme,
        logoutRedirect: "/admin/login",
        nav: [
            { label: "Overview", path: "/super-admin/overview", icon: LayoutDashboard },

        ]
    }

} satisfies Record<string, DashboardConfig>;