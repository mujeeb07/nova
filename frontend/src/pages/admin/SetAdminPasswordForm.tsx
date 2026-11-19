import React, { useState, useMemo } from "react";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createAuthApi } from "../../features/auth/api/authApi";

interface SetAdminPasswordFormProps {
    config: {
        role: string;
        apiBasePath: string;
        theme?: {
            primaryButton?: string;
            [key: string]: any;
        };
        [key: string]: any;
    };
    token: string | null;
    onSuccess: () => void;
}

export function SetAdminPasswordForm({
    config,
    token,
    onSuccess,
}: SetAdminPasswordFormProps) {
    const authApi = useMemo(() => createAuthApi(config.apiBasePath), [config.apiBasePath]);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const buttonClasses =
        config.theme?.primaryButton ||
        "bg-[#4F46E5] hover:bg-[#4338CA] text-white";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("Invalid or missing invitation link. Please check your email.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);
            await authApi.setPassword({
                token,
                password,
                confirmPassword,
            });
            onSuccess();
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || "Failed to set password. The invitation link may have expired.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Set your password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Confirm password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 mt-2 text-sm font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${buttonClasses}`}
            >
                {isLoading ? "Setting password..." : "Set Password & Continue"}
            </button>
        </form>
    );
}