import React, { useRef } from "react";

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    ringColor: string;
    length?: number;
}

export function OtpInput({ value, onChange, ringColor, length = 6 }: OtpInputProps) {
    const inputRefs = useRef<HTMLInputElement[]>([]);

    const digits = Array.from({ length }, (_, i) => value[i] ?? "");

    const update = (next: string[]) => onChange(next.join("").slice(0, length));

    const handleChange = (raw: string, index: number) => {
        const digit = raw.replace(/\D/g, "").slice(-1);
        if (!digit) return;

        const next = [...digits];
        next[index] = digit;
        update(next);

        if (index < length - 1) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const next = [...digits];
            if (next[index]) {
                next[index] = "";
                update(next);
            } else if (index > 0) {
                next[index - 1] = "";
                update(next);
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        if (!pasted) return;
        onChange(pasted);
        inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
    };

    return (
        <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { if (el) inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    style={{ "--tw-ring-color": ringColor } as React.CSSProperties}
                    className="w-12 h-12 text-center text-xl font-semibold text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                />
            ))}
        </div>
    );
}