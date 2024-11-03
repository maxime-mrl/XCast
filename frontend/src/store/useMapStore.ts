import { create } from "zustand";
import RequestServices from "./requestService";
import { createSelectors } from "./createSelector";
const authService = new RequestServices("api/map");

interface MapStore {
    mapCapabilities: null | object,
    status: string,
    message: string,
    getCapabilities: () => Promise<void>,
}

export const useMapStore = createSelectors(create<MapStore>()((set) => ({
    mapCapabilities: null,
    status: "",
    message: "",
    getCapabilities: async () => {
        set({ status: "loading" });
        try {
            const data = await authService.get<object>("/getcapabilities");
            set({
                mapCapabilities: data,
                status: "success",
                message: ""
            });
        } catch (err) {
            set({
                status: "error",
                message: authService.parseError(err)
            });
        }

    }
})))

