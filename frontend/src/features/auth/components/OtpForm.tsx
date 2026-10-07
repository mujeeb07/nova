import React, { useState } from "react";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import type { RoleConfig } from "../../../config/roleConfig";

interface OtpFormProps {
    config: RoleConfig;
    email: string;
    onSuccess: (data: any) => void;
}

export function OtpForm({ config, email, onSuccess }: OtpFormProps) {
    const [otp, setOtp] = useState("");
    const { mutate: verifyOtp, isPending, error } = useVerifyOtp(config.apiBasePath);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        verifyOtp({ email, otp }, { onSuccess });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slate-500 text-center">
                We sent a code to <span className="font-semibold text-slate-700">{email}</span>
            </p>

            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                className="w-full text-center tracking-[0.5em] text-lg py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            />

            {error && <p className="text-xs text-red-600 text-center">{(error as Error).message}</p>}

            <button
                type="submit"
                disabled={isPending}
                style={{ backgroundColor: config.theme.primary }}
                className="w-full text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm disabled:opacity-60"
            >
                {isPending ? "Verifying..." : "Verify OTP"}
            </button>
        </form>
    );
}