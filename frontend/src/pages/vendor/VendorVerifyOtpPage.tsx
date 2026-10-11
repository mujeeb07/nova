import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { roleConfigs } from "../../config/roleConfig";
import { OtpForm } from "../../features/auth/components/OtpForm";
import { AuthCard } from "../../features/auth/components/AuthCard";

export function VendorVerifyOtpPage() {
    const config = roleConfigs.vendor;
    const navigate = useNavigate();
    const email = (useLocation().state as { email?: string } | null)?.email;
    if (!email) return <Navigate to="/vendor/register" replace />;

    return (
        <AuthCard theme={config.theme} brandName={config.brandName} tagline={config.tagline}>
            <h2 className="text-xl font-bold text-slate-800 text-center mb-4">Verify your email</h2>
            <OtpForm config={config} email={email} onSuccess={() => navigate("/vendor/login", { replace: true })} />
        </AuthCard>
    );
}