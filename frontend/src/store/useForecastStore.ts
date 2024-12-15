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
    level: number, // actual model elevation
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
    }[]
};

interface ForecastStore {
    forecastCapabilities: null | {
        availableModels: string[],
        data: forecastCapabilitiesData
    },
    forecast: null | forecastData,
    userSettings: {
        model: string,
        time: string | null,
        selected: mapDataTypes | "",
        level: number | null
    },
    position: false | LatLng,
    status: string,
    message: string,
    setPosition: (point: false|LatLng) => void,
    getCapabilities: () => Promise<void>,
    getForecast: (LatLng: LatLng) => Promise<void>,
    updateSettings: (newSettings:Partial<ForecastStore["userSettings"]>) => void,
    updateTime: (newTime: {
        hours?: 1 | -1,
        days?: 1 | -1
    }) => void,
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
            const { time, model } = get().userSettings;
            const data = await forecastService.get<forecastData>("/point", {...LatLng, time, model});
            set({ forecast: data, status: "success", message: "" });
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
        const capabilities = get().forecastCapabilities?.data;
        if (!settings.time || !settings.model || !capabilities) return;

        const availableTimes = capabilities[settings.model].availableTimes;

         // if time not available reset back to an existing one
        if (!availableTimes.find(available => available === settings.time)) {
            updateSettings({ time: availableTimes[0] });
            return;
        }

        // try to update the time
        const time = new Date(settings.time);
        time.setHours(time.getHours() + (newTime.hours || 0));
        time.setDate(time.getDate() + (newTime.days || 0));

        const timeStr = time.toISOString().split(':00.000Z')[0] + "Z"; // remove unnecessary seconds and miliseconds
        // check time is available
        if (!availableTimes.find(available => available === timeStr)) return; // if new time not available keep the old one    
        // save the new time
        updateSettings({ time: timeStr });
    };

    const setPosition:ForecastStore["setPosition"] = (point) => set(() => ({ position: point }));

    // get map capabilities on init
    const getCapabilities = async () => {
        set({ status: "loading", forecastCapabilities: null });
        try {
            // fetch data
            const data = await forecastService.get<forecastCapabilitiesData>("/getcapabilities");
            const availableModels = Object.keys(data);

            // init usersettings
            const userSettings = get().userSettings;
            // check model
            const model = availableModels.includes(userSettings.model) ? userSettings.model : availableModels[0];
            const modelData = data[model];
            // check time
            const time = modelData.availableTimes.includes(userSettings.time!) ? userSettings.time : modelData.availableTimes[0];
            // check selected dataset
            const datasets = Object.keys(modelData.dataset) as mapDataTypes[];
            const selected = datasets.includes(userSettings.selected as mapDataTypes) ? userSettings.selected : datasets[0];
            // set state
            set({
                forecastCapabilities: { availableModels, data },
                userSettings: {
                    ...userSettings,
                    model,
                    time,
                    selected
                },
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
            model: "", // selected model
            time: null, // selected time
            selected: "", // selected dataset
            level: 0 // selected level implemented later
        },
        position: false,
        status: "",
        message: "",
        updateSettings,
        getCapabilities,
        getForecast,
        updateTime,
        setPosition,
    }
}));


