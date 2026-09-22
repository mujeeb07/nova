import mongoose from "mongoose";

export class MongooseDatabase {
    public static async connect(uri: string): Promise<void> {
        try {
            mongoose.set('strictQuery', true);

            mongoose.connection.on("connected", () => {
                console.log("🍃 Mongoose successfully connected to MongoDB.");
            });

            mongoose.connection.on("error", (err) => {
                console.error(`❌ Mongoose connection tracking error: ${err}`);
            });

            mongoose.connection.on("disconnected", () => {
                console.warn("⚠️ Mongoose connection disconnected.");
            });

            await mongoose.connect(uri);

        } catch (error) {
            console.error("❌ Direct MongoDB initialization failure:", error);
            throw error;
        }
    }

    public static async disconnect(): Promise<void> {
        await mongoose.disconnect();
        console.log("🍃 Mongoose connections safely terminated.");
    }
}