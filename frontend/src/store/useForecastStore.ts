import { create } from "zustand";
import RequestServices from "@utils/requestService";
import { createSelectors } from "@utils/createSelector";
import { LatLng } from "leaflet";
import { persist } from "zustand/middleware";
import { customStorage } from "@utils/storage";
import { mapDataTypes } from "types/customTypes";
const forecastService = new RequestServices("api/forecast");

type forecastCapabilitiesData = Record<
  string,
  {
    // models
    availableTimes: string[]; // array of iso dates
    dataset: Record<
      mapDataTypes,
      {
        // measurements available
        names: string[]; // geotiff name(s) (for wind to geotifs so [ wspd, wdir ])
        levels: number[]; // available altitude
      }
    >;
  }
>;

export type forecastData = {
  level: number; // actual model elevation
  data: {
    time: string; // ISO 8601 timestamp (e.g., "2024-10-30T03:00Z")
    z: number[]; // Heights in meters (vertical levels)
    wdir: number[]; // Wind direction at each level in degrees
    wspd: number[]; // Wind speed at each level in m/s
    t: number[]; // Temperature at each level in kelvin
    r: number[]; // Relative humidity at each level in percentage (0-100)
    vv: number[]; // Vertical velocity at each level in m/s
    bl: number; // Boundary layer height in meters
    rain: number; // Rainfall in mm
    cloud_thr: number; // themral clouds (cumulus) in percentage (0-100) -- will change probably
    cloud_low: number; // Low cloud cover in percentage (0-100)
    cloud_med: number; // Medium cloud cover in percentage (0-100)
    cloud_high: number; // High cloud cover in percentage (0-100)
    cld_frac: number[]; // Cloud fraction at each level in percentage (0-100)
  }[];
};

export interface ForecastStore {
  // forecast capabilities (available models time and measurements)
  forecastCapabilities: null | {
    availableModels: string[];
    data: forecastCapabilitiesData;
  };
  // actual forecast
  forecast: null | forecastData;
  // users settings for the forecast
  userSettings: {
    model: string; // selected model
    time: string | null; // time displayed (ISO)
    selected: mapDataTypes | ""; // selected measurement
    level: number | null; // selected altitude
    maxHeight: number; // display details forecast up to a height
  };
  position: false | LatLng; // point position for forecast details (false = no points)
  // error handling
  status: string;
  message: string | null;
  // utility method to update data
  setPosition: (point: false | LatLng) => void;
  getCapabilities: () => Promise<void>;
  getForecast: (LatLng: LatLng) => Promise<void>;
  updateSettings: (newSettings: Partial<ForecastStore["userSettings"]>) => void;
  updateTime: (newTime: { hours?: 1 | -1; days?: 1 | -1 }) => void;
}

export const useForecastStore = createSelectors(
  create<ForecastStore>()(
    persist(
      (set, get) => ({
        /* --------------------------- INIT DEFAULT VALUES -------------------------- */
        forecastCapabilities: null,
        forecast: null,
        userSettings: {
          model: "",
          time: null,
          selected: "",
          level: 0,
          maxHeight: 5000, // default 5000m
        },
        position: false,
        /* ------------------------------- STORE STATE ------------------------------ */
        status: "",
        message: null,
        /* ------------------------------ STORE UPDATE ------------------------------ */
        // update user settings (since it's nested we can't update only one settings with default set)
        updateSettings: (newSettings) => {
          set((state) => ({
            userSettings: {
              ...state.userSettings,
              ...newSettings,
            },
          }));
        },
        // get forecast capabilities (initialization)
        getCapabilities: async () => {
          set({ status: "loading", forecastCapabilities: null });
          try {
            // fetch data
            const data = await forecastService.get<forecastCapabilitiesData>(
              "/getcapabilities"
            );
            const availableModels = Object.keys(data);
            // init usersettings
            const userSettings = get().userSettings;
            // check model
            const model = availableModels.includes(userSettings.model)
              ? userSettings.model
              : availableModels[0];
            const modelData = data[model];
            // check time
            const time = modelData.availableTimes.includes(userSettings.time!)
              ? userSettings.time
              : modelData.availableTimes[0];
            // check selected dataset
            const datasets = Object.keys(modelData.dataset) as mapDataTypes[];
            const selected = datasets.includes(
              userSettings.selected as mapDataTypes
            )
              ? userSettings.selected
              : datasets[0];
            // set state
            set({
              forecastCapabilities: { availableModels, data },
              userSettings: {
                ...userSettings,
                model,
                time,
                selected,
              },
              status: "success",
              message: "",
            });
          } catch (err) {
            set({
              status: "error",
              message: forecastService.parseError(err),
            });
          }
        },
        // fetch forecast for a point
        getForecast: async (LatLng) => {
          set({ status: "loading", forecast: null });
          try {
            // where / what model?
            const { time, model } = get().userSettings;
            // request
            const data = await forecastService.get<forecastData>("/point", {
              ...LatLng,
              time,
              model,
            });
            set({ forecast: data, status: "success", message: "" });
          } catch (err) {
            set({
              status: "error",
              message: forecastService.parseError(err),
            });
          }
        },
        // select a new time for forecasts
        updateTime: (newTime) => {
          // get actuals values
          const settings = get().userSettings;
          const capabilities = get().forecastCapabilities?.data;
          if (!settings.time || !settings.model || !capabilities) return;

          const availableTimes = capabilities[settings.model].availableTimes;

          // if time not available reset back to an existing one
          if (
            !availableTimes.find((available) => available === settings.time)
          ) {
            get().updateSettings({ time: availableTimes[0] });
            return;
          }

          // try to update the time
          const time = new Date(settings.time);
          time.setHours(time.getHours() + (newTime.hours || 0));
          time.setDate(time.getDate() + (newTime.days || 0));

          const timeStr = time.toISOString().split(":00.000Z")[0] + "Z"; // remove unnecessary seconds and miliseconds
          // check time is available
          if (!availableTimes.find((available) => available === timeStr))
            return; // if new time not available keep the old one
          // save the new time
          get().updateSettings({ time: timeStr });
        },
        // set detailled forecast point
        setPosition: (point) => set(() => ({ position: point })),
      }),
      {
        name: "forecast-settings",
        partialize: (state) => ({
          userSettings: {
            ...state.userSettings,
          },
          position: state.position,
        }),
        storage: customStorage,
      }
    )
  )
);
