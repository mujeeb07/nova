import { IBaseRepository } from "../IBaseRepository";
import { IUser } from "../../entities/users/IUser";

export interface IUserRepository extends IBaseRepository<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}

