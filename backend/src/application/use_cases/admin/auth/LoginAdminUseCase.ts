import type { IAdminRepository } from "../../../../domain/repositories/admin/IAdminRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { ILoginAdminUseCase } from "../../../interfaces/admin/ILoginAdminUseCase";
import { AdminLoginInputDTO, AdminLoginOutputDTO } from "../../../dtos/admin/admin.dto";

export class LoginAdminUseCase implements ILoginAdminUseCase {
    constructor(private readonly adminRepository: IAdminRepository) {};
    async execute(input: AdminLoginInputDTO): Promise<AdminLoginOutputDTO> {
        console.log("Inpnut Data:", input);
        const admin = await this.adminRepository.findByEmail(input.email);
        console.log("Admin Data: ",admin);
        if(!admin) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = bcrypt.compare(input.password, admin.passwordHash);
        if(!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        if(admin.status === "SUSPENDED") {
            throw new Error("Your account has been suspended");
        }

        await this.adminRepository.update(admin.id, { lastLoginAt: new Date() });

        const jwtSecret = process.env.JWT_SECRET || "falback_secret_key";
        const token = jwt.sign(
            { id: admin.id, role: admin.role, permissions: admin.permissions },
            jwtSecret,
            { expiresIn:"1d" }
        );

        return {
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                eamil: admin.email,
                role: admin.role
            }
        };
    }
}