import { useMutation } from "@tanstack/react-query";
import { createAuthApi } from "../api/authApi";

export function useVerifyForgotOtp(basePath: string) {
    const api = createAuthApi(basePath);
    return useMutation({ mutationFn: (d: { email: string; otp: string }) => api.verifyForgotOtp(d) });
}