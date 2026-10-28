import { Router } from "express";
import { AdminListController } from "../controllers/admin/AdminListController";
import { ListVendorsUseCase } from "../../../application/use_cases/admin/lists/ListVendorsUseCase";
import { VendorRepository } from "../../../infrastructure/repository/vendors/VendorRepository";
import { ListUsersUseCase } from "../../../application/use_cases/admin/lists/ListUsersUseCase";
import { UserRepository } from "../../../infrastructure/repository/users/UserRepository";
import { authenticateSuperAdmin } from "../../middlewares/guards";
import rateLimit from "express-rate-limit";
import { invitationController } from "./adminInvitationRoutes";

const router = Router();

const controller = new AdminListController(
    new ListVendorsUseCase(new VendorRepository()),
    new ListUsersUseCase(new UserRepository())
);

router.get("/vendors", authenticateSuperAdmin, controller.vendors);
router.get("/users", authenticateSuperAdmin, controller.users);

const inviteLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
router.post("/admins/invite", authenticateSuperAdmin, inviteLimiter, invitationController.invite);


export { router as adminManagementRouter }