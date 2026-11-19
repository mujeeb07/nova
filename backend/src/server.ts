import app from "./app";
import { MongooseDatabase } from "./infrastructure/db/config/mongoose";
import 'dotenv/config';
import { connectRedis } from "./infrastructure/db/config/redis_config";
import "./infrastructure/workers/emailWorker";
import { createAdminInviteMailWorker } from "./infrastructure/workers/adminInviteWorker";
import { connection } from "./infrastructure/config/config.queue";


const adminInviteWorker = createAdminInviteMailWorker(process.env.FRONTEND_URL!);

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nova-platform-db";

const shutdown = async () => {
    await adminInviteWorker.close();
    await connection.quit();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function startServer() {
    try {
        await MongooseDatabase.connect(DB_URI);
        await connectRedis();
        app.listen(PORT, () => {
            console.log(`server is running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error("databse connection loss", error);
    }
}

startServer();