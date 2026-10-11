import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail } from "lucide-react";
import { AuthCard } from "../../features/auth/components/AuthCard";
import { IconInput } from "../../features/auth/components/IconInput";
import { PasswordField } from "../../features/auth/components/PasswordField";
import { useRegister } from "../../features/auth/hooks/useRegister";
import { roleConfigs } from "../../config/roleConfig";

export function UserRegisterPage() {
    const config = roleConfigs.user;
    const navigate = useNavigate();
    const { mutate: register, isPending, error } = useRegister(config.apiBasePath);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);

    const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mismatch || !agreed) return;
        register(
            { name, email, password }, // confirmPassword and terms stay in the browser
            { onSuccess: () => navigate("/verify-otp", { state: { email } }) }
        );
    };

    return (
        <AuthCard theme={config.theme} brandName={config.brandName} tagline={config.tagline}>
            <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Create an Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <IconInput label="Full Name" icon={User} value={name} onChange={setName}
                    placeholder="John Doe" ringColor={config.theme.ring} />
                <IconInput label="Email Address" icon={Mail} type="email" value={email} onChange={setEmail}
                    placeholder="john@example.com" ringColor={config.theme.ring} />
                <PasswordField label="Password" value={password} onChange={setPassword}
                    ringColor={config.theme.ring} hint="Must be at least 8 characters." />
                <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword}
                    ringColor={config.theme.ring} />

                {mismatch && <p className="text-xs text-red-600">Passwords do not match.</p>}

                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 cursor-pointer" />
                    <span>
                        I agree to the{" "}
                        <a href="#terms" style={{ color: config.theme.primary }} className="hover:underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#privacy" style={{ color: config.theme.primary }} className="hover:underline">Privacy Policy</a>
                    </span>
                </label>

                {error && <p className="text-xs text-red-600">{(error as Error).message}</p>}

                <button type="submit" disabled={isPending || mismatch || !agreed}
                    style={{ backgroundColor: config.theme.primary }}
                    className="w-full text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm disabled:opacity-60">
                    {isPending ? "Creating account..." : "Create Account"}
                </button>

                <p className="text-center text-xs text-slate-400">
                    Already have an account?{" "}
                    <a href="/login" style={{ color: config.theme.primary }} className="font-medium hover:underline">Sign In</a>
                </p>
            </form>
        </AuthCard>
    );
}