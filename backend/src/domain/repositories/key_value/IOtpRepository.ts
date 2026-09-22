export interface IKeyValueRepository {
    set( key: string, otp: string, ttlSeconds: number ): Promise<void>;
    get( key: string ): Promise<string | null>;
    del( key: string ): Promise<void>;
}