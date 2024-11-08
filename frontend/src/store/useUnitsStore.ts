import { create } from "zustand";
import { createSelectors } from "./createSelector";

interface UnitsStore {
    wind: {
        selected: string
        scale: {
            colors: string[]
            levels: number[]
        }
        units: {
            [key: string]: (base: number) => number
        }
    }
    names: Map<string, string>
}

export const useUnitStore = createSelectors(create<UnitsStore>()((set, get) => {
    const names = new Map();
    names.set("wind", "Vent");
    names.set("temp", "Temperature");

    return {
        wind: {
            selected: "m/s",
            scale: {
                colors: [ "#ffffff", "#55ff55", "#ff5555" ],
                levels: [ 0, 5, 15 ]
            },
            units: {
                "m/s": (base:number) => base,
                "km/h": (base:number) => base * 3.6,
                "mph": (base:number) => base * 3.6,
                "noeuds": (base:number) => base * 1.943844
            }
        },
        names
    }
}));