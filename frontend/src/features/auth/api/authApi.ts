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
            apiClient.post(`${basePath}/forgot-password`, data).then((r) => r.data),

        verifyForgotOtp: (data: { email: string; otp: string }) =>
            apiClient.post(`${basePath}/forgot-password/verify`, data).then((r) => r.data),

        createNewPassword: (data: { email: string; resetToken: string; newPassword: string; confirmPassword: string }) =>
            apiClient.post(`${basePath}/forgot-password/create`, data).then((r) => r.data),
    };
}