import { IVendor } from "../../../domain/entities/vendors/IVendor";

export const toVendorDomain = (raw:any): IVendor => {
    const { _id, __v, ...rest } = raw;
    return { id: _id.toString(), ...rest };
}