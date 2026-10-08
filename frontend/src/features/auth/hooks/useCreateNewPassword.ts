import { useMutation } from "@tanstack/react-query";
import { createAuthApi } from "../api/authApi";

export function useCreateNewPassword(basePath: string) {
    const api = createAuthApi(basePath);
    return useMutation({
        mutationFn: (d: { email: string; resetToken: string; newPassword: string; confirmPassword: string }) =>
            api.createNewPassword(d),
    });
}