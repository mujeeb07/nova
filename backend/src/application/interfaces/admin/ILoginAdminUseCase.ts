import { AdminLoginInputDTO, AdminLoginOutputDTO } from "../../dtos/admin/admin.dto";

export interface ILoginAdminUseCase {
    execute(input: AdminLoginInputDTO): Promise<AdminLoginOutputDTO>
}