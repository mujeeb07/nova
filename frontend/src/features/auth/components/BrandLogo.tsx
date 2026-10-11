interface Props {
    name: string;
    color: string;
    className: string;
}

export function BrandLogo({ name, color, className = "" }: Props) {
    return (
        <div
            className={`text-center text-2xl font-bold ${className}`}
            style={{ color }}
        >
            {name}
        </div>
    );
}