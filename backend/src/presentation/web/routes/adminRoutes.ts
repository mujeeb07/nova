import { Router } from "express";
import { AuthController } from "../controllers/admin/AdminController";
import { AdminRepository } from "../../../infrastructure/repository/admin/AdminRepository";
import { AdminLoginUseCase } from "../../../application/use_cases/admin/auth/AdminLoginUseCase";
import { PasswordService } from "../../../infrastructure/services/password_services";
import { TokenService } from "../../../infrastructure/services/TokenService";
import { ForgotPasswordController } from "../controllers/shared/ForgotPasswordController";
import { ForgotPasswordUseCase } from "../../../application/use_cases/shared/auth/ForgotPasswordUseCase";
import { KeyValueRepository } from "../../../infrastructure/repository/redis/KeyValueRepository";
import { sendOtpEmail } from "../../../infrastructure/services/otp_service";
import { VerifyForgotPasswordOtpUseCase } from "../../../application/use_cases/shared/auth/VerifyForgotPasswordOtpUseCase";
import { CreateNewPasswordUseCase } from "../../../application/use_cases/shared/auth/CreateNewPasswordUseCase";
import { sendSuccess } from "../../../utils/apiResponse";
import { authenticateSuperAdmin } from "../../middlewares/guards";


const adminRouter = Router();
const adminRepository = new AdminRepository();
const passworService = new PasswordService();
const tokenService = new TokenService();
const keyValueRepository = new KeyValueRepository();

const loginAdminUseCase = new AdminLoginUseCase(adminRepository, passworService, tokenService);
const adminController = new AuthController(loginAdminUseCase);


// fortgot-password.
const PREFIX = "forgot:admin";
const adminForgotPasswordController = new ForgotPasswordController(
    new ForgotPasswordUseCase(adminRepository, keyValueRepository, sendOtpEmail, PREFIX),
    new VerifyForgotPasswordOtpUseCase(keyValueRepository, PREFIX),
    new CreateNewPasswordUseCase(adminRepository, keyValueRepository, passworService, PREFIX)
)

adminRouter.post("/login", adminController.login);
adminRouter.get("/me", authenticateSuperAdmin, async (req, res) => {
    const admin = await adminRepository.findById(req.accountId!);
    if (!admin) {
        sendSuccess(res, { accountId: req.accountId, role: req.role }, "OK");
        return;
    }
    const role = (admin.role?.toLowerCase() ?? req.role ?? "super_admin");
    sendSuccess(res, { 
        accountId: admin.id, 
        role,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role,
        }
    }, "OK");
});
 
adminRouter.post("/forgot-password", adminForgotPasswordController.sendOtp);
adminRouter.post("/forgot-password/verify", adminForgotPasswordController.verifyOtp);
adminRouter.post("/forgot-password/create", adminForgotPasswordController.createPassword)

export { adminRouter };