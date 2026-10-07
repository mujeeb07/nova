import { LoginForm } from "../../features/auth/components/LoginForm";
import { roleConfigs } from "../../config/roleConfig";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function VendorLoginPage() {
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);

    return (
        <LoginForm
            config={roleConfigs.vendor}
            onSuccess={(data) => {
                setSession(data, "vendor");
                navigate(roleConfigs.vendor.afterLoginRedirect);
            }}
        />
    );
}