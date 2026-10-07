// pages/user/UserLoginPage.tsx
import { AuthCard } from "../../features/auth/components/AuthCard";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { roleConfigs } from "../../config/roleConfig";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function UserLoginPage() {
    const config = roleConfigs.user;
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);

    return (
        <AuthCard theme={config.theme} brandName={config.brandName} tagline={config.tagline}>
            <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Sign In</h2>
            <LoginForm
                config={config}
                registerHref="/register"
                onSuccess={(data) => {
                    setSession(data, "user");
                    navigate(config.afterLoginRedirect);
                }}
            />
        </AuthCard>
    );
}