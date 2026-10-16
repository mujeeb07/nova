import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { PasswordField } from "./PasswordField";
import { useLogin } from "../hooks/useLogin";
import type { RoleConfig } from "../../../config/roleConfig";

interface LoginFormProps {
    config: RoleConfig;
    afterLogin: (data: any) => void;
    showForgotPassword?: boolean;
    showRegisterLink?: boolean;
    registerHref?: string;
    forgotPasswordHref?: string;
}


export function LoginForm({ 
    config, 
    afterLogin, 
    showForgotPassword = true, 
    showRegisterLink = true, 
    registerHref = "/register", 
    forgotPasswordHref = "/forgot-password",
}: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { mutate: login, isPending, error } = useLogin(config.apiBasePath);
   
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
            login({ email, password },{onSuccess:(data)=>{
                
                afterLogin(data)
            }});
    };

  

    return (
        <form onSubmit={handleSubmit} className="space-y-4">   
            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-9 pr-3 py-2 text-md border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-300"
                    />
                </div>
            </div>

            <PasswordField label="Password" value={password} onChange={setPassword} ringColor={config.theme.ring} />

            {showForgotPassword && (
                <div className="text-right">
                    <a href={forgotPasswordHref} className="text-xs font-semibold hover:underline" style={{ color: config.theme.primary }}>
                        Forgot password?
                    </a>
                </div>
            )}

            {error && <p className="text-xs text-red-600">{(error as Error).message}</p>}

            <button
                type="submit"
                disabled={isPending}
                style={{ backgroundColor: config.theme.primary }}
                className="w-full text-white text-sm py-2.5 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
                {isPending ? "Signing in..." : "Log In"} <ArrowRight size={16} />
            </button>

            {showRegisterLink && (
                <div className="text-center pt-2">
                    <span className="text-xs text-slate-400">
                        Don't have an account?{" "}
                        <a href={registerHref} className="font-medium hover:underline" style={{ color: config.theme.primary }}>
                            Sign Up
                        </a>
                    </span>
                </div>
            )}
        </form>
    );
}