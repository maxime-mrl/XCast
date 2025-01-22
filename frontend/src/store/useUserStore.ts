import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "@utils/createSelector";
import RequestServices from "@utils/requestService";
const userServices = new RequestServices("api/user");

type user = {
  _id: string;
  username: string;
  token: string;
};

type UserStore = {
  // user data
  user: user | null;

  // user actions
  register: (user: {
    mail: string;
    username: string;
    password: string;
  }) => void;
  login: (user: { mail: string; password: string }) => void;
  logout: () => void;
  update: (user: string) => void;

  // sync preferences
  sync: boolean;
  toggleSync: () => void;

  // acount panel
  isRegisterOpen: boolean;
  isLoginOpen: boolean;
  setIsRegisterOpen: (isOpen: boolean) => void;
  setIsLoginOpen: (isOpen: boolean) => void;

  status: string;
  message: string | null;
};

export const useUserStore = createSelectors(
  create<UserStore>()(
    persist(
      (set, get) => ({
        user: null,
        status: "",
        message: null,
        sync: false,
        isRegisterOpen: false,
        isLoginOpen: false,

        setIsRegisterOpen: (isOpen) => {
          if (isOpen) get().setIsLoginOpen(false); // make sure both modals are not oppened at the same time
          set({ isRegisterOpen: isOpen });
        },
        setIsLoginOpen: (isOpen) => {
          if (isOpen) get().setIsRegisterOpen(false); // make sure both modals are not oppened at the same time
          set({ isLoginOpen: isOpen });
        },
        register: async (newUser) => {
          set({ status: "loading" });
          const userToSave = { ...newUser, settings: { sync: false } };
          try {
            const user = await userServices.post<user>("/register", userToSave);
            set({
              user,
              status: "success",
              message: `Bienvenue ${user.username}`,
            });
          } catch (err) {
            set({
              status: "error",
              message: userServices.parseError(err),
            });
          }
        },
        login: async (loginUser) => {
          set({ status: "loading" });
          try {
            const user = await userServices.post<user>("/login", loginUser);
            set({
              user,
              status: "success",
              message: `Content de vous revoir ${user.username}`,
            });
          } catch (err) {
            set({
              status: "error",
              message: userServices.parseError(err),
            });
          }
        },
        logout: () => {
          set({ user: null, status: "success", message: "A bientôt" });
        },
        update: async (user) => {},
        toggleSync: () => {
          // check if user is logged in (user store)
          // if not logged in, open register panel
          if (!get().user) get().setIsRegisterOpen(true);
          // else toggle sync
          else set((prev) => ({ sync: !prev.sync }));
        },
      }),
      {
        name: "user-store",
        partialize: (state) => ({
          user: state.user,
          sync: state.sync,
        }),
      }
    )
  )
);
