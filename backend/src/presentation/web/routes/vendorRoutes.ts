// presentation/http/routes/vendorRouter.ts
import { Router } from "express";
import { AuthController } from "../controllers/vendor/AuthController";
import { VendorOnboardingController } from "../controllers/vendor/VendorOnboardingController";
import { VendorRepository } from "../../../infrastructure/repository/vendors/VendorRepository";
import { VendorPayoutAccountRepository } from "../../../infrastructure/repository/vendors/VendorPayoutAccountRepository";
import { VendorCredentialsRepository } from "../../../infrastructure/repository/vendorCredentials/VendorCredentialsRrepository";
import { PasswordService } from "../../../infrastructure/services/password_services";
import { KeyValueRepository } from "../../../infrastructure/repository/redis/KeyValueRepository";
import { TokenService } from "../../../infrastructure/services/TokenService";
import { sendOtpEmail } from "../../../infrastructure/services/otp_service";

import { VendorLoginUseCase } from "../../../application/use_cases/vendors/auth/VendorLoginUseCase";
import { VendorRegisterUseCase } from "../../../application/use_cases/vendors/auth/VendorRegisterUseCase";
import { VendorVerifyOtpUseCase } from "../../../application/use_cases/vendors/auth/VendorVerifyOtpUseCase";
import { CompleteVendorOnboardingUseCase } from "../../../application/use_cases/vendors/CompleteVendorOnboardingUseCase";
import { ForgotPasswordUseCase } from "../../../application/use_cases/shared/auth/ForgotPasswordUseCase";
import { VerifyForgotPasswordOtpUseCase } from "../../../application/use_cases/shared/auth/VerifyForgotPasswordOtpUseCase";
import { CreateNewPasswordUseCase } from "../../../application/use_cases/shared/auth/CreateNewPasswordUseCase";
import { ForgotPasswordController } from "../controllers/shared/ForgotPasswordController";

import { authenticateVendor } from "../../middlewares/guards";

const vendorRouter = Router();

const DEFAULT_COMMISSION_RATE = 0.15;

// repositories & services.
const vendorRepository = new VendorRepository();
const vendorCredentialsRepository = new VendorCredentialsRepository();
const vendorPayoutRepository = new VendorPayoutAccountRepository();
const passwordService = new PasswordService();
const keyValueService = new KeyValueRepository();
const tokenService = new TokenService();

// login.
const loginUseCase = new VendorLoginUseCase(
    vendorRepository,
    vendorCredentialsRepository,
    passwordService,
    tokenService
);

// register.
const registerUseCase = new VendorRegisterUseCase(
    vendorRepository,
    passwordService,
    keyValueService
);

// verify-otp.
const verifyOtpUseCase = new VendorVerifyOtpUseCase(
    vendorRepository,
    vendorCredentialsRepository,
    keyValueService,
    tokenService
);

// forgot-password.
const PREFIX = "forgot:vendor";
const vendorForgotPasswordController = new ForgotPasswordController(
    new ForgotPasswordUseCase(vendorCredentialsRepository, keyValueService, sendOtpEmail, PREFIX),
    new VerifyForgotPasswordOtpUseCase(keyValueService, PREFIX),
    new CreateNewPasswordUseCase(vendorCredentialsRepository, keyValueService, passwordService, PREFIX)
);

// onboarding (store setup).
const completeOnboardingUseCase = new CompleteVendorOnboardingUseCase(
    vendorRepository,
    vendorPayoutRepository,
    DEFAULT_COMMISSION_RATE
);

// controllers.
const authController = new AuthController(loginUseCase, registerUseCase, verifyOtpUseCase);
const vendorOnboardingController = new VendorOnboardingController(completeOnboardingUseCase);

// auth routes.
vendorRouter.post("/register", authController.register);
vendorRouter.post("/verify-otp", authController.verifyOtp);
vendorRouter.post("/login", authController.login);

vendorRouter.post("/forgot-password", vendorForgotPasswordController.sendOtp);
vendorRouter.post("/forgot-password/verify", vendorForgotPasswordController.verifyOtp);
vendorRouter.post("/forgot-password/create", vendorForgotPasswordController.createPassword);

// onboarding route (protected).
vendorRouter.post("/onboarding", authenticateVendor, vendorOnboardingController.complete);

export default vendorRouter;