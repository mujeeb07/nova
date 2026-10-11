import { useMutation } from "@tanstack/react-query";
import { createAuthApi } from "../api/authApi";

export function useRegister(basepath: string) {
    const api = createAuthApi(basepath);
    return useMutation({
        mutationFn: (data: Record<string, string>) => api.register(data)
    });
}