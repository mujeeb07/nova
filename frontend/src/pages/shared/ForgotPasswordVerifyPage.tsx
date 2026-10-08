// import { useState, useRef } from "react";
// import type { RoleConfig } from "../../config/roleConfig";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { useVerifyForgotOtp } from "../../features/auth/hooks/useVerifyForgotOtp";
// import { AuthCard } from "../../features/auth/components/AuthCard";



// export function ForgotPasswordVerifyPage({ config, routeBase }: { config: RoleConfig; routeBase: string }) {
//     const [otp, setOtp] = useState("");
//     const navigate = useNavigate();
//     const email = (useLocation().state as { email?: string } | null)?.email;
//     const { mutate, isPending, error } = useVerifyForgotOtp(config.apiBasePath);

//     if (!email) return <Navigate to={routeBase} replace />;

//     const submit = (e: React.FormEvent) => {
//         e.preventDefault();
//         mutate({ email, otp }, {
//             onSuccess: (res) =>
//                 navigate(`${routeBase}/create`, { state: { email, resetToken: res.data.resetToken } }),
//         });
//     };

//     return (
//         <AuthCard theme={config.theme} brandName={config.brandName} tagline={config.tagline}>
//             <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Check your email</h2>
//             <p className="text-sm text-slate-500 text-center mb-6">We sent a code to {email}</p>
//             <form onSubmit={submit} className="space-y-4">
//                 <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required
//                     placeholder="Enter 6-digit code"
//                     className="w-full text-center tracking-[0.5em] text-lg py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2" />
//                 {error && <p className="text-xs text-red-600 text-center">{(error as Error).message}</p>}
//                 <button type="submit" disabled={isPending} style={{ backgroundColor: config.theme.primary }}
//                     className="w-full text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60">
//                     {isPending ? "Verifying..." : "Verify code"}
//                 </button>
//             </form>
//         </AuthCard>
//     );
// }

import { useState, useRef } from "react";
import type { RoleConfig } from "../../config/roleConfig";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useVerifyForgotOtp } from "../../features/auth/hooks/useVerifyForgotOtp";
import { AuthCard } from "../../features/auth/components/AuthCard";

export function ForgotPasswordVerifyPage({ config, routeBase }: { config: RoleConfig; routeBase: string }) {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const email = (useLocation().state as { email?: string } | null)?.email;
    const { mutate, isPending, error } = useVerifyForgotOtp(config.apiBasePath);

    // Create a mutable array of refs to hold references to the 6 inputs
    const inputRefs = useRef<HTMLInputElement[]>([]);

    if (!email) return <Navigate to={routeBase} replace />;

    // Convert the current OTP string into a 6-element array for rendering safety
    const otpArray = otp.padEnd(6, " ").split("").slice(0, 6);

    const handleChange = (value: string, index: number) => {
        // Strip away non-numeric inputs
        const cleanValue = value.replace(/[^0-9]/g, "");
        if (!cleanValue && value !== "") return;

        const newOtp = otp.padEnd(6, " ").split("");
        // Keep only the last character entered to allow simple overwriting
        newOtp[index] = cleanValue.slice(-1) || " ";
        
        const combinedOtp = newOtp.join("").trimEnd();
        setOtp(combinedOtp);

        // Move to the next box if a digit was successfully typed
        if (cleanValue && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            // If the box is empty, delete the value in the previous box and shift focus back
            if (!otp[index] || otp[index] === " ") {
                if (index > 0) {
                    const newOtp = otp.padEnd(6, " ").split("");
                    newOtp[index - 1] = " ";
                    setOtp(newOtp.join("").trimEnd());
                    inputRefs.current[index - 1]?.focus();
                }
            } else {
                // If the box has a character, clear it
                const newOtp = otp.padEnd(6, " ").split("");
                newOtp[index] = " ";
                setOtp(newOtp.join("").trimEnd());
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
        
        if (pastedData) {
            setOtp(pastedData);
            // Move focus to either the next empty box or the absolute last slot
            const targetIndex = Math.min(pastedData.length, 5);
            inputRefs.current[targetIndex]?.focus();
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure the OTP string is sanitized and exactly 6 digits long before firing the mutation
        const exactOtp = otp.replace(/\s/g, "");
        if (exactOtp.length !== 6) return;

        mutate({ email, otp: exactOtp }, {
            onSuccess: (res) =>
                navigate(`${routeBase}/create`, { state: { email, resetToken: res.data.resetToken } }),
        });
    };

    return (
        <AuthCard theme={config.theme} brandName={config.brandName} tagline={config.tagline}>
            <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Check your email</h2>
            <p className="text-sm text-slate-500 text-center mb-6">We sent a code to {email}</p>
            
            <form onSubmit={submit} className="space-y-6">
                {/* 6-Box OTP Flex Container */}
                <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <input
                            key={index}
                            ref={(el) => { if (el) inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={otpArray[index] === " " ? "" : otpArray[index]}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 text-center text-xl font-semibold text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 transition-all"
                            style={{ 
                                // Dynamic ring color matching your brand theme when focused
                                '--tw-ring-color': config.theme.primary 
                            } as React.CSSProperties}
                            required
                        />
                    ))}
                </div>

                {error && <p className="text-xs text-red-600 text-center">{(error as Error).message}</p>}
                
                <button 
                    type="submit" 
                    disabled={isPending || otp.replace(/\s/g, "").length !== 6} 
                    style={{ backgroundColor: config.theme.primary }}
                    className="w-full text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60 transition-opacity"
                >
                    {isPending ? "Verifying..." : "Verify code"}
                </button>
            </form>
        </AuthCard>
    );
}
