import { useState } from "react";
import type { RoleConfig } from "../../config/roleConfig";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useVerifyForgotOtp } from "../../features/auth/hooks/useVerifyForgotOtp";
import { AuthCard } from "../../features/auth/components/AuthCard";
import { OtpInput } from "../../features/auth/components/OtpInput";

export function ForgotPasswordVerifyPage({ config, routeBase }: { config: RoleConfig; routeBase: string }) {
    const [otp, setOtp] = useState("");
    const [localError, setLocalError] = useState("")
    const navigate = useNavigate();
    const email = (useLocation().state as { email?: string } | null)?.email;
    const { mutate, isPending, error } = useVerifyForgotOtp(config.apiBasePath);

    if (!email) return <Navigate to={routeBase} replace />;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) return;

        mutate({ email, otp }, {
            onSuccess: (res) => {
                const resetToken = res?.resetToken;
                if (!resetToken) {
                    setLocalError("Something went wrong. Please try again.");
                    return;
                }
                navigate(`${routeBase}/create`, { state: { email, resetToken } });
            },
        });
    };

    return (
        <AuthCard theme={config.theme} brandName={config.brandName} tagline={config.tagline}>
            <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Check your email</h2>
            <p className="text-sm text-slate-500 text-center mb-6">We sent a code to {email}</p>

            <form onSubmit={submit} className="space-y-6">
                <OtpInput value={otp} onChange={setOtp} ringColor={config.theme.ring} />
                {localError && <p className="text-xs text-red-600 text-center">{localError}</p>}
                {error && <p className="text-xs text-red-600 text-center">{(error as Error).message}</p>}

                <button
                    type="submit"
                    disabled={isPending || otp.length !== 6}
                    style={{ backgroundColor: config.theme.primary }}
                    className="w-full text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60 transition-opacity"
                >
                    {isPending ? "Verifying..." : "Verify code"}
                </button>
            </form>
        </AuthCard>
    );
}