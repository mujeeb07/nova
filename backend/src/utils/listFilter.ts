import { ListQueryDTO } from "../application/dtos/admin/list.dto";

export function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function parseListQuery(query: Record<string, any>): ListQueryDTO {
    return { 
        page: Math.max(1, Number(query.page) || 1),
        limit: Math.max(1, Number(query.limit) || 10), 
        search: typeof query.search === "string" && query.search.trim() ? query.search.trim() : undefined,
        verificationStatus: typeof query.status === "string" && query.status.trim() ? query.status.trim() : undefined,
        sort: typeof query.sort === "string" && query.sort.trim() ? query.sort.trim() : undefined,
        order: query.order === "asc" ? "asc" : "desc",
    };
}



const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
    return EMAIL_RX.test(email);
}
