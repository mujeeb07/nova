import { ListSortDescendingIcon } from "lucide-react";
interface SortOptionItem<T extends string> {
  value: T;
  label: string;
};

export type SortOrder = "asc" | "desc";

interface Props <T extends string = string> {
    search: string; 
    onSearch: (v: string) => void;
    status: string; 
    onStatus: (v: string) => void;
    statusOptions: { value: string; label: string }[];
    sort: T;
    onSort: (v: NoInfer <T>) => void;
    sortOptions: SortOptionItem<T>[];
    order: SortOrder;
    onSortOrder: (v: SortOrder) => void;
}

export function ListToolbar<T extends string>({ 
    search, 
    onSearch, 
    status, 
    onStatus, 
    statusOptions,
    sort,
    onSort,
    sortOptions,
    order,
    onSortOrder
    }: Props<T>) {
    return (
        <div className="flex flex-wrap gap-3">
            <input 
                value={search} 
                onChange={(e) => onSearch(e.target.value)} 
                placeholder="Search..."
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white w-64 focus:outline-none focus:ring-2" 
            />
            <select 
                value={status} 
                onChange={(e) => onStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
            >
                <option value="">All statuses</option>
                {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ListSortDescendingIcon className="px-1 py-1" />
            <select
                value={sort}
                onChange={(e) => onSort(e.target.value as T)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
            >
                {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <button
                type="button"
                onClick={() => onSortOrder(order === "asc" ? "desc" : "asc")}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white hover:bg-slate-50"
            >
                {order === "asc" ? "↑ ASC" : "↓ DESC"}
            </button>
        </div>
    );
}