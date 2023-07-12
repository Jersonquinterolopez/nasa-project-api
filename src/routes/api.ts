import express from "express";
import launchesRouter from "./launches/launches.router";
import planetsRouter from "./planets/planets.router";

const api = express.Router();

api.use("/launches", launchesRouter);
api.use("/planets", planetsRouter);

export { api };
