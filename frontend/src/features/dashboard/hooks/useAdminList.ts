import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "../../../lib/apiClient";

export interface ListParams { 
    page: number; 
    search: string; 
    status: string, 
    sort?: string,
    order?: "desc" | "asc"
}

export function useAdminList<T>(resource: string, p: ListParams) {
    return useQuery({
        queryKey: [resource, p],
        queryFn: async () =>
            await apiClient.get(`/api/v1/super-admin/${resource}`, {
                params: { 
                    page: p.page, 
                    limit: 10, 
                    search: p.search || undefined, 
                    status: p.status || undefined,
                    sort: p.sort || undefined,
                    order: p.order || undefined
                },
            })
            .then((r: any) => (r.data?.data ?? r.data) as { items: T[]; total: number; totalPages: number }),
        placeholderData: keepPreviousData,
    });
}