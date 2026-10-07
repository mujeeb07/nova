import express from "express";
import cors from "cors";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import { adminRouter } from "./presentation/web/routes/adminRoutes";
import userRouter from "./presentation/web/routes/userRoutes";
import vendorRouter from "./presentation/web/routes/vendorRoutes";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/auth/user", userRouter);
app.use("/api/v1/auth/vendor", vendorRouter);
app.get("/test", (req, res) => {
    res.json({ success:true })
});

app.use(errorHandler);

export default app;