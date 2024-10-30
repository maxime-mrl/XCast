import { Request, Response } from "express";
import fs from "fs"
import path from "path"
import rootPath from "../rootPath";

const mapsPath = path.join(rootPath, "public", "map"); // map data location

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
        // const parsedTimes = availableTimes.map(datestr => datestr.replace("_",":"));
        // get dataset (assume dataset is the same for each hours as it should)
        const dataset = fs.readdirSync(path.join(rootPath, "public", "map", model, availableTimes[0]))
        // add model with time and available data
        models.set(model, {
            availableTimes,
            dataset,
        });
    });
    res.status(200).json(Object.fromEntries(models));
}