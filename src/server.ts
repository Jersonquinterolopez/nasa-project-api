import http from "http";
import app from "./app";
import { loadPlanetData } from "./models/planets.model";
import launchesModel from "./models/launches.model";
import { mongoConnect } from "./services/mongo";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlanetData();
    await launchesModel.loadLaunchesData();

    server.listen(PORT, () => {
        console.log(`✅ Listening on Port: ${PORT}...`);
    });
}

export default startServer();
