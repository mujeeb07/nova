import { IBaseRepository } from "../IBaseRepository";
import { IPasswordResettable } from "../shared/IPasswordResettable";
import { IAdmin, STATUS } from "../../entities/admins/IAdmin";
import { AccountRole } from "../../../application/services/ITokenService";

export interface IAdminRepository extends IBaseRepository<IAdmin>, IPasswordResettable {
    findByEmail(email: string): Promise<IAdmin | null>;
    findAllbyRole(role: AccountRole): Promise<IAdmin[]>;
    updateStatus(id: string, status: STATUS): Promise<void>;
    updateLastLogin(id: string): Promise<void>;
}