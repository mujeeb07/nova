import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import { adminRouter } from "./presentation/web/routes/adminRoutes";
import userRouter from "./presentation/web/routes/userRoutes";
import vendorRouter from "./presentation/web/routes/vendorRoutes";
import authRouter from "./presentation/routes/authRoutes";
import { adminManagementRouter } from "./presentation/web/routes/adminManagementRoutes";

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/auth", authRouter);
app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/super-admin", adminManagementRouter);
app.use("/api/v1/auth/super-admin", adminRouter);
app.use("/api/v1/auth/user", userRouter);
app.use("/api/v1/auth/vendor", vendorRouter);


app.use(errorHandler);

export default app;