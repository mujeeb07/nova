import { OAuth2Client } from "google-auth-library";
import type { IGoogleAuthService, GoogleProfile } from "../../application/services/IGoogleAuthService";
import { AppError } from "../../utils/errors/AppError";

export class GoogleAuthService implements IGoogleAuthService {
    private _client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    async verifyAccessToken(accessToken: string): Promise<GoogleProfile> {
        try {
            const info = await this._client.getTokenInfo(accessToken);
            if (info.aud !== process.env.GOOGLE_CLIENT_ID) {
                throw new AppError("Invalid Google token", 401);
            }

            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new AppError("Invalid Google token", 401);

            const profile = (await res.json()) as {
                sub: string; email?: string; email_verified?: boolean; name?: string; picture?: string;
            };

            if (!profile.email || !profile.email_verified) {
                throw new AppError("Google account email is not verified", 401);
            }

            return {
                email: profile.email.toLowerCase(),
                name: profile.name ?? profile.email.split("@")[0],
                picture: profile.picture,
                googleId: profile.sub,
            };
        } catch (err) {
            throw new AppError("Invalid Google token", 401);
        }
    }
}