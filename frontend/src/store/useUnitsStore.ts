import { create } from "zustand";
import { createSelectors } from "./createSelector";
import chroma from "chroma-js";


type UnitsConfig = {
    selected: string; // what unit is selected
    scale: { // color scale (using chroma)
        colors: string[];
        levels: number[];
        colorScale: chroma.Scale;
    };
    units: { [key: string]: (base: number) => number }; // available units with conversion from base one
};

type UnitsStore = {
    [key in mapDataTypes]: UnitsConfig // one unitconfig per units (wind etc)
} & {
    names: Map<mapDataTypes, string> // names in french
};

// set scales to what we want
const scales = {
    wind: {
        colors: [ "#ffffff", "#55ff55", "#ff5555" ],
        levels: [ 0, 5, 15 ]
    },
    temp: {
        colors: [ "#ffffff", "#55ff55", "#ff5555" ],
        levels: [ 0, 20, 35 ]
    }
}

// names in french
const names = new Map<mapDataTypes, string>([
    ["wind", "Vent"],
    ["temp", "Temperature"]
]);

export const useUnitStore = createSelectors(create<UnitsStore>()(() => {
    // Reusable function to create unit configurations
    const createUnitConfig = (type: keyof typeof scales, units: UnitsConfig["units"]): UnitsConfig => ({
        selected: Object.keys(units)[0], // Default to the first unit
        scale: {
            ...scales[type],
            colorScale: chroma.scale(scales[type].colors).domain(scales[type].levels)
        },
        units
    });

    return {
        wind: createUnitConfig("wind", {
            "m/s": (base:number) => base,
            "km/h": (base:number) => base * 3.6,
            "mph": (base:number) => base * 2.237,
            "noeuds": (base:number) => base * 1.943844
        }),
        temp: createUnitConfig("temp", {
            "°C": (base:number) => base,
            "°F": (base:number) => base * 1.8 + 32,
        }),
        names
    };
}));