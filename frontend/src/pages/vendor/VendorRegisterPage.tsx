import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, User, Mail, Phone } from "lucide-react";
import { SplitAuthLayout } from "../../features/auth/components/SplitAuthLayout";
import { IconInput } from "../../features/auth/components/IconInput";
import { PasswordField } from "../../features/auth/components/PasswordField";
import { useRegister } from "../../features/auth/hooks/useRegister";
import { roleConfigs } from "../../config/roleConfig";
import { REGISTER_BANNER } from "./vendorBanner";
import { BrandLogo } from "../../features/auth/components/BrandLogo";

export function VendorRegisterPage() {
    const config = roleConfigs.vendor;
    const navigate = useNavigate();
    const { mutate: register, isPending, error } = useRegister(config.apiBasePath);

    const [form, setForm] = useState({ businessName: "", contactPerson: "", email: "", phone: "", password: "" });
    const [agreed, setAgreed] = useState(false);
    const set = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) return;
        register(
            { shopName: form.businessName, ownerName: form.contactPerson, email: form.email, phone: form.phone, password: form.password },
            { onSuccess: () => navigate("/vendor/verify-otp", { state: { email: form.email } }) }
        );
    };

    return (
        <SplitAuthLayout config={config} bannerImage={REGISTER_BANNER} formSide="right"
            quote="Joining nova transformed our facility's throughput and connected us with premium enterprise clients.">
            <BrandLogo name={config.brandName} color={config.theme.primary} className="mb-8" />
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Grow your laundry business with nova</h1>
            <p className="text-xs text-slate-500 mb-6">Register your facility to access enterprise orders.</p>

            <form onSubmit={submit} className="space-y-4">
                <IconInput label="Business Name" icon={Store} value={form.businessName} onChange={set("businessName")} ringColor={config.theme.ring} />
                <IconInput label="Contact Person" icon={User} value={form.contactPerson} onChange={set("contactPerson")} ringColor={config.theme.ring} />
                <IconInput label="Email" icon={Mail} type="email" value={form.email} onChange={set("email")} ringColor={config.theme.ring} />
                <IconInput label="Phone Number" icon={Phone} type="tel" value={form.phone} onChange={set("phone")} ringColor={config.theme.ring} />
                <PasswordField label="Password" value={form.password} onChange={set("password")} ringColor={config.theme.ring} hint="At least 8 characters." />

                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                    I agree to the Terms of Service and Privacy Policy
                </label>

                {error && <p className="text-xs text-red-600">{(error as Error).message}</p>}

                <button type="submit" disabled={isPending || !agreed} style={{ backgroundColor: config.theme.primary }}
                    className="w-full text-white text-sm font-semibold py-3 rounded-lg disabled:opacity-60">
                    {isPending ? "Creating..." : "Create Vendor Account"}
                </button>
                <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
                    Already registered? <a href="/vendor/login" style={{ color: config.theme.primary }} className="font-semibold hover:underline">Log in</a>
                </p>
            </form>
        </SplitAuthLayout>
    );
}