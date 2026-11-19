import { IBaseRepository } from "../IBaseRepository";
import { IPasswordResettable } from "../shared/IPasswordResettable";
import { AccountRole } from "../../../application/services/ITokenService";
import { AdminProps } from "../../entities/admins/Admin";

export interface IAdminRepository extends IBaseRepository<AdminProps>, IPasswordResettable {
    findAllbyRole(role: AccountRole): Promise<AdminProps[]>;
    updateLastLogin(id: string): Promise<void>;
}