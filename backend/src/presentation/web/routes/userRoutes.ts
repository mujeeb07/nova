import { Router } from "express";
import { AuthController } from "../controllers/users/AuthController";
import { UserRepository } from "../../../infrastructure/repository/users/UserRepository";
import { PasswordService } from "../../../infrastructure/services/password_services";
import { KeyValueRepository } from "../../../infrastructure/repository/redis/KeyValueRepository";

import { UserRegisterUseCase } from "../../../application/use_cases/users/auth/RegisterUseCase";
import { LoginUserUseCase } from "../../../application/use_cases/users/auth/LoginUseCase";
import { UserVerifyOtpUseCase } from "../../../application/use_cases/users/auth/UserVerifyOTPUseCase";

import { ForgotPasswordController } from "../controllers/shared/ForgotPasswordController";
import { ForgotPasswordUseCase } from "../../../application/use_cases/shared/auth/ForgotPasswordUseCase";
import { sendOtpEmail } from "../../../infrastructure/services/otp_service";
import { VerifyForgotPasswordOtpUseCase } from "../../../application/use_cases/shared/auth/VerifyForgotPasswordOtpUseCase";
import { CreateNewPasswordUseCase } from "../../../application/use_cases/shared/auth/CreateNewPasswordUseCase";

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


const PREFIX = "forgot:user";
const userForgotPasswordController = new ForgotPasswordController(
    new ForgotPasswordUseCase(userRepository, keyValueRepository, sendOtpEmail, PREFIX),
    new VerifyForgotPasswordOtpUseCase(keyValueRepository, PREFIX),
    new CreateNewPasswordUseCase(userRepository, keyValueRepository, passwordService, PREFIX)
);

userRouter.post("/register", userController.register);
userRouter.post("/verify", userController.verify);
userRouter.post("/login", userController.login);

userRouter.post("/forgot-password", userForgotPasswordController.sendOtp);
userRouter.post("/forgot-password/verify", userForgotPasswordController.verifyOtp);
userRouter.post("/forgot-password/create", userForgotPasswordController.createPassword);

export default userRouter;