interface BaseControlProps {
    isLoading?: boolean;
    disabled?: boolean;
}

interface ToggleProps extends BaseControlProps {
    mode: 'toggle';
    isActive: boolean;
    onChange: (nextState: boolean) => void | Promise<void>;
    activeLabel?: string;
    inactiveLabel?: string;
}

interface SelectProps extends BaseControlProps {
    mode: 'select';
    value: string;
    onChange: (nextValue: string) => void | Promise<void>;
    options: { value: string; label: string }[];
}

type ListStatusControlProps = ToggleProps | SelectProps;

export function ListStatusControl(props: ListStatusControlProps) {
    const { isLoading, disabled } = props;
    const isDisabled = disabled || isLoading;

    if (props.mode === 'toggle') {
        const { isActive, onChange, activeLabel = 'Unblock', inactiveLabel = 'Block' } = props;
        
        return (
            <button
                type="button"
                disabled={isDisabled}
                onClick={() => onChange(!isActive)}
                className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed
                    ${isActive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                        : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
            >
                {isLoading ? 'Updating...' : isActive ? activeLabel : inactiveLabel}
            </button>
        );
    }

    if (props.mode === 'select') {
        const { value, onChange, options } = props;

        // Dynamic background colors matching your vendor statuses
        const getVendorStyle = (val: string) => {
            switch (val) {
                case 'active': return 'border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-500';
                case 'pending': return 'border-amber-200 bg-amber-50 text-amber-700 focus:ring-amber-500';
                case 'suspended': return 'border-orange-200 bg-orange-50 text-orange-700 focus:ring-orange-500';
                case 'rejected': return 'border-rose-200 bg-rose-50 text-rose-700 focus:ring-rose-500';
                default: return 'border-slate-200 bg-white text-slate-700 focus:ring-slate-500';
            }
        };

        return (
            <div className="relative inline-block">
                <select
                    value={value}
                    disabled={isDisabled}
                    onChange={(e) => onChange(e.target.value)}
                    className={`px-2 py-1.5 text-xs border rounded-lg font-medium focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${getVendorStyle(value)}`}
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value} className="bg-white text-slate-900">
                          {o.label}
                        </option>
                    ))}
                </select>
                {isLoading && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                )}
            </div>
        );
    }
    return null;
}