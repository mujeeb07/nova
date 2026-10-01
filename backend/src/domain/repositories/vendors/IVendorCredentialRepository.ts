import { IVendorCredentials } from "../../entities/vendors/IVendor";

export interface IVendorCredentialsRepository {
    create(credentials: IVendorCredentials): Promise<IVendorCredentials>;
    findByVendorId(vendorId: string): Promise<IVendorCredentials | null>;
}
