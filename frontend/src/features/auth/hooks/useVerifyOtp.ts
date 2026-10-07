import { useMutation } from "@tanstack/react-query";
import { createAuthApi } from "../api/authApi";

interface VerifyOtpInput {
    email: string;
    otp: string;
}

export function useVerifyOtp(basePath: string) {
    const api = createAuthApi(basePath);
    return useMutation({
        mutationFn: (data: VerifyOtpInput) => api.verifyOtp(data),
    });
}