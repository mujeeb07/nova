export interface IPasswordResettable {
    findAccountByEmail(email: string): Promise<string | null>;
    // verifyForgotPasswordOtp(otp: string): Promise<string | null>;
    updatePasswordHash(accountId: string, passwordHash: string): Promise<void>;
}