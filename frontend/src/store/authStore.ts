import { create } from "zustand";
import type { Role } from "../config/roleConfig";

interface Session { role: Role; accountId: string; name: string }

interface AuthState {
    session: Session | null;
    isChecking: boolean;
    setSession: (data: any, role: Role ) => void;
    clearSession: () => void;
    setChecking: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    isChecking: true,
    setSession: (data, role) =>
        set({
            session: {
                role,
                accountId: (data.user ?? data.vendor)?.id,
                name: (data.user ?? data.vendor)?.name ?? data.vendor?.shopName,
            },
        }),
    clearSession: () => set({ session: null }),
    setChecking: (v) => set({ isChecking: v }),
}));