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
    setSession: (data, role) =>{
        const account = data.admin ?? data.user ?? data.vendor;

    set({
        session: account
            ? {
                  role,
                  accountId: account.id,
                  name: account.name ?? account.shopName ?? "",
              }
            : null,
    });},
    clearSession: () => set({ session: null }),
    setChecking: (v) => set({ isChecking: v }),
}));