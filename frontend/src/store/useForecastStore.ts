import { create } from "zustand";
import RequestServices from "./requestService";
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
}

interface ForecastStore {
    forecastCapabilities: null | {
        availableModels: string[],
        data: forecastCapabilitiesData
    },
    forecast: null | {

    }
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
            const data = await forecastService.get<forecastCapabilitiesData>("/point", {...LatLng, time, model});
            console.log(data)
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
            console.log(forecastCapabilities)
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


