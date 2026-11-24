import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../lib/apiClient";

export const ADMIN_PERMISSIONS = [
    { value: "DELIVERY_PARTNER_SUPPORT", label: "Delivery partner support" },
    { value: "CUSTOMER_SUPPORT", label: "User support" },
    { value: "VENDOR_SUPPORT", label: "Vendor support" },
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number]["value"];

export interface InviteAdminPayload {
    email: string;
    permissions: AdminPermission[];
}

export const useInviteAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: InviteAdminPayload) => {
            const response = await apiClient.post("/api/v1/super-admin/admins/invite", payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
        },
    });
};