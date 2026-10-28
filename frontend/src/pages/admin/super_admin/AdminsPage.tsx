


interface AdminRow {
    name: string;
    role: string;
    status: "ACTIVE" | "BLOCKED" | "SUSPENDED";
    lastLogin: string;
    actions: string;
}