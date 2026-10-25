import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "../../../lib/apiClient";

export interface ListParams { page: number; search: string; status: string }

export function useAdminList<T>(resource: "vendors" | "users", p: ListParams) {
    return useQuery({
        queryKey: [resource, p],
        // queryFn: async () =>
        //     await apiClient.get(`/api/v1/super-admin/${resource}`, {
        //         params: { page: p.page, limit: 10, search: p.search || undefined, status: p.status || undefined },
        //     })
        //     .then((r: any) => (r.data?.data ?? r.data) as { items: T[]; total: number; totalPages: number }),
        // placeholderData: keepPreviousData,
        queryFn: async () => {
            const body: any = await apiClient.get(`/api/v1/super-admin/${resource}`, {
                params: { page: p.page, limit: 10, search: p.search || undefined, status: p.status || undefined },
            });
            console.log("useAdminList body:", body); // check the real shape once, then remove
            return (body.data ?? body) as { items: T[]; total: number; totalPages: number };
        },
    });
}