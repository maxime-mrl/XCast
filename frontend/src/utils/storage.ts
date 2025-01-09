import { useAppStore } from "@store/useAppStore";
import { useUserStore } from "@store/useUserStore";
import { PersistStorage } from "zustand/middleware";
import RequestServices from "./requestService";

const userServices = new RequestServices("api/user");

type dbUserSettings = {
    forecastSettings?: {
        model?: string,
        selected?: string,
        level?: number,
        maxHeight?: number,
        position?: Object | false
    },
    units: Map<string, { selected: string }>,
    sync: boolean
}

type localStorage = {
    state: { [key:string]: any },
    version?: number
}

const customStorage:PersistStorage<unknown> = {
    async getItem(name) {
        const { state:{ user } } = JSON.parse(localStorage.getItem("user-store") || "") as localStorage;
        const { state:settings } = JSON.parse(localStorage.getItem("app-settings") || "") as localStorage;
        const localData = JSON.parse(localStorage.getItem(name) || 'null') as localStorage;
        // if no sync or user, use only localStorage
        if (!user || !settings.sync) return localData;
        const dbData = await userServices.get<dbUserSettings>("/settings", undefined, user.token);
        // else merge db with localStorage
        // destructurate localStorage value
        let { state, version } = localData;
        // get db data
        // merge concerned data
        if (/units/.test(name)) state = { ...state, ...dbData.units };
        if (/forecast/.test(name)) {
            const { position, ...otherDbSetting } = dbData.forecastSettings || { position: undefined, otherDbSetting: { } };
            state = { 
                ...state, position,
                userSettings: {  ...state.userSettings, ...otherDbSetting },
            };
        }
        return {
            state,
            version
        };
    },
    async setItem(name, storageValue) {
        // save to localStorage either ways
        localStorage.setItem(name, JSON.stringify(storageValue));
        const sync = useAppStore.getState().sync;
        const user = useUserStore.getState().user;
        // save to db only if we want to (having sync and user)
        if (!sync || !user) return JSON.parse(localStorage.getItem(name) || 'null');
        if (!storageValue.state) return;
        const state = storageValue.state as localStorage["state"];
        // sabe to db the concerned data
        if (/units/.test(name)) await userServices.put("/settings", { units: state }, user.token);
        if (/forecast/.test(name)) await userServices.put("/settings", { forecastSettings: {position: state.position, ...state.userSettings } }, user.token);
    },
    async removeItem(name) {
        localStorage.removeItem(name);
    }
}

export default customStorage;