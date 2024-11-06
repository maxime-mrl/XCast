import { create } from "zustand";
import RequestServices from "./requestService";
import { createSelectors } from "./createSelector";
const authService = new RequestServices("api/map");

type mapCapabilitiesData = {
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

interface MapStore {
    mapCapabilities: null | {
        availableModels: string[],
        data: mapCapabilitiesData
    },
    userSettings: {
        model: string | null,
        time: string | null,
        selected: string | null,
        level: number | null
    }
    status: string,
    message: string,
    getCapabilities: () => Promise<void>,
    updateSettings: (newSettings:Partial<MapStore["userSettings"]>) => void,
    updateTime: (newTime: {
        hours?: 1 | -1,
        days?: 1 | -1
    }) => void
}

export const useMapStore = createSelectors(create<MapStore>()((set, get) => {
    // update users preferences
    const updateSettings:MapStore["updateSettings"] = (newSettings) => {
        set((state) => ({ userSettings: {
            ...state.userSettings,
            ...newSettings
        } }))
    };

    // update selected time
    const updateTime:MapStore["updateTime"] = (newTime) => {
        // get actuals values
        const settings = get().userSettings;
        const mapCapabilities = get().mapCapabilities?.data;
        if (!settings.time || !settings.model || !mapCapabilities) return;

        // try to update the time
        const time = new Date(settings.time);
        time.setHours(time.getHours() + (newTime.hours ? newTime.hours : 0));
        time.setDate(time.getDate() + (newTime.days ? newTime.days : 0));

        const timeStr = time.toISOString().split(':00.000Z')[0] + "Z"; // remove unnecessary seconds and miliseconds
        // check time is available
        if (!mapCapabilities[settings.model].availableTimes.find(available => available === timeStr)) return;
        // save the new time
        updateSettings({ time: timeStr });
    }

    // get map capabilities on init
    const getCapabilities = async () => {
        set({ status: "loading" });
        try {
            // fetch data
            const data = await authService.get<mapCapabilitiesData>("/getcapabilities");
            const mapCapabilities = {
                availableModels: Object.keys(data),
                data,
            };

            // init usersettings
            const userSettings = get().userSettings;
            // check model
            if (!userSettings.model || !mapCapabilities.availableModels.find(model => model === userSettings.model))
                userSettings.model = mapCapabilities.availableModels[0];
            // check time
            if (!userSettings.time || !data[userSettings.model].availableTimes.find(time => time === userSettings.time))
                userSettings.time = data[userSettings.model].availableTimes[0];
            // check selected dataset
            const datasets = Object.keys(data[userSettings.model].dataset)
            if (!userSettings.selected || !datasets.find(selected => selected === userSettings.selected))
                userSettings.selected = "wind"; //datasets[0];
            // set state
            set({
                mapCapabilities,
                userSettings,
                status: "success",
                message: ""
            });
            console.log("setcapabilities")
        } catch (err) {
            set({
                status: "error",
                message: authService.parseError(err)
            });
        }
    };
    getCapabilities();

    return {
        mapCapabilities: null,
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
        updateTime
    }
}));


