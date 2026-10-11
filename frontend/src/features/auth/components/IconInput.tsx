import React from "react";
import type { LucideIcon } from "lucide-react";

interface IconInputProps {
    label: string;
    icon: LucideIcon;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    ringColor: string;
}

export function IconInput({ label, icon: Icon, type = "text", value, onChange, placeholder, ringColor }: IconInputProps) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
            <div className="relative">
                <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required
                    style={{ "--tw-ring-color": ringColor } as React.CSSProperties}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-300"
                />
            </div>
        </div>
    );
}