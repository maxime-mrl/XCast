import { create } from "zustand";
import RequestServices from "@utils/requestService";
import { createSelectors } from "./createSelector";
import { LatLng } from "leaflet";
const forecastService = new RequestServices("api/forecast");

type forecastCapabilitiesData = {
    [key: string]: {
        availableTimes: string[],
        dataset: {
            [key: string]: {
                names: string[],
                levels: number[]
            }
        }
    }
};

export type forecastData = {
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
}[];

interface ForecastStore {
    forecastCapabilities: null | {
        availableModels: string[],
        data: forecastCapabilitiesData
    },
    forecast: null | forecastData,
    userSettings: {
        model: string | null,
        time: string | null,
        selected: mapDataTypes | null,
        level: number | null
    }
    status: string,
    message: string,
    getCapabilities: () => Promise<void>,
    getForecast: (LatLng: LatLng) => Promise<void>,
    updateSettings: (newSettings:Partial<ForecastStore["userSettings"]>) => void,
    updateTime: (newTime: {
        hours?: 1 | -1,
        days?: 1 | -1
    }) => void
}

export const useForecastStore = createSelectors(create<ForecastStore>()((set, get) => {
    // update users preferences
    const updateSettings:ForecastStore["updateSettings"] = (newSettings) => {
        set((state) => ({ userSettings: {
            ...state.userSettings,
            ...newSettings
        } }))
    };

    // update detailed forecast data
    const getForecast:ForecastStore["getForecast"] = async (LatLng) => {
        set({ status: "loading", forecast: null });
        try {
            const { time, model } = get().userSettings
            const data = await forecastService.get<forecastData>("/point", {...LatLng, time, model});
            set({ forecast: data })
        } catch (err) {
            set({
                status: "error",
                message: forecastService.parseError(err)
            });
        }
    }

    // update selected time
    const updateTime:ForecastStore["updateTime"] = (newTime) => {
        // get actuals values
        const settings = get().userSettings;
        const forecastCapabilities = get().forecastCapabilities?.data;
        if (!settings.time || !settings.model || !forecastCapabilities) return;

        // try to update the time
        const time = new Date(settings.time);
        time.setHours(time.getHours() + (newTime.hours ? newTime.hours : 0));
        time.setDate(time.getDate() + (newTime.days ? newTime.days : 0));

        const timeStr = time.toISOString().split(':00.000Z')[0] + "Z"; // remove unnecessary seconds and miliseconds
        // check time is available
        if (!forecastCapabilities[settings.model].availableTimes.find(available => available === timeStr)) return;
        // save the new time
        updateSettings({ time: timeStr });
    };

    // get map capabilities on init
    const getCapabilities = async () => {
        set({ status: "loading", forecastCapabilities: null });
        try {
            // fetch data
            const data = await forecastService.get<forecastCapabilitiesData>("/getcapabilities");
            const forecastCapabilities = {
                availableModels: Object.keys(data),
                data,
            };

            // init usersettings
            const userSettings = get().userSettings;
            // check model
            if (!userSettings.model || !forecastCapabilities.availableModels.find(model => model === userSettings.model))
                userSettings.model = forecastCapabilities.availableModels[0];
            // check time
            if (!userSettings.time || !data[userSettings.model].availableTimes.find(time => time === userSettings.time))
                userSettings.time = data[userSettings.model].availableTimes[0];
            // check selected dataset
            const datasets = Object.keys(data[userSettings.model].dataset) as mapDataTypes[];
            if (!userSettings.selected || !datasets.find(selected => selected === userSettings.selected))
                userSettings.selected = datasets[0];
            // set state
            set({
                forecastCapabilities,
                userSettings,
                status: "success",
                message: ""
            });
        } catch (err) {
            set({
                status: "error",
                message: forecastService.parseError(err)
            });
        }
    };
    getCapabilities();

    return {
        forecastCapabilities: null,
        forecast: null,
        userSettings: {
            model: "arome", // selected model
            time: null, // selected time
            selected: null, // selected dataset
            level: 0 // selected level implemented later
        },
    
        status: "",
        message: "",
        updateSettings,
        getCapabilities,
        getForecast,
        updateTime
    }
}));


