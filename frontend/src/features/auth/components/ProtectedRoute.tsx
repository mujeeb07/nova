import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import type { Role } from "../../../config/roleConfig";

export function ProtectedRoute({ role, loginPath }: { role: Role; loginPath: string }) {
    const { session, isChecking } = useAuthStore();
    if (isChecking) return <div className="min-h-screen grid place-items-center text-slate-400">Loading...</div>;
    if (!session || session.role !== role) return <Navigate to={loginPath} replace />;
    return <Outlet />;
}