interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: "danger" | "primary";
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    tone = "danger",
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const confirmBtnClass =
        tone === "danger"
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-slate-900 hover:bg-slate-800 text-white";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{message}</p>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onCancel}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg disabled:opacity-50 ${confirmBtnClass}`}
                    >
                        {isLoading ? "Processing..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
