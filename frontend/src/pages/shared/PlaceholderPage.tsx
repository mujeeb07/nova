import { useLocation } from "react-router-dom";

export function PlaceholderPage() {
    const name = useLocation().pathname.split("/").pop()?.replace(/-/g, " ");
    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center py-20">
            <h2 className="text-xl font-bold capitalize">{name}</h2>
            <p className="text-sm text-slate-500 mt-2">This module is coming soon.</p>
        </div>
    );
}