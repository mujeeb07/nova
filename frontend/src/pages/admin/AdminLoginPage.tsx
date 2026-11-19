import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { roleConfigs } from "../../config/roleConfig";
import { useAuthStore } from "../../store/authStore";
import { AuthCard } from "../../features/auth/components/AuthCard";
import { LoginForm } from "../../features/auth/components/LoginForm";

export function AdminLoginPage() {
    const config = roleConfigs.admin;
    const navigate = useNavigate();
    const location = useLocation();
    const setSession = useAuthStore((s) => s.setSession);

    const passwordJustSet = location.state?.passwordSet;

    return (
        <AuthCard theme={config.theme} brandName={config.brandName}>
            <p className="text-sm text-slate-500 text-center mb-6">
                Sign in to manage the nova Marketplace.
            </p>

            {passwordJustSet && (
                <div className="flex items-center gap-2 p-3 mb-4 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Password set successfully. Please sign in to continue.</span>
                </div>
            )}

            <LoginForm
                config={config}
                showRegisterLink={false}
                forgotPasswordHref="/admin/forgot-password"
                afterLogin={(data) => {
                    setSession(data, config.role);
                    navigate(config.afterLoginRedirect);
                }}
            />
        </AuthCard>
    );
}