import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "./createSelector";
import RequestServices from "@utils/requestService";
const userServices = new RequestServices("api/user");

type user = {
    _id:string,
    username:string,
    token:string
};

type UserStore = {
    user: user | null,
    register: (user: { mail: string, username:string, password:string }) => void,
    login: (user: { mail: string, password:string }) => void,
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
        register: async (newUser) => {
            set({ status: "loading" });
            const userToSave = { ...newUser, settings: { sync: false } };
            try {
                const user = await userServices.post<user>("/register", userToSave);
                set({ user, status: "success", message: `Bienvenue ${user.username}` });
            } catch (err) {
                set({
                    status: "error",
                    message: userServices.parseError(err)
                });
            }
        },
        login: async (loginUser) => {
            set({ status: "loading" });
            console.log("login");
            try {
                const user = await userServices.post<user>("/login", loginUser);
                console.log(user);
                set({ user, status: "success", message: `Content de vous revoir ${user.username}` });
            } catch (err) {
                console.log(err);
                set({
                    status: "error",
                    message: userServices.parseError(err)
                });
            }
        },
        logout: () => {
            set({ user: null, status: "success", message: "A bientôt" });
        },
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
