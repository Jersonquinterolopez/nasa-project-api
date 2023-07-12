import { Request, Response } from "express";
import launchesModel from "../models/launches.model";
import { isDate } from "../../types/Typeguards";
import { Launch } from "../../types/Launches";
import { getPagination } from "../services/query";

/**
 * Optional query parameters
 *
 * @param {string | undefined} limit - launches per page
 * @param {string | undefined} page - number of the page
 */

export interface QueryParams {
    limit?: string;
    page?: string;
}

export async function getAllLaunches(req: Request, res: Response) {
    const { limit, skip } = getPagination(req.query);
    const launches = await launchesModel.getAllLaunches({
        limit,
        skip,
    });

    return res.status(200).json(launches);
}

export async function addNewLaunch(req: Request, res: Response) {
    const launch: Launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(400).json({
            error: "Fill all the data",
        });
    }
    if (isDate(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch date",
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    await launchesModel.scheduleNewLaunch(launch);
    console.log(launch);
    return res.status(201).json(launch);
}

export async function abbortLaunch(req: Request, res: Response) {
    const launchId = Number(req.params.id);

    // if launch does not exist
    const existLaunch = await launchesModel.existLaunchWithId(launchId);
    if (!existLaunch) {
        return res.status(404).json({
            error: "Launch not found",
        });
    }

    const abborted = await launchesModel.abbortLaunchById(launchId);

    if (!abborted) {
        return res.status(400).json({
            error: "Launch not aborted",
        });
    }
    return res.status(200).json({
        ok: true,
    });
}
