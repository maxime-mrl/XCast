import { create } from "zustand";
import { createSelectors } from "./createSelector";
import chroma from "chroma-js";

const colorScale = [
    "#F1F7F9", // 1 - white 
    "#A9CEDA", // 2 - light blue
    "#78C091", // 3 - green
    "#F6BD60", // 4 - yellow/orange
    "#E7940D", // 5 - orange
    "#CE5427", // 6 - orange/red
    "#520001", // 7 - darkred
    "#290000", // 8 - almost black
];


export type UnitsConfig = {
    // default: string; // what unit is selected
    selected: string; // what unit is selected
    select: (unit:string) => void,
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
        colors: colorScale,
        levels: [ 0, 1.5, 3, 5, 8, 10, 15, 18 ]
    },
    temp: {
        colors: colorScale,
        levels: [ 0, 10, 18, 25, 30, 35, 40, 45 ]
    }
}

// names in french
const names = new Map<mapDataTypes, string>([
    ["wind", "Vent"],
    ["temp", "Temperature"]
]);

export const useUnitStore = createSelectors(create<UnitsStore>()((set) => {
    // Reusable function to create unit configurations
    const createUnitConfig = (type: keyof typeof scales, units: UnitsConfig["units"]): UnitsConfig => ({
        // default: Object.keys(units)[0], // Default to the first unit
        selected: Object.keys(units)[0], // Default to the first unit
        select: (newUnit) => {
            if (!Object.keys(units).find(value => value === newUnit)) return;
            set((state) => ({ [type]: {
                ...state[type],
                selected: newUnit 
            } }));
        },
        scale: {
            ...scales[type],
            colorScale: chroma.scale(scales[type].colors).domain(scales[type].levels)
        },
        units
    });

    return {
        wind: createUnitConfig("wind", {
            "m/s": (base:number) => Math.round(base ),
            "km/h": (base:number) => Math.round(base * 3.6),
            "mph": (base:number) => Math.round(base * 2.237),
            "noeuds": (base:number) => Math.round(base * 1.943844)
        }),
        temp: createUnitConfig("temp", {
            "°C": (base:number) => Math.round(base  ),
            "°F": (base:number) => Math.round(base * 1.8 + 32,)
        }),
        names
    };
}));