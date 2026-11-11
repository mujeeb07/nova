import { IUserRepository } from "../../../../domain/repositories/users/IUserRepository";
import { AppError } from "../../../../utils/errors/AppError";
import { UpdateStatusDTO } from "../../../dtos/admin/list.dto";

export class UpdateUserStatusUseCase {
    constructor(private _userRepository: IUserRepository) {}
    async execute({ userId, status }: UpdateStatusDTO): Promise<void> {
        const updatedUser = await this._userRepository.updateStatus(userId, status);
        if (!updatedUser) {
            throw new AppError("User not found", 404);
        }
    }
}
