import { Router } from "express";
import { AuthController } from "../controllers/users/AuthController";
import { UserRepository } from "../../../infrastructure/repository/users/UserRepository";
import { PasswordService } from "../../../infrastructure/services/password_services";
import { KeyValueRepository } from "../../../infrastructure/repository/redis/KeyValueRepository";

import { UserRegisterUseCase } from "../../../application/use_cases/users/auth/RegisterUseCase";
import { LoginUserUseCase } from "../../../application/use_cases/users/auth/LoginUseCase";
import { UserVerifyOtpUseCase } from "../../../application/use_cases/users/auth/UserVerifyOTPUseCase";
import { adminRouter } from "./adminRoutes";

const userRouter = Router();

const userRepository = new UserRepository();
const passwordService = new PasswordService();
const keyValueRepository = new KeyValueRepository();

const userRegisterUseCase = new UserRegisterUseCase(userRepository, passwordService, keyValueRepository);
const userLoginUseCase = new LoginUserUseCase(userRepository);
const userVerifyOTPUseCase = new UserVerifyOtpUseCase(userRepository, keyValueRepository)

const userController = new AuthController(userRegisterUseCase, userLoginUseCase, userVerifyOTPUseCase);

userRouter.post("/register", userController.register);
userRouter.post("/verify", userController.verify);
userRouter.post("/login", userController.login);

export default userRouter;