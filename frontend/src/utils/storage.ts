import { useAppStore } from "@store/useAppStore";
import { useUserStore } from "@store/useUserStore";
import { PersistStorage } from "zustand/middleware";
import RequestServices from "./requestService";

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

class DbData {
    private service: RequestServices;
    private cacheTime: number;
    private cache: Promise<dbUserSettings> | null;
    private cacheTimeout: number;
    
    constructor() {
        this.service = new RequestServices("api/user/settings");
        this.cacheTime = 0;
        this.cache = null;
        this.cacheTimeout = 10 * 1000;
    }
    
    async get(token: string) {
        // either no cach or cach expired
        if (!this.cache || !this.cacheTime || this.cacheTime < Date.now() - this.cacheTimeout) {
            this.cacheTime = Date.now();
            this.cache = this.service.get<dbUserSettings>("", undefined, token);
        }
        return await this.cache as dbUserSettings;
    }
    
    async set(data:object, token:string) {
        await this.service.put("", data, token);
    }
}

const dbHandler = new DbData();

export const customStorage:PersistStorage<unknown> = {
    async getItem(name) {
        console.log(`Hydrating ${name}`);
        const { state:{ user } } = JSON.parse(localStorage.getItem("user-store") || "") as localStorage;
        const { state:settings } = JSON.parse(localStorage.getItem("app-settings") || "") as localStorage;
        const localData = JSON.parse(localStorage.getItem(name) || 'null') as localStorage;
        // if no sync or user, use only localStorage, exept for app so we check if remote want to sync
        if (!user || (!settings.sync && !/app/.test(name))) return localData;

        // else merge db with localStorage
        const dbData = await dbHandler.get(user.token);
        // destructurate localStorage value
        let { state, version } = localData || { state: undefined, version: 0 };
        // merge concerned data
        if (/units/.test(name)) state = { ...state, ...dbData.units };
        if (/forecast/.test(name)) {
            const { position, ...otherDbSetting } = dbData.forecastSettings || { position: undefined, otherDbSetting: { } };
            state = {
                ...state, position,
                userSettings: {  ...state.userSettings, ...otherDbSetting },
            };
        }
        if (/app/.test(name)) state = { ...state, sync: dbData.sync }
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
        if (!user || (!sync && !/app/.test(name))) return;
        if (!storageValue.state) return;
        const state = storageValue.state as localStorage["state"];
        // sabe to db the concerned data
        if (/units/.test(name)) await dbHandler.set({ units: state }, user.token);
        if (/forecast/.test(name)) await dbHandler.set({ forecastSettings: { position: state.position, ...state.userSettings } }, user.token);
        if (/app/.test(name)) await dbHandler.set({ sync: state.sync }, user.token);
    },
    async removeItem(name) {
        localStorage.removeItem(name);
    }
}
