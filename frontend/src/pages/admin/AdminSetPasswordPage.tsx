import { useNavigate, useSearchParams } from "react-router-dom";
import { roleConfigs } from "../../config/roleConfig";
import { AuthCard } from "../../features/auth/components/AuthCard";
import { SetAdminPasswordForm } from "./SetAdminPasswordForm";

export function AdminSetPasswordPage() {
    const config = roleConfigs.admin;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const inviteToken = searchParams.get("token");

    return (
        <AuthCard theme={config.theme} brandName={config.brandName}>
            <p className="text-sm text-slate-500 text-center mb-6">
                Create a password to activate your Nova Admin account.
            </p>
            <SetAdminPasswordForm
                config={config}
                token={inviteToken}
                onSuccess={() => {
                    navigate("/admin/login", {
                        replace: true,
                        state: { passwordSet: true },
                    });
                }}
            />
        </AuthCard>
    );
}