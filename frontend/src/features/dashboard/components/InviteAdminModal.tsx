import { useEffect, useState } from "react";
import { ADMIN_PERMISSIONS, useInviteAdmin, type AdminPermission } from "../hooks/useInviteAdmin";

interface InviteAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvited?: (email: string) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteAdminModal({ isOpen, onClose, onInvited }: InviteAdminModalProps) {
    const [email, setEmail] = useState("");
    const [permissions, setPermissions] = useState<AdminPermission[]>([]);
    const [error, setError] = useState("");
    const invite = useInviteAdmin();

    // reset every time the modal is opened
    useEffect(() => {
        if (isOpen) {
            setEmail("");
            setPermissions([]);
            setError("");
            invite.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    const toggle = (value: AdminPermission) =>
        setPermissions((prev) => (prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const cleanEmail = email.trim().toLowerCase();
        if (!EMAIL_RE.test(cleanEmail)) return setError("Please enter a valid email address.");
        if (permissions.length === 0) return setError("Select at least one permission.");

        invite.mutate(
            { email: cleanEmail, permissions },
            {
                onSuccess: () => {
                    onInvited?.(cleanEmail);
                    onClose();
                },
                onError: (err: any) =>
                    setError(err?.response?.data?.message ?? err?.message ?? "Failed to send invitation."),
            }
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4"
            onMouseDown={() => !invite.isPending && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="invite-admin-title"
                className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl border border-slate-200"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <h3 id="invite-admin-title" className="text-sm font-semibold text-slate-900">
                    Invite admin
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                    An invitation link will be sent to this email address.
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="invite-email" className="block text-xs font-medium text-slate-700 mb-1">
                            Email address
                        </label>
                        <input
                            id="invite-email"
                            type="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            disabled={invite.isPending}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <span className="block text-xs font-medium text-slate-700 mb-1">Permissions</span>
                        <div className="space-y-2">
                            {ADMIN_PERMISSIONS.map((p) => {
                                const checked = permissions.includes(p.value);
                                return (
                                    <label
                                        key={p.value}
                                        className={`flex items-center gap-3 px-3 py-2 text-xs border rounded-lg cursor-pointer transition-colors ${
                                            checked
                                                ? "border-slate-900 bg-slate-50"
                                                : "border-slate-200 bg-white hover:bg-slate-50"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            disabled={invite.isPending}
                                            onChange={() => toggle(p.value)}
                                            className="h-3.5 w-3.5 accent-slate-900"
                                        />
                                        <span className="text-slate-800">{p.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {error && (
                        <div className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <div className="pt-1 flex justify-end gap-2">
                        <button
                            type="button"
                            disabled={invite.isPending}
                            onClick={onClose}
                            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={invite.isPending}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
                        >
                            {invite.isPending ? "Sending..." : "Send invitation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}