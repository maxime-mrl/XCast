import { Request, Response } from "express";
import fs from "fs"
import path from "path"
import rootPath from "@rootPath";

const mapsPath = path.join(rootPath, "public", "map"); // map data location
const dataOrder = [
    "wind",
    "temp",
    "rain",
    "hum",
    "th",
]

/* -------------------------------------------------------------------------- */
/*                       GET AVAILABLE MODELS AND HOURS                       */
/* -------------------------------------------------------------------------- */
export function getCapabilities(_req:Request, res:Response) {
    const models:Map<string, object> = new Map(); // init map to be returned
    // iterate through available models
    // folder structure looks like this: map/${model}/${time}/${data}.tif
    fs.readdirSync(mapsPath).forEach((model) => {
        // get available times
        const availableTimes = fs.readdirSync(path.join(rootPath, "public", "map", model));
        // get dataset (assume dataset is the same for each hours as it should) and sort it based on predefined order
        const datasets = fs.readdirSync(path.join(rootPath, "public", "map", model, availableTimes[0])).sort((a,b) => dataOrder.indexOf(a) - dataOrder.indexOf(b));
        // get levels and file name for each dataset
        const parsedDataset: {
            [key: string]: {
                names: string[],
                levels: number[]
            }
        } = {};
        datasets.forEach(dataset => {
            const files = fs.readdirSync(path.join(rootPath, "public", "map", model, availableTimes[0], String(dataset))); // get all geotif
            const levels: number[] = []
            const names: string[] = []
            files.forEach((file) => { // parse unique levels and file names
                const splitted = file.split(/\-|\./);
                splitted.pop(); // remove tiff
                if (levels.find(level => parseInt(splitted[1]) === level) === undefined) levels.push(parseInt(splitted[1])); // unique levels
                if (names.find(name => splitted[0] === name) === undefined) names.push(splitted[0]); // unique file name
            });
            parsedDataset[dataset] = {
                names,
                levels: levels.sort()
            };
        });
        // add model with time and available data
        models.set(model, {
            availableTimes: availableTimes.map(time => time.replace("_", ":")), // replace _ to correspond to valid time
            dataset:parsedDataset,
        });
    });
    res.status(200).json(Object.fromEntries(models));
}

/* -------------------------------------------------------------------------- */
/*                      GET DETAILED FORECAST FOR A POINT                     */
/* -------------------------------------------------------------------------- */
export function getForecast(req:Request, res:Response) { // req.quey = { lat: number, lng: number, model:string, time:string }
    // parse req query checking entries
    if (
        typeof req.query.lat !== "string" || isNaN(parseFloat(req.query.lat)) ||
        typeof req.query.lng !== "string" || isNaN(parseFloat(req.query.lng)) || 
        typeof req.query.model !== "string" ||
        typeof req.query.time !== "string"
    ) throw new Error("Invalid entries");
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const { model, time } = req.query;
    console.log({lat, lng, model, time}) // should be used to get the correct forecast but for now it'll be soontm
    // get the forecast
    const data = JSON.parse(fs.readFileSync(path.join(rootPath, "public", "data", "arome__0025__IP1__19H24H__2024-11-12T03_00_00Z.split150.json")).toString());
    const selectedForecast: {
        [key:string]:any
    }[] = [];
    data.forecast.forEach((time:{[key:string]:any}) => {
        // console.log(time.forecastTime)
        const forecast:{ [key:string]:any } = {};
        const z = time.data.z.values
        // console.log(z)
        for (const [ level ] of Object.entries(z)) { // select point 0 should add logic to get the real GPS point later
            const mlvl = Math.trunc(z[level][0]) / 10; // convert hPa lvl to meter
            for (const [ key ] of Object.entries(time.data)) {
                if (key !== "z") {
                    if (!forecast[key])forecast[key] = {};
                    forecast[key][mlvl] = time.data[key].values[level][0];
                }
            }
        }
        selectedForecast.push({
            forecastTime: time.forecastTime,
            forecast
        })
    });
    console.log("selectedForecast")
    
    res.status(200).json(selectedForecast);
}
