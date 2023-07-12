import { Request, Response } from "express";
import { getAllHabitablePlanets } from "../models/planets.model";

async function getAllPlanets(req: Request, res: Response) {
    return res.status(200).json(await getAllHabitablePlanets());
}

export { getAllPlanets };
