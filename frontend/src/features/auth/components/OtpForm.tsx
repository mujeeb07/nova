import React, { useState } from "react";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { OtpInput } from "./OtpInput";
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
            
            <OtpInput value={otp} onChange={setOtp} ringColor={config.theme.ring} />

            {error && <p className="text-xs text-red-600 text-center">{(error as Error).message}</p>}

            <button
                type="submit"
                disabled={isPending || otp.length !== 6}
                style={{ backgroundColor: config.theme.primary }}
                className="w-full text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm disabled:opacity-60"
            >
                {isPending ? "Verifying..." : "Verify OTP"}
            </button>
        </form>
    );
}