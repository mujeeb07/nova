import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    ringColor: string;
    hint?: string;
}

export function PasswordField({ label, value, onChange, ringColor, hint }: PasswordFieldProps) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
            <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                    required
                    style={{ "--tw-ring-color": ringColor } as React.CSSProperties}
                    className="w-full pl-9 pr-9 py-2 text-md border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-300"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
        </div>
    );
}