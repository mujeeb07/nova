import { IAdmin } from "../../entities/admins/IAdmin";
import { IBaseRepository } from "../IBaseRepository";

export interface ISuperAdminRepository extends IBaseRepository<IAdmin> {
    findByEmail(email: string): Promise<IAdmin | null >
}