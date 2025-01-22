import { dbUserSettings } from "types/customTypes";
import { useUserStore } from "@store/useUserStore";
import { PersistStorage } from "zustand/middleware";
import RequestServices from "./requestService";

type localStorage = {
  state: Record<string, any>;
  version?: number;
};

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
    // either no cache or cache expired
    if (
      !this.cache ||
      !this.cacheTime ||
      this.cacheTime < Date.now() - this.cacheTimeout
    ) {
      this.cacheTime = Date.now();
      this.cache = this.service.get<dbUserSettings>("", undefined, token);
    }
    return (await this.cache) as dbUserSettings;
  }

  async set(data: object, token: string) {
    await this.service.put("", data, token);
  }
}

const dbHandler = new DbData();

export const customStorage: PersistStorage<unknown> = {
  async getItem(name) {
    // get stored data
    const {
      state: { user, sync },
    } = JSON.parse(localStorage.getItem("user-store") || "") as localStorage; // sync settings
    const localData = JSON.parse(
      localStorage.getItem(name) || ""
    ) as localStorage; // actual data
    // if no sync or user, use only localStorage
    if (!user || (!sync && !/app/.test(name))) return localData;

    // else merge db with localStorage
    const dbData = await dbHandler.get(user.token);
    // destructurate localStorage value
    let { state, version } = localData || { state: undefined, version: 0 };
    // merge concerned data
    if (/units/.test(name)) state = { ...state, ...dbData.units };
    if (/forecast/.test(name)) {
      const { position, ...otherDbSetting } = dbData.forecastSettings || {
        position: undefined,
        otherDbSetting: {},
      };
      state = {
        ...state,
        position,
        userSettings: { ...state.userSettings, ...otherDbSetting },
      };
    }
    return {
      state,
      version,
    };
  },
  async setItem(name, storageValue) {
    const state = storageValue.state as localStorage["state"];
    // check if we have null values
    if (isObjectHasNull(state)) return;
    // check if there is a change
    const localData = JSON.parse(
      localStorage.getItem(name) || "null"
    ) as localStorage;
    if (JSON.stringify(localData) === JSON.stringify(storageValue)) return;
    // save to localStorage
    localStorage.setItem(name, JSON.stringify(storageValue));
    const { user, sync } = useUserStore.getState();
    // save to db only if we want to (having sync and user)
    if (!user || (!sync && !/app/.test(name))) return;
    if (!storageValue.state) return;
    // save to db the concerned data
    if (/units/.test(name)) await dbHandler.set({ units: state }, user.token);
    if (/forecast/.test(name))
      await dbHandler.set(
        {
          forecastSettings: { position: state.position, ...state.userSettings },
        },
        user.token
      );
  },
  async removeItem(name) {
    // not sure if when it's used but at least it's here
    localStorage.removeItem(name);
  },
};

// check if object has null values inside (support nested objects)
function isObjectHasNull(obj: object): boolean {
  return Object.values(obj).some((val) => {
    if (val === null || val === undefined) return true;
    if (typeof val === "object") return isObjectHasNull(val);
    return false;
  });
}
