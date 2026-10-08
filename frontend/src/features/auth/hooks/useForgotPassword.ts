import { useMutation } from "@tanstack/react-query";
import { createAuthApi } from "../api/authApi";

export function useForgotPassword(basePath: string) {
    const api = createAuthApi(basePath);
    return useMutation({ mutationFn: (d: { email: string }) => api.forgotPassword(d) });
}