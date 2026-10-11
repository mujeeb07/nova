// features/auth/components/GoogleButton.tsx
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { SocialLoginSection } from "./SocialLoginSection";
import type { RoleConfig } from "../../../config/roleConfig";

interface GoogleButtonProps {
    config: RoleConfig;
    onSuccess: (data: any) => void;
}

export function GoogleButton({ config, onSuccess }: GoogleButtonProps) {
    const { mutate, isPending, error } = useGoogleAuth(config.apiBasePath);

    const startGoogleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) =>
            mutate({ googleAccessToken: tokenResponse.access_token }, { onSuccess }),
        onError: () => console.error("Google sign-in failed"),
    });

    return (
        <div>
            <SocialLoginSection
                label="Google"
                isLoading={isPending}
                onClick={() => startGoogleLogin()}
            />
            {error && <p className="text-xs text-red-600 text-center mt-2">{(error as Error).message}</p>}
        </div>
    );
}