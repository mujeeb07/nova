import { create } from "zustand";

interface Session {
    role: "user" | "vendor" | "admin" | "delivery_partner";
    accessToken: string;
    accountId: string;
}

interface AuthState {
    session: Session | null;
    setSession: (data: any, role: Session["role"]) => void;
    clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    setSession: (data, role) =>
        set({ session: { role, accessToken: data.accessToken, accountId: data.vendor?.id ?? data.user?.id } }),
    clearSession: () => set({ session: null }),
}));