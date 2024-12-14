import { create } from "zustand";
import { createSelectors } from "./createSelector";
import chroma from "chroma-js";

type UnitsStore = {
    [key in ("wind" | "temp")]: {
        selected: string
        scale: {
            colors: string[]
            levels: number[]
            colorScale: chroma.Scale
        }
        units: {
            [key: string]: (base: number) => number
        }
    }
} & {
    names: Map<string, string>
};

export const useUnitStore = createSelectors(create<UnitsStore>()((set, get) => {
    const names = new Map();
    names.set("wind", "Vent");
    names.set("temp", "Temperature");
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

    return {
        wind: {
            selected: "m/s",
            scale: {
                ...scales.wind,
                colorScale: chroma.scale(scales.wind.colors).domain(scales.wind.levels)
            },
            units: {
                "m/s": (base:number) => base,
                "km/h": (base:number) => base * 3.6,
                "mph": (base:number) => base * 3.6,
                "noeuds": (base:number) => base * 1.943844
            }
        },
        temp: {
            selected: "°C",
            scale: {
                ...scales.temp,
                colorScale: chroma.scale(scales.temp.colors).domain(scales.temp.levels)
            },
            units: {
                "°C": (base:number) => base,
                "°F": (base:number) => base * 3.6,
            }
        },
        names
    }
}));