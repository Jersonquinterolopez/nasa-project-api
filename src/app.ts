import express from "express";
import planetsRouter from "./routes/planets/planets.router";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import { api } from "./routes/api";
// In ES6 use:
const __dirname = path.resolve();

const app = express();

app.use(morgan("combined"));
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(express.json());

// build React build files to the specified directory.
// "build": "BUILD_PATH=../server/public react-scripts build",
// we can serve our react build files like a normal html.
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1", api);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;
