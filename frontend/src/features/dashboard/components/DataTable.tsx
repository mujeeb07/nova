export interface Column<T> { header: string; render: (row: T) => React.ReactNode; className?: string }

interface Props<T> {
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T) => string;
    loading?: boolean;
    page: number;
    totalPages: number;
    total: number;
    onPageChange: (p: number) => void;
}

export function DataTable<T>({ columns, rows, rowKey, loading, page, totalPages, total, onPageChange }: Props<T>) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                            {columns.map((c) => <th key={c.header} className={`py-4 px-6 ${c.className ?? ""}`}>{c.header}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading && <tr><td colSpan={columns.length} className="py-10 text-center text-slate-400">Loading...</td></tr>}
                        {!loading && rows.length === 0 && <tr><td colSpan={columns.length} className="py-10 text-center text-slate-400">Nothing found</td></tr>}
                        {rows.map((row) => (
                            <tr key={rowKey(row)} className="hover:bg-slate-50/60">
                                {columns.map((c) => <td key={c.header} className={`py-4 px-6 ${c.className ?? ""}`}>{c.render(row)}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>{total} total</span>
                <div className="flex items-center gap-2">
                    <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 border border-slate-200 rounded disabled:opacity-40">Prev</button>
                    <span>Page {page} of {Math.max(totalPages, 1)}</span>
                    <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 border border-slate-200 rounded disabled:opacity-40">Next</button>
                </div>
            </div>
        </div>
    );
}