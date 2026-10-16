import { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import { ListQueryDTO, UserRowDTO, PagedResultDTO } from "../../../dtos/admin/list.dto";
import { escapeRegex } from "../../../../utils/listFilter";

export class ListUsersUseCase {
    constructor(private _userRepository: IUserRepository){}

    async execute(q: ListQueryDTO): Promise<PagedResultDTO<UserRowDTO>> {
        const filter: Record<string, any> = {};
        if (q.status === "ACTIVE") filter.status = true;
        if (q.status === "BLOCKED") filter.status = false;
        if (q.search) { 
            const rx = new RegExp(escapeRegex(q.search), "i"); 
            filter.$or = [{ name: rx }, { email: rx }]; 
        }

        const { items, total} = await this._userRepository.findPaginated(filter, q.page, q.limit);
        return {
            items: items.map((u) => ({
                id: u.id, 
                name: u.name, 
                email: u.email, 
                isVerified: u.isVerified, 
                phone: u.phone ?? null,
                status: u.status ? "ACTIVE" : "BLOCKED"
            })),
            total,
            page: q.page,
            totalPages: Math.ceil(total/ q.limit)
        }
    }
}
