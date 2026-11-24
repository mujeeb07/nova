import { useEffect, useState } from "react";
import { PageHeader } from "../../../features/dashboard/components/PageHeader";
import { DataTable, type Column } from "../../../features/dashboard/components/DataTable";
import { ListToolbar, type SortOrder } from "../../../features/dashboard/components/ListToolbar";
import { StatusBadge } from "../../../features/dashboard/components/StatusBadge";
import { ListStatusControl } from "../../../features/dashboard/components/ListStatusControl";
import { ConfirmModal } from "../../../features/dashboard/components/ConfirmModal";
import { useAdminList } from "../../../features/dashboard/hooks/useAdminList";
import { useToggleStatus } from "../../../features/dashboard/hooks/useToggleStatus";
import { InviteAdminModal } from "../../../features/dashboard/components/InviteAdminModal";
import { ADMIN_PERMISSIONS } from "../../../features/dashboard/hooks/useInviteAdmin";

interface Admin {
    _id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    status: boolean;
    lastLoginAt?: string | null;
    createdAt: string;
}

type AdminSort = "createdAt" | "name" | "lastLoginAt";

const SORT_OPTIONS: { value: AdminSort; label: string }[] = [
    { value: "createdAt", label: "Created date" },
    { value: "name", label: "Name" },
    { value: "lastLoginAt", label: "Last login" },
];

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "blocked", label: "Blocked" },
];

const PERMISSION_LABELS: Record<string, string> = Object.fromEntries(
    ADMIN_PERMISSIONS.map((p) => [p.value, p.label])
);

const fmtDate = (iso?: string | null) =>
    iso
        ? new Date(iso).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "Never";

export default function AdminsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState<AdminSort>("createdAt");
    const [order, setOrder] = useState<SortOrder>("desc");

    const [inviteOpen, setInviteOpen] = useState(false);
    const [pendingToggle, setPendingToggle] = useState<{ admin: Admin; next: boolean } | null>(null);
    const [toast, setToast] = useState("");

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);
    useEffect(() => setPage(1), [debouncedSearch, status, sort, order]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(""), 3500);
        return () => clearTimeout(t);
    }, [toast]);

    const { data, isLoading, isFetching } = useAdminList<Admin>("admins", {
        page,
        search: debouncedSearch,
        status,
        sort,
        order,
    });

    const toggleStatus = useToggleStatus("admin");

    const confirmToggle = () => {
        if (!pendingToggle) return;
        toggleStatus.mutate(
            { id: pendingToggle.admin._id, isActive: pendingToggle.next },
            { onSettled: () => setPendingToggle(null) }
        );
    };

    const columns: Column<Admin>[] = [
        {
            header: "Admin",
            render: (a) => (
                <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                        {(a.name || a.email).charAt(0).toUpperCase()}
                    </span>
                    <div>
                        <div className="font-semibold text-slate-900">{a.name || "—"}</div>
                        <div className="text-slate-500">{a.email}</div>
                    </div>
                </div>
            ),
        },
        {
            header: "Permissions",
            render: (a) =>
                a.permissions?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                        {a.permissions.map((p) => (
                            <StatusBadge key={p} label={PERMISSION_LABELS[p] ?? p} tone="gray" />
                        ))}
                    </div>
                ) : (
                    <span className="text-slate-400">None</span>
                ),
        },
        { header: "Last login", render: (a) => <span className="text-slate-600">{fmtDate(a.lastLoginAt)}</span> },
        { header: "Joined", render: (a) => <span className="text-slate-600">{fmtDate(a.createdAt)}</span> },
        {
            header: "Status",
            render: (a) => (
                <ListStatusControl
                    mode="toggle"
                    isActive={a.status}
                    activeLabel="Active"
                    inactiveLabel="Blocked"
                    isLoading={toggleStatus.isPending && pendingToggle?.admin._id === a._id}
                    onChange={(next) => setPendingToggle({ admin: a, next })}
                />
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Admins"
                subtitle="Manage admin accounts and their permissions"
                right={
                    <button
                        type="button"
                        onClick={() => setInviteOpen(true)}
                        className="px-4 py-2 text-xs font-medium rounded-lg bg-[#524be3] hover:bg-[#433bc8] text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2"
                    >
                        + Invite admin
                    </button>
                }
            />

            <ListToolbar<AdminSort>
                search={search}
                onSearch={setSearch}
                status={status}
                onStatus={setStatus}
                statusOptions={STATUS_OPTIONS}
                sort={sort}
                onSort={setSort}
                sortOptions={SORT_OPTIONS}
                order={order}
                onSortOrder={setOrder}
            />

            <DataTable
                columns={columns}
                rows={data?.items ?? []}
                rowKey={(a) => a._id}
                loading={isLoading || (isFetching && !data)}
                page={page}
                totalPages={data?.totalPages ?? 1}
                total={data?.total ?? 0}
                onPageChange={setPage}
            />

            <InviteAdminModal
                isOpen={inviteOpen}
                onClose={() => setInviteOpen(false)}
                onInvited={(email) => setToast(`Invitation sent to ${email}`)}
            />

            <ConfirmModal
                isOpen={!!pendingToggle}
                title={pendingToggle?.next ? "Unblock admin?" : "Block admin?"}
                message={
                    pendingToggle?.next
                        ? `${pendingToggle?.admin.email} will regain access to the admin panel.`
                        : `${pendingToggle?.admin.email} will no longer be able to log in to the admin panel.`
                }
                confirmLabel={pendingToggle?.next ? "Unblock" : "Block"}
                tone={pendingToggle?.next ? "primary" : "danger"}
                isLoading={toggleStatus.isPending}
                onConfirm={confirmToggle}
                onCancel={() => setPendingToggle(null)}
            />

            {toast && (
                <div className="fixed bottom-6 right-6 z-[60] bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
}