export interface GoogleProfile {
    email: string;
    name: string;
    picture?: string;
    googleId: string;
}

export interface IGoogleAuthService {
    verifyAccessToken(accessToken: string): Promise<GoogleProfile>;
}