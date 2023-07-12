// Models are in charge of give the data format and shape. To pass that data to the controllers.
import { Documents, Filter, Launch, Pagination, Payloads } from "../../types/Launches";
import { Options } from "../services/query";
import launchesDB from "./launches.schema";
import planets from "./planets.schema";
import axios from "axios";

const SPACEX_API_URL = process.env.SPACEX_API ?? "";
const DEFAULT_FLIGHT_NUMBER = 100;

async function getLatestFlightNumber(): Promise<number> {
    const latestLaunch = await launchesDB.findOne().sort({ flightNumber: "descending" });

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch?.flightNumber;
}

async function getAllLaunches({ limit, skip }: Options) {
    try {
        return await launchesDB
            .find(
                {},
                {
                    __v: 0,
                    _id: 0,
                }
            )
            .sort({ flightNumber: "ascending" }) // sort to return the flightNumbers in order
            .skip(skip) // skip to paginate
            .limit(limit); // limit the amoud of documents per page
    } catch (error) {
        console.error(`Could not find any launches: ${error}`);
    }
}

async function saveLaunch(launch: Launch) {
    // A good practice is to change updateOne() with findOneAndUpdate. that way our API
    // does not return de $setonInsert property which will expose our database.
    try {
        await launchesDB.findOneAndUpdate(
            {
                flightNumber: launch.flightNumber,
            },
            launch,
            {
                upsert: true,
            }
        );
    } catch (error) {
        console.error(`Could not save launch ${error}`);
    }
}

async function scheduleNewLaunch(launch: Launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        throw new Error("No matching planet was found");
    }

    const latestFlightNumber = (await getLatestFlightNumber()) + 1;

    // 💡 We can see this in the practice when we tried to use (...) operator to create the new lauch
    // const newLaunch: Launch = { ...launch, ...rest, }
    // the endpoint was returning the same req.body, because the ... operator wasn't mutating the req.body.launch
    // when we refactor to Object.assign the endpoint was able to return the mutated launch that was
    // commig from the DB.

    // The difference is that Object.assign changes the object in place in memory
    // while the spread operator (...) creates a brand new object, and this will,
    // brake object reference equality

    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ["Zero To mastery", "NASA"],
        upcoming: true,
        success: true,
    });

    await saveLaunch(newLaunch);
}

async function existLaunchWithId(launchId: number) {
    return await findLaunch({ flightNumber: launchId });
}

async function abbortLaunchById(launchId: number) {
    return await launchesDB.findOneAndUpdate(
        { flightNumber: launchId },
        {
            upcoming: false,
            success: false,
        }
    );
}

async function findLaunch(filter: Filter) {
    return await launchesDB.findOne(filter);
}

async function loadLaunchesData() {
    try {
        const firstLaunch: boolean = await isDataPersisted();

        if (firstLaunch) {
            console.log("✅ Launch data is already loaded");
        } else {
            const launchDocs: Documents = await populateLaunches();
            await parseLaunchDocs(launchDocs);
        }
    } catch (error) {
        console.error(`Error launching SpaceX data:`, error);
    }
}

async function populateLaunches(): Promise<Documents> {
    console.log("⏳ Downloading launch data...");
    const query = {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1,
                    },
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    };
    const response = await axios.post<Pagination>(`${SPACEX_API_URL}/launches/query`, query);

    if (response.status !== 200) {
        console.log("Problem downloading launch data");
        throw new Error("Launch data download failed");
    }

    const launchDocs: Documents = response.data.docs;
    return launchDocs;
}

async function parseLaunchDocs(launchDocs: Documents) {
    for (const launchDoc of launchDocs) {
        const payloads: Payloads = launchDoc["payloads"];

        const customers: string[] = payloads.flatMap((payload) => {
            return payload["customers"];
        });

        const launch: Launch = {
            flightNumber: launchDoc["flight_number"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc["date_local"],
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"],
            customers: customers,
        };

        console.log(`🚀 Launch:`, launch.flightNumber, launch.mission);
        await saveLaunch(launch);
    }
}

async function isDataPersisted(): Promise<boolean> {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    });

    return firstLaunch ? true : false;
}

export default {
    existLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abbortLaunchById,
    loadLaunchesData,
};
