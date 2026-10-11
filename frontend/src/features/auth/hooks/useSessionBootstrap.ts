import { useEffect } from "react";
import apiClient from "../../../lib/apiClient";
import { useAuthStore } from "../../../store/authStore";

export function useSessionBootstrap() {
    useEffect(() => {
        const { setSession, setChecking } = useAuthStore.getState();
        apiClient.get("/api/v1/auth/me")
            .then((res: any) => {
                const me = res.data ?? res;
                setSession({ user: { id: me.accountId } }, me.role);
            })
            .catch(() => {})
            .finally(() => setChecking(false));
    }, []);
}