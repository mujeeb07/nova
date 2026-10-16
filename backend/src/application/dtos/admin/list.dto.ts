export interface ListQueryDTO { page: number; limit: number; search?: string; status?: string }
export interface PagedResultDTO<T> { items: T[]; total: number; page: number; totalPages: number }

export interface VendorRowDTO {
    id: string; shopName: string; ownerName: string; email: string; phone: string;
    city: string; rating: number; status: string; verificationStatus: string;
}
export interface UserRowDTO {
    id: string; name: string; email: string; phone: string | null; isVerified: boolean; status: "ACTIVE" | "BLOCKED";
}