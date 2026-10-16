interface Props {
    search: string; onSearch: (v: string) => void;
    status: string; onStatus: (v: string) => void;
    statusOptions: { value: string; label: string }[];
}

export function ListToolbar({ search, onSearch, status, onStatus, statusOptions }: Props) {
    return (
        <div className="flex flex-wrap gap-3">
            <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search..."
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white w-64 focus:outline-none focus:ring-2" />
            <select value={status} onChange={(e) => onStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white">
                <option value="">All statuses</option>
                {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}