import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import planets from "./planets.schema";
// In ES6 use:
const __dirname = path.resolve();

// This a real example of the emitter and the event-driven development
// in Node, as we see we are using events that are subscribed to the
// createReadStream function. each event triggers an action

interface Planet {
    koi_disposition: string;
    koi_insol: number;
    koi_prad: number;
    kepler_name: string;
}

function isHabitablePlanet(planet: Planet): boolean {
    const planetIsConfirmed = planet["koi_disposition"] === "CONFIRMED";
    const stellarFluxBetween = planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11;
    const planetRadiusUnder = planet["koi_prad"] < 1.6;

    const result = planetIsConfirmed && stellarFluxBetween && planetRadiusUnder;
    return result;
}

export function loadPlanetData() {
    // createReadStream returns a stream of bytes
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "data", "kepler_data.csv"))
            // with pipe we can pass the stream to another function before that the stream is consumed by the event 'data'
            .pipe(
                // we can pass optios to the parse method
                parse({
                    comment: "#", // specify that comment character is #
                    columns: true, // returns each raw of the csv file as an object with key value pairs
                })
            )
            // the data callback iterate for each item
            .on("data", async (data: Planet) => {
                if (isHabitablePlanet(data)) {
                    savePlanet(data);
                }
            })
            .on("error", (error) => {
                console.log("❌ Error:", error);
                reject(error);
            })
            .on("end", async () => {
                const countPlanetsFound = await getAllHabitablePlanets();
                console.log(`🌍 ${countPlanetsFound.length} habitable planets found!`);
                resolve(0);
            });
    });
}

export async function getAllHabitablePlanets() {
    // In the second argument of find we can specify the properties that we want to ignore
    // follow by the order '[key]: 0' with 0 we specify that we want to ignore that prop
    return await planets.find(
        {},
        {
            __v: 0,
            _id: 0,
        }
    );
}

async function savePlanet(planet: Planet) {
    // insert + update = upsert
    // An upsert operation in mongo insert an object just if does not exist
    // The first argument in the updateOne() function is
    // the element we want to update, and the second parameter is what we want to update in that element or object
    // The third argument will tell mongo that this is a an upsert operation
    try {
        await planets.updateOne(
            {
                keplerName: planet.kepler_name,
            },
            {
                keplerName: planet.kepler_name,
            },
            {
                upsert: true,
            }
        );
    } catch (error) {
        console.error(`Could not save the planet ${error}`);
    }
}
