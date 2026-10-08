import { useState } from "react";
import type { RoleConfig } from "../../config/roleConfig";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../../features/auth/hooks/useForgotPassword";
import { AuthCard } from "../../features/auth/components/AuthCard";

export function ForgotPasswordPage({ config, routeBase }: { config: RoleConfig; routeBase: string }) {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { mutate, isPending, error } = useForgotPassword(config.apiBasePath);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ email }, { onSuccess: () => navigate(`${routeBase}/verify`, { state: { email } }) });
    };

    return (
        <AuthCard theme={config.theme} brandName={config.brandName} tagline={config.tagline}>
            <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Forgot password?</h2>
            <p className="text-sm text-slate-500 text-center mb-6">Enter your registered email and we'll send a code.</p>
            <form onSubmit={submit} className="space-y-4">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2" />
                {error && <p className="text-xs text-red-600">{(error as Error).message}</p>}
                <button type="submit" disabled={isPending} style={{ backgroundColor: config.theme.primary }}
                    className="w-full text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60">
                    {isPending ? "Sending..." : "Send code"}
                </button>
            </form>
        </AuthCard>
    );
}