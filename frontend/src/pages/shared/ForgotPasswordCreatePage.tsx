import { useState } from "react";
import type { RoleConfig } from "../../config/roleConfig";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useCreateNewPassword } from "../../features/auth/hooks/useCreateNewPassword";
import { AuthCard } from "../../features/auth/components/AuthCard";
import { PasswordField } from "../../features/auth/components/PasswordField";



export function ForgotPasswordCreatePage({ config, routeBase, loginPath }: { config: RoleConfig; routeBase: string; loginPath: string }) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const state = useLocation().state as { email?: string; resetToken?: string } | null;
    const { mutate, isPending, error } = useCreateNewPassword(config.apiBasePath);

    if (!state?.email || !state?.resetToken) return <Navigate to={routeBase} replace />;

    const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mismatch) return;
        mutate(
            { email: state.email!, resetToken: state.resetToken!, newPassword, confirmPassword },
            { onSuccess: () => navigate(loginPath, { replace: true }) }
        );
    };

    return (
        <AuthCard theme={config.theme} brandName={config.brandName} tagline={config.tagline}>
            <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Create new password</h2>
            <form onSubmit={submit} className="space-y-4">
                <PasswordField label="New password" value={newPassword} onChange={setNewPassword}
                    ringColor={config.theme.ring} hint="Must be at least 8 characters." />
                <PasswordField label="Confirm password" value={confirmPassword} onChange={setConfirmPassword}
                    ringColor={config.theme.ring} />
                {mismatch && <p className="text-xs text-red-600">Passwords do not match.</p>}
                {error && <p className="text-xs text-red-600">{(error as Error).message}</p>}
                <button type="submit" disabled={isPending || mismatch} style={{ backgroundColor: config.theme.primary }}
                    className="w-full text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60">
                    {isPending ? "Saving..." : "Update password"}
                </button>
            </form>
        </AuthCard>
    );
}