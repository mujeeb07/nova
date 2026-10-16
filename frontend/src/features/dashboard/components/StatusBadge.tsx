const STYLES: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    gray: "bg-slate-100 text-slate-600",
};

export function StatusBadge({ label, tone }: { label: string; tone: keyof typeof STYLES }) {
    return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STYLES[tone]}`}>{label}</span>;
}