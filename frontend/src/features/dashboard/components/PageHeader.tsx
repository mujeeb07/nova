export function PageHeader({ title, subtitle, right }: { title: React.ReactNode; subtitle?: string; right?: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
            {right}
        </div>
    );
}