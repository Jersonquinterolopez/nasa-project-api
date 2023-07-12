import express from "express";
import { addNewLaunch, getAllLaunches, abbortLaunch } from "../../controllers/launches.controller";

const launchesRouter = express.Router();

launchesRouter.get("/", getAllLaunches);
launchesRouter.post("/", addNewLaunch);
launchesRouter.delete("/:id", abbortLaunch);

export default launchesRouter;
