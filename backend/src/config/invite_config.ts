export const INVITE_CONFIG = {
    TTL_SECONDS: 2 * 24 * 60 * 60,
    FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
    ACCEPT_PATH: "/admin/accept-invite"
}