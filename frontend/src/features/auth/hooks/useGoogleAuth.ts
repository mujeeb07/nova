import { useMutation } from "@tanstack/react-query";
import { createAuthApi } from "../api/authApi";

export function useGoogleAuth(basePath: string) {
    const api = createAuthApi(basePath);
    return useMutation({ mutationFn: (d: {googleAccessToken: string}) => api.googleLogin(d)});
}