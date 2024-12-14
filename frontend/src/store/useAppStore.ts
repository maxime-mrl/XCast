import { create } from "zustand";
import { createSelectors } from "./createSelector";

type AppStore = {
    isSettingsOpen: boolean,
    toggleSettings: () => void
};

export const useAppStore = createSelectors(create<AppStore>()((set, get) => {
    // const toggleSettings:AppStore["toggleSettings"]

    return {
        isSettingsOpen: false,
        toggleSettings: () => set((prev) => ({ isSettingsOpen: !prev.isSettingsOpen }))
    }
}));