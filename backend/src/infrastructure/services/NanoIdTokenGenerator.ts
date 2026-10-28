import { customAlphabet } from "nanoid";
import { IInviteTokenGenerator } from "../../application/services/IInviteTokenGenerator";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const INVITE_TOKEN_LENGTH = 40;
const nano = customAlphabet(ALPHABET, INVITE_TOKEN_LENGTH);

export class NanoIdTokenGenerator implements IInviteTokenGenerator {
    generate(): string { return nano(); }
}