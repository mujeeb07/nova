import { Wallet, Percent, TrendingUp, ShoppingBag, FileText } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../../../features/dashboard/components/PageHeader";
import { StatCard } from "../../../features/dashboard/components/StatCard";
import { dashboardConfigs } from "../../../config/dashboardConfig";
import { useAuthStore } from "../../../store/authStore";


const RANGES = ["Today", "7 Days", "30 Days"] as const;

export function SuperAdminOverviewPage() {
    const { primary } = dashboardConfigs.super_admin.theme;
    const name = useAuthStore((s) => s.session?.name) ?? "there";
    const [range, setRange] = useState<(typeof RANGES)[number]>("7 Days");

    const stats = [
        { label: "GMV Today", value: "₹24,680", icon: Wallet, change: 12.5 },
        { label: "Platform Commission (Week)", value: "₹8,420", icon: Percent, highlight: primary },
        { label: "GMV This Week", value: "₹1,68,420", icon: TrendingUp },
        { label: "Active Orders", value: "126", icon: ShoppingBag, change: -2.1 },
        { label: "Avg Order Value", value: "₹486", icon: FileText },
    ];

    return (
        <>
            <PageHeader
                title={<>Good morning, <span style={{ color: primary }}>{name}</span></>}
                subtitle="Here's the latest overview of the NOVA platform."
                right={
                    <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1">
                        {RANGES.map((r) => (
                            <button key={r} onClick={() => setRange(r)}
                                className="px-3 py-1 rounded text-xs font-semibold"
                                style={range === r ? { backgroundColor: primary, color: "white" } : undefined}>
                                {r}
                            </button>
                        ))}
                    </div>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-base font-bold mb-4">Platform Growth</h3>
                    <div className="h-64 grid place-items-center text-sm text-slate-400">
                        Chart goes here (use recharts once real data exists)
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl space-y-3">
                    <h3 className="text-base font-bold">Super Admin Action</h3>
                    <div className="bg-white p-4 rounded-xl text-xs font-semibold">3 New Admin Requests</div>
                    <div className="bg-white p-4 rounded-xl text-xs font-semibold">2 Commission Override Requests</div>
                </div>
            </div>
        </>
    );
}