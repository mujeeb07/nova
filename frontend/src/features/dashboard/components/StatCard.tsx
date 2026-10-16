import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    change?: number;
    highlight?: string;
}

export function StatCard({ label, value, icon: Icon, change, highlight }: StatCardProps) {
    return (
        <div
            className={`p-5 rounded-2xl border ${highlight ? "text-white border-transparent" : "bg-white border-slate-200"}`}
            style={highlight ? { backgroundColor: highlight } : undefined}
        >
            <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl grid place-items-center ${highlight ? "bg-white/15" : "bg-slate-100"}`}>
                    <Icon className="w-4 h-4" />
                </div>
                {change !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        change >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                        {change >= 0 ? "+" : ""}{change}%
                    </span>
                )}
            </div>
            <p className={`text-xs mt-4 ${highlight ? "text-white/70" : "text-slate-500"}`}>{label}</p>
            <h3 className="text-2xl font-bold mt-0.5">{value}</h3>
        </div>
    );
}