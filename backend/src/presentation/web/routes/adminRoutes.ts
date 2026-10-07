import { Router } from "express";
import { AdminController } from "../controllers/admin/AdminController";
import { AdminRepository } from "../../../infrastructure/repository/admin/AdminRepository";
import { LoginAdminUseCase } from "../../../application/use_cases/admin/auth/LoginAdminUseCase";

const adminRouter = Router();
const adminRepository = new AdminRepository();
const loginAdminUseCase = new LoginAdminUseCase(adminRepository);
const adminController = new AdminController(loginAdminUseCase);

adminRouter.post("/login",adminController.login);

export { adminRouter };