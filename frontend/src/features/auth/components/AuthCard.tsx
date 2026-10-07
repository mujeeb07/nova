import React from "react";

interface AuthCardTheme {
    primary: string;
    bg: string;
}

interface AuthCardProps {
    theme: AuthCardTheme;
    brandName: string;
    tagline?: string;
    logoSrc?: string;
    children: React.ReactNode;
}

export function AuthCard({ theme, brandName, tagline, logoSrc, children }: AuthCardProps) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4" style={{ backgroundColor: theme.bg }}>
            <div className="text-center mb-6">
                {logoSrc ? (
                    <img src={logoSrc} alt={brandName} className="h-8 mx-auto mb-2" />
                ) : (
                    <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: theme.primary }} >
                        {brandName}
                    </h1>
                )}
                {tagline && <p className="text-sm text-slate-400 mt-1">{tagline}</p>}
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                {children}
            </div>
        </div>
    );
}