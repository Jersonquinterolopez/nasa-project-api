import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_DB_URL ?? "";

mongoose.connection.once("open", () => {
    console.log("MongoDB conecction successful!");
});

mongoose.connection.on("error", (error) => {
    console.error(error);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect };
