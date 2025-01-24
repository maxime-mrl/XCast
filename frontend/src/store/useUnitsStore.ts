import { create } from "zustand";
import { persist } from "zustand/middleware";
import chroma from "chroma-js";
import { createSelectors } from "@utils/createSelector";
import { customStorage } from "@utils/storage";
import { mapDataTypes } from "types/customTypes";

export type UnitsConfig = {
  // default: string; // what unit is selected
  selected: string; // what unit is selected
  select: (unit: string) => void; // chenge unit selected
  scale: {
    // color scale (using chroma)
    colors: string[];
    levels: number[];
    colorScale: chroma.Scale;
  };
  units: Record<string, (base: number) => number>; // available units with conversion from base one
};

type UnitsStore = Record<mapDataTypes, UnitsConfig> & { // one unitconfig per units (wind etc)
  names: Map<mapDataTypes, string>;
}; // names in french

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

// set scales to what we want
const scales = {
  wind: {
    colors: colorScale,
    levels: [0, 1.5, 3, 5, 8, 10, 15, 18],
  },
  temp: {
    colors: colorScale,
    levels: [0, 10, 18, 25, 30, 35, 40, 45],
  },
};

// names in french
const names = new Map<mapDataTypes, string>([
  ["wind", "Vent"],
  ["temp", "Temperature"],
]);

export const useUnitStore = createSelectors(
  create<UnitsStore>()(
    persist(
      () => ({
        wind: createUnitConfig("wind", {
          "km/h": (base) => Math.round(base * 3.6),
          mph: (base) => Math.round(base * 2.237),
          "m/s": (base) => Math.round(base),
          noeuds: (base) => Math.round(base * 1.943844),
        }),
        temp: createUnitConfig("temp", {
          "°C": (base) => Math.round(base),
          "°F": (base) => Math.round(base * 1.8 + 32),
        }),
        names,
      }),
      {
        name: "units-settings",
        partialize: (state) => {
          // only sync selected units fields
          const { names, ...units } = state;
          const SelectedUnits: Partial<
            Record<mapDataTypes, { selected: string }>
          > = {};
          const keys = Object.keys(units) as mapDataTypes[];
          keys.forEach((key) => {
            const { selected } = units[key];
            SelectedUnits[key] = { selected };
          });
          return SelectedUnits;
        },
        merge: (persistedState, defaultState: UnitsStore) => {
          if (!persistedState || typeof persistedState !== "object")
            return defaultState;
          return mergeUnits({ ...defaultState }, persistedState);
        },
        storage: customStorage,
      }
    )
  )
);

export function mergeUnits(prev: UnitsStore, data?: Partial<UnitsStore>) {
  if (!data) return prev;
  // Ensure missing sub-objects are restored from defaults
  const newState = { ...prev };
  // deep merge
  const keys = Object.keys(prev) as (keyof typeof prev)[];
  keys.forEach((key) => {
    if (key === "names") return; // names are not synced
    // if is an object, make a deep merge
    if (
      typeof newState[key] === "object" &&
      key in data &&
      typeof data[key] === "object"
    ) {
      newState[key] = {
        ...newState[key],
        ...data[key],
      };
    }
  });
  return newState;
}

// Reusable function to create unit
function createUnitConfig(
  type: keyof typeof scales,
  units: UnitsConfig["units"]
): UnitsConfig {
  return {
    selected: Object.keys(units)[0], // Default to the first unit
    select: (newUnit) => {
      if (!Object.keys(units).find((value) => value === newUnit)) return;
      useUnitStore.setState((state) => ({
        [type]: {
          ...state[type],
          selected: newUnit,
        },
      }));
    },
    scale: {
      ...scales[type],
      colorScale: chroma.scale(scales[type].colors).domain(scales[type].levels),
    },
    units,
  };
}
