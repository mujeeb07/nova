// infrastructure/services/GoogleAuthService.ts
import { OAuth2Client } from "google-auth-library";
import type { IGoogleAuthService, GoogleProfile } from "../../application/services/IGoogleAuthService";
import { UnauthorizedError } from "../../utils/errors";

export class GoogleAuthService implements IGoogleAuthService {
    private _client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    async verifyAccessToken(accessToken: string): Promise<GoogleProfile> {
        try {
            const info = await this._client.getTokenInfo(accessToken);
            if (info.aud !== process.env.GOOGLE_CLIENT_ID) {
                throw new UnauthorizedError("Invalid Google token");
            }

            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new UnauthorizedError("Invalid Google token");

            const profile = (await res.json()) as {
                sub: string; email?: string; email_verified?: boolean; name?: string; picture?: string;
            };

            if (!profile.email || !profile.email_verified) {
                throw new UnauthorizedError("Google account email is not verified");
            }

            return {
                email: profile.email.toLowerCase(),
                name: profile.name ?? profile.email.split("@")[0],
                picture: profile.picture,
                googleId: profile.sub,
            };
        } catch (err) {
            if (err instanceof UnauthorizedError) throw err;
            throw new UnauthorizedError("Invalid Google token");
        }
    }
}