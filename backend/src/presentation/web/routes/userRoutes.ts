import { Router } from "express";
import { AuthController } from "../controllers/users/AuthController";
import { UserRepository } from "../../../infrastructure/repository/users/UserRepository";
import { PasswordService } from "../../../infrastructure/services/password_services";
import { KeyValueRepository } from "../../../infrastructure/repository/redis/KeyValueRepository";

import { UserRegisterUseCase } from "../../../application/use_cases/users/auth/RegisterUseCase";
import { LoginUserUseCase } from "../../../application/use_cases/users/auth/LoginUseCase";
import { UserVerifyOtpUseCase } from "../../../application/use_cases/users/auth/UserVerifyOTPUseCase";

import { ForgotPasswordController } from "../controllers/shared/ForgotPasswordController";
import { ResetPasswordUseCase } from "../../../application/use_cases/shared/auth/ResetPasswordUseCase";
import { ResetPasswordController } from "../controllers/shared/ResetPasswordController";
import { ForgotPasswordUseCase } from "../../../application/use_cases/shared/auth/ForgotPasswordUseCase";
import { sendOtpEmail } from "../../../infrastructure/services/otp_service";

const userRouter = Router();

const userRepository = new UserRepository();
const passwordService = new PasswordService();
const keyValueRepository = new KeyValueRepository();

const userRegisterUseCase = new UserRegisterUseCase(userRepository, passwordService, keyValueRepository);
const userLoginUseCase = new LoginUserUseCase(userRepository);
const userVerifyOTPUseCase = new UserVerifyOtpUseCase(userRepository, keyValueRepository)


const userController = new AuthController(
    userRegisterUseCase, 
    userLoginUseCase, 
    userVerifyOTPUseCase
);

// forgot-password.
const userForgotPassword = new ForgotPasswordUseCase(
    userRepository,
    keyValueRepository,
    sendOtpEmail,
    "reset:user"
);
const userForgotPasswordController = new ForgotPasswordController(userForgotPassword)

// reset-password.
const userResetPassword = new ResetPasswordUseCase(
    userRepository,
    keyValueRepository,
    passwordService,
    "reset:user"
);
const userResetPasswordController = new ResetPasswordController(userResetPassword)

userRouter.post("/register", userController.register);
userRouter.post("/verify", userController.verify);
userRouter.post("/login", userController.login);

userRouter.post("/forgot-password", userForgotPasswordController.handle);
userRouter.post("/reset-password", userResetPasswordController.handle)

export default userRouter;