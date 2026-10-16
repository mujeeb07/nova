import { useEffect } from "react";
import apiClient from "../../../lib/apiClient";
import { useAuthStore } from "../../../store/authStore";
import { useLocation } from "react-router-dom";
import type { Role } from "../../../config/roleConfig";

export function useSessionBootstrap() {
    const location = useLocation();

    useEffect(() => {
        const { setSession, setChecking, clearSession } = useAuthStore.getState();
        if (location.pathname.startsWith("/super-admin")) {
            apiClient.get("/api/v1/auth/admin/me")
                .then((res: any) => {
                    const data = res.data ?? res;
                    const role = (data.role ?? "super_admin").toLowerCase() as Role;
                    const admin = data.admin ?? { id: data.accountId, name: data.name ?? "Super Admin" };

                    setSession({ admin }, role);
                })
                .catch(() => {
                    clearSession();
                })
                .finally(() => setChecking(false));
            return;
        }

        apiClient.get("/api/v1/auth/me")
            .then((res: any) => {
                const data = res.data ?? res;
                const role = (data.role ?? "user").toLowerCase() as Role;
                setSession(data, role);
            })
            .catch(() => clearSession())
            .finally(() => setChecking(false));
    }, []);
}