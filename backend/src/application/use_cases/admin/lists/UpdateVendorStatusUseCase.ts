import { IVendorRepository } from "../../../../domain/repositories/vendors/IVendorRepository";
import { AppError } from "../../../../utils/errors/AppError";
import { UpdateStatusDTO } from "../../../dtos/admin/list.dto";

export class UpdateVendorStatusUseCase {
    constructor(private _vendorRepository: IVendorRepository){}
    async execute({userId, status}: UpdateStatusDTO): Promise<void> {
        // console.log(status)
        const updatedVendor = await this._vendorRepository.updateStatus(userId, status);
        // console.log(`UPDATED VENDOR DATA: ${updatedVendor}`);
        if(!updatedVendor) throw new AppError("Vendor not found", 404);
    }
}