import apiClient from "../../../lib/apiClient";

export function createAuthApi(basePath: string) {
    return {
        login: (data: { email: string; password: string }) =>
            apiClient.post(`${basePath}/login`, data).then((res) => res.data),

        register: (data: Record<string, string>) =>
            apiClient.post(`${basePath}/register`, data).then((res) => res.data),

        verifyOtp: (data: { email: string; otp: string }) =>
            apiClient.post(`${basePath}/verify-otp`, data).then((res) => res.data),

        forgotPassword: (data: { email: string }) =>
            apiClient.post(`${basePath}/forgot-password`, data).then((res) => res.data),

        resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
            apiClient.post(`${basePath}/reset-password`, data).then((res) => res.data),
    };
}