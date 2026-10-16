import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Search, Bell, LogOut } from "lucide-react";
import type { DashboardConfig } from "../../../config/dashboardConfig";
import { useAuthStore } from "../../../store/authStore";
import apiClient from "../../../lib/apiClient";

export function DashboardLayout({ config }: { config: DashboardConfig }) {
    const navigate = useNavigate();
    const session = useAuthStore((s) => s.session);
    const clearSession = useAuthStore((s) => s.clearSession);
    const { primary } = config.theme;

    const logout = async () => {
        try { await apiClient.post("/api/v1/auth/logout"); } catch { /* clear locally anyway */ }
        clearSession();
        navigate(config.logoutRedirect, { replace: true });
    };

    return (
        <div className="min-h-screen flex text-slate-800" style={{ backgroundColor: config.theme.bg }}>
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-screen flex flex-col">
                <div className="px-6 py-6 border-b border-slate-100">
                    <span className="text-xl font-extrabold tracking-tight" style={{ color: primary }}>nova</span>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-1">{config.title}</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {config.nav.map(({ label, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            style={({ isActive }) =>
                                isActive ? { backgroundColor: `${primary}1A`, color: primary } : undefined
                            }
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold">{session?.name ?? "Account"}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{session?.role?.replace("_", " ")}</p>
                    </div>
                    <button onClick={logout} title="Log out" className="text-slate-400 hover:text-slate-700">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            placeholder="Search..."
                            className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2"
                            style={{ "--tw-ring-color": config.theme.ring } as React.CSSProperties}
                        />
                    </div>
                    <Bell className="w-4 h-4 text-slate-500" />
                </header>

                <div className="p-8 space-y-8 flex-1">
                    <Outlet />  {/* the current page renders here */}
                </div>
            </main>
        </div>
    );
}