import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "./createSelector";

type UserStore = {
    user: string | null,
    register: (user: string) => void,
    login: (user: string) => void,
    logout: () => void,
    update: (user: string) => void,
    updatePreferences: (newPreferences:any) => void,
    getPreferences: () => Promise<void>,
    status: string,
    message: string | null
};

export const useUserStore = createSelectors(create<UserStore>()(
    persist((set, get) => ({
        user: null,
        status: "",
        message: null,
        register: async (user) => {},
        login: async (user) => {},
        logout: async () => {},
        update: async (user) => {},
        updatePreferences: (newPreferences) => {},
        getPreferences: async () => {},
    }), {
        name: "userStore",
        partialize: (state) => ({
            user: state.user,
        }),
    })
));
