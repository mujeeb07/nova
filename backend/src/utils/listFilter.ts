import { ListQueryDTO } from "../application/dtos/admin/list.dto";

export function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function parseListQuery(q: any): ListQueryDTO {
    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(q.limit) || 10));
    return { page, limit, search: q.search?.toString().trim() || undefined, status: q.status?.toString() };
}