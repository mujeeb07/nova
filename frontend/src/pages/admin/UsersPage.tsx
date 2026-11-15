import { useState } from "react";
import { PageHeader } from "../../features/dashboard/components/PageHeader";
import { DataTable, type Column } from "../../features/dashboard/components/DataTable";
import { ListToolbar } from "../../features/dashboard/components/ListToolbar";
import { StatusBadge } from "../../features/dashboard/components/StatusBadge";
import { useAdminList } from "../../features/dashboard/hooks/useAdminList";
import { ListStatusControl } from "../../features/dashboard/components/ListStatusControl";
import { useToggleUserStatus } from "../../features/dashboard/hooks/useToggleUserStatus";
import { ConfirmModal } from "../../features/dashboard/components/ConfirmModal";


interface UserRow {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    isVerified: boolean;
    status: "ACTIVE" | "BLOCKED";
}

const STATUS_OPTIONS = [
    { value: "true", label: "Active" },
    { value: "false", label: "Blocked" },
];

type SortOption = "name" | "email";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "name", label: "By Name" },
    { value: "email", label: "By Email" },
]


export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [sort, setSort] = useState<SortOption>("name");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [pendingAction, setPendingAction] = useState<{ user: UserRow; nextState: boolean; } | null>(null);


    const { data, isLoading, refetch } = useAdminList<UserRow>("users", { page, search, status, sort, order });

    const { mutateAsync: toggleStatus } = useToggleUserStatus();

    const handleToggleStatus = async (
        userId: string, 
        nextState: boolean 
    ): Promise <void> => {
        setLoadingMap((prev) => ({ ...prev, [userId]: true }));

        try {
            await toggleStatus({userId, isActive: nextState});
            await refetch(); 
        } catch (error) {
            console.error("Failed to update user status:", error);
        } finally {
            setLoadingMap((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleConfirmToggle = async () => {
        if(!pendingAction) return;
        const { user, nextState } = pendingAction;

        await handleToggleStatus(user.id, nextState);
        setPendingAction(null);
    }

    const columns: Column<UserRow>[] = [
        {
            header: "User",
            render: (u) => (
                <>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                </>
            ),
        },
        { header: "Phone", render: (u) => u.phone ?? "-" },
        {
            header: "Email verified",
            render: (u) => u.isVerified 
                    ? <StatusBadge label="Verified" tone="green" /> 
                    : <StatusBadge label="Not verified" tone="amber" />
        },
        {
            header: "Status",
            render: (u) =>
                u.status === "ACTIVE"
                    ? <StatusBadge label="Active" tone="green" />
                    : <StatusBadge label="Blocked" tone="red" />
        },
        {
            header: "Actions",
            render: (u) => (
                <ListStatusControl
                    mode="toggle"
                    isActive={u.status === "ACTIVE"}
                    activeLabel="Block"
                    inactiveLabel="Unblock"
                    isLoading={loadingMap[u.id] || false}
                    onChange={(nextStatus) => setPendingAction({ user:u, nextState: nextStatus })}
                />
            ),
        },
    ];

    return (
        <>
            <PageHeader title="Users" subtitle="Manage customers across the NOVA marketplace." />
            <ListToolbar
                search={search}
                onSearch={(v) => { setSearch(v); setPage(1); }}
                status={status}
                onStatus={(v) => { setStatus(v); setPage(1); }}
                statusOptions={STATUS_OPTIONS}
                sort={sort}
                onSort={(v) => { setSort(v); setPage(1)}}
                sortOptions={SORT_OPTIONS}
                order={order}
                onSortOrder={(v) => { setOrder(v); setPage(1) }}
            />
            <DataTable
                columns={columns}
                rows={data?.items ?? []}
                rowKey={(u) => u.id}
                loading={isLoading}
                page={page}
                totalPages={data?.totalPages ?? 1}
                total={data?.total ?? 0}
                onPageChange={setPage}
            />
            <ConfirmModal
                isOpen={ pendingAction !== null}
                title={pendingAction?.nextState ? "Unblock User" : "Block User"}
                message={
                    pendingAction 
                        ? `Are you sure want to ${pendingAction.nextState ? "unblock" : "block"} ${pendingAction.user.name} (${pendingAction.user.email})?`
                        : ""
                }
                confirmLabel={ pendingAction?.nextState ? "Yes, Unblock" : "Yes, Block"}
                tone={pendingAction?.nextState ? "primary" : "danger"}
                isLoading={pendingAction ? loadingMap[pendingAction.user.id] || false : false}
                onCancel={() => setPendingAction(null)}
                onConfirm={handleConfirmToggle}
            />
        </>
    );
}
