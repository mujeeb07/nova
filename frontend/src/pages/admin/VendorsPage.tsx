import { useState } from "react";
import { PageHeader } from "../../features/dashboard/components/PageHeader";
import { DataTable, type Column } from "../../features/dashboard/components/DataTable";
import { ListToolbar } from "../../features/dashboard/components/ListToolbar";
import { StatusBadge } from "../../features/dashboard/components/StatusBadge";
import { useAdminList } from "../../features/dashboard/hooks/useAdminList";

interface VendorRow {
    id: string; shopName: string; ownerName: string; email: string; phone: string;
    city: string; rating: number; status: string; verificationStatus: string;
}

function vendorBadge(v: VendorRow) {
    if (v.status === "suspended") return <StatusBadge label="Suspended" tone="red" />;
    switch (v.verificationStatus) {
        case "verified": return <StatusBadge label="Active" tone="green" />;
        case "under_review": return <StatusBadge label="Under verification" tone="amber" />;
        case "rejected": return <StatusBadge label="Rejected" tone="red" />;
        default: return <StatusBadge label="Setup pending" tone="gray" />;
    }
}

const columns: Column<VendorRow>[] = [
    { header: "Vendor", render: (v) => <><div className="font-medium">{v.shopName}</div><div className="text-[11px] text-slate-500">{v.email}</div></> },
    { header: "Owner", render: (v) => <><div className="font-medium">{v.ownerName}</div><div className="text-[11px] text-slate-500">{v.phone}</div></> },
    { header: "Location", render: (v) => v.city },
    { header: "Rating", render: (v) => v.rating ? v.rating.toFixed(1) : "-" },
    { header: "Status", render: vendorBadge },
];

const STATUS_OPTIONS = [
    { value: "unsubmitted", label: "Setup pending" },
    { value: "under_review", label: "Under verification" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
];

export default function VendorsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const { data, isLoading } = useAdminList<VendorRow>("vendors", { page, search, status });

    return (
        <>
            <PageHeader title="Vendors" subtitle="Manage vendors across the NOVA marketplace." />
            <ListToolbar search={search} onSearch={(v) => { setSearch(v); setPage(1); }}
                status={status} onStatus={(v) => { setStatus(v); setPage(1); }} statusOptions={STATUS_OPTIONS} />
            <DataTable columns={columns} rows={data?.items ?? []} rowKey={(v) => v.id} loading={isLoading}
                page={page} totalPages={data?.totalPages ?? 1} total={data?.total ?? 0} onPageChange={setPage} />
        </>
    );
}