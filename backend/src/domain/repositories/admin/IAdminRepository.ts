import { IBaseRepository } from "../IBaseRepository";
import { IPasswordResettable } from "../shared/IPasswordResettable";
import { IAdmin } from "../../entities/admins/IAdmin";
import { AccountRole } from "../../../application/services/ITokenService";

export interface IAdminRepository extends IBaseRepository<IAdmin>, IPasswordResettable {
    findAllbyRole(role: AccountRole): Promise<IAdmin[]>;
    updateLastLogin(id: string): Promise<void>;
}