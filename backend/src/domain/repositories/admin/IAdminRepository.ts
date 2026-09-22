import { IAdmin } from "../../entities/admin/IAdmin";
import { IBaseRepository } from "../IBaseRepository";

export interface IAdminRepository extends IBaseRepository<IAdmin>{
    findByEmail(mail: string): Promise< IAdmin | null >
}