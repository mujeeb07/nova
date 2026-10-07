import { useMutation } from "@tanstack/react-query";
import { createAuthApi } from "../api/authApi";

interface LoginInput {
    email: string;
    password: string;
}

export function useLogin(basePath: string) {
    const api = createAuthApi(basePath);
    return useMutation({
        mutationFn: (data: LoginInput) => api.login(data)
    });
}