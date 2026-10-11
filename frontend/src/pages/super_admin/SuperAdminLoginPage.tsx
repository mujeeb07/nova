import { useNavigate } from "react-router-dom";
import { roleConfigs } from "../../config/roleConfig";
import { useAuthStore } from "../../store/authStore";
import { AuthCard } from "../../features/auth/components/AuthCard";
import { LoginForm } from "../../features/auth/components/LoginForm";

export function AdminLoginPage() {
    const config = roleConfigs.admin;
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);
    return (
        <AuthCard theme={config.theme} brandName={config.brandName}>
            <p className="text-sm text-slate-500 text-center mb-6">Sign in to manage the Nova Marketplace.</p>
            <LoginForm config={config} showRegisterLink={false} forgotPasswordHref="/admin/forgot-password"
                onSuccess={(d) => { setSession(d, "admin") navigate(config.afterLoginRedirect) }} />
        </AuthCard>
    );
}