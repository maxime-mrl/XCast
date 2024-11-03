import { create } from "zustand";
import RequestServices from "./requestService";
import { createSelectors } from "./createSelector";
const authService = new RequestServices("api/map");

interface MapStore {
    mapCapabilities: null | {
        availableModels: string[],
        data: {
            [key: string]: {
                availableTimes: string[],
                dataset: string[]
            }
        }
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
    updateSettings: (newSettings:MapStore["userSettings"]) => void,
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
    const updateTime:MapStore["updateTime"] = (newTime) => {
        // get actuals values
        const settings = get().userSettings;
        const mapCapabilities = get().mapCapabilities?.data;
        if (!settings.time || !settings.model || !mapCapabilities) return;

        // try to update the time
        const time = new Date(settings.time.replace("_", ":"));
        if (newTime.hours) time.setHours(time.getHours() + newTime.hours);
        if (newTime.days) time.setDate(time.getDate() + newTime.days);
        // check time is available
        if (!mapCapabilities[settings.model].availableTimes.find(available => new Date(available.replace("_", ":")).getTime() === time.getTime())) return;
        // save the new time
        const timeStr = time.toISOString().split(':')[0] + "_" + time.toISOString().split(':')[1].split(".")[0] + "Z"
        set({
            userSettings: {
                ...settings,
                time: timeStr,
            }
        })
    }

    // get map capabilities on init
    const getCapabilities = async () => {
        set({ status: "loading" });
        try {
            // fetch data
            const data = await authService.get<{
                [key: string]: {
                    availableTimes: string[],
                    dataset: string[]
                }
            }>("/getcapabilities");
            const mapCapabilities = {
                availableModels: Object.keys(data),
                data,
            }
            // usersettings
            const userSettings = get().userSettings;
            // check model
            if (!userSettings.model || !mapCapabilities.availableModels.find(model => model === userSettings.model)) userSettings.model = mapCapabilities.availableModels[0];
            // check time
            if (!userSettings.time || !data[userSettings.model].availableTimes.find(time => time === userSettings.time)) userSettings.time = data[userSettings.model].availableTimes[0];
            // check selected dataset
            if (!userSettings.selected || !data[userSettings.model].dataset.find(selected => selected === userSettings.selected)) userSettings.selected = data[userSettings.model].dataset[0];

            set({
                mapCapabilities,
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
    getCapabilities()

    return {
        mapCapabilities: null,
        userSettings: {
            model: "arome", // selmected model
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


