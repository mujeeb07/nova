import express from "express";
import cors from "cors";
import { adminRouter } from "./presentation/web/routes/adminRoutes";
import userRouter from "./presentation/web/routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/auth/user", userRouter);
// app.get("/test", (req, res) => {
//     res.json({ success:true })
// })

export default app