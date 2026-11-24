import { IVendorRepository } from "../../../../domain/repositories/vendors/IVendorRepository";
import { ListQueryDTO, VendorRowDTO, PagedResultDTO } from "../../../dtos/admin/list.dto";
import { escapeRegex } from "../../../../utils/listFilter";

export class ListVendorsUseCase {
    constructor(private _vendorRepository: IVendorRepository) {}

    async execute(q: ListQueryDTO): Promise<PagedResultDTO<VendorRowDTO>> {
        const filter: Record<string, any> = {};
        if (q.verificationStatus){ 
            filter.verificationStatus = q.verificationStatus
        }

        if (q.search) {
            const rx = new RegExp(escapeRegex(q.search), "i");
            filter.$or = [{ shopName: rx }, { ownerName: rx }, { email: rx }];
        }

        const dir: 1 | -1 = q.order === "desc" ? -1 : 1;
        const sort: Record<string, 1 | -1> = q.sort === "email" ? { email: dir} : { shopName: dir};

        const { items, total } = await this._vendorRepository.findPaginated(filter, q.page, q.limit, sort);
        
        // console.log("Items data:", items);
        return {
            items: items.map((v) => ({
                id: v.id, shopName: v.shopName, ownerName: v.ownerName, email: v.email, phone: v.phone,
                city: v.addresses[0]?.city ?? "-",
                rating: v.ratingSummary.average,
                status: v.status, 
                verificationStatus: v.verificationStatus,
            })),
            total, 
            page: q.page, 
            totalPages: Math.ceil(total / q.limit),
        };
    }
}