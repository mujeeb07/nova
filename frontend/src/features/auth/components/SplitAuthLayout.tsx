import type { RoleConfig } from "../../../config/roleConfig";

interface Props {
    config: RoleConfig;
    quote?: string;
    caption?: string;
    bannerImage?: string;
    formSide?: "left" | "right";
    children: React.ReactNode;
}

export function SplitAuthLayout({ config, quote, caption, bannerImage, formSide="left", children }: Props) {
    const formOnRight = formSide === "right";

    return (
        <div className={`min-h-screen w-full flex flex-col ${formOnRight ? "lg:flex-row-reverse" : "lg:flex-row"}`} style={{ backgroundColor: config.theme.bg }}>
            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 sm:p-10">
                    {children}
                </div>
            </div>
            <div className="relative lg:w-1/2 min-h-[260px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 overflow-hidden"
                 style={{ backgroundColor: config.theme.bannerDark ?? "#1e293b" }}>
                <div className="absolute inset-0 bg-cover bg-center opacity-65 mix-blend-"
                     style={{ backgroundImage: `url('${bannerImage}')` }} />
                <span className="relative z-10 text-2xl font-bold text-white">{config.brandName}</span>
                <div className="relative z-10 max-w-md pt-12">
                    <blockquote className="text-xl sm:text-2xl font-medium text-white leading-snug">{quote}</blockquote>
                    {caption && <p className="text-xs text-emerald-200/80 mt-3 font-mono">{caption}</p>}
                </div>
            </div>
        </div>
    );
}