import { useNavigate } from "react-router-dom";
import { roleConfigs } from "../../config/roleConfig";
import { useAuthStore } from "../../store/authStore";
import { SplitAuthLayout } from "../../features/auth/components/SplitAuthLayout";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { LOGIN_BANNER } from "./vendorBanner";
import { BrandLogo } from "../../features/auth/components/BrandLogo";

export function VendorLoginPage() {
    const config = roleConfigs.vendor;
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);

    return (
        <SplitAuthLayout config={config} bannerImage={LOGIN_BANNER}  >
            <BrandLogo name={config.brandName} color={config.theme.primary} className="mb-8" />
            <h1 className="text-2xl font-bold text-slate-900 mb-6">sign in</h1>
            <LoginForm
                config={config}
                registerHref="/vendor/register"
                forgotPasswordHref="/vendor/forgot-password"
                afterLogin={(data) => {
                    setSession(data, "vendor");
                    navigate(config.afterLoginRedirect);
                }}
            />
        </SplitAuthLayout>
    );
}