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

type userInfos = {
  mail: string;
  username: string;
  password: string;
  confirmPassword?: string;
};

type UserStore = {
  // user data
  user: user | null;

  // user actions
  register: (user: userInfos) => void;
  login: (user: Partial<userInfos>) => void;
  updateAccount: (user: Partial<userInfos>) => void;
  deleteAccount: (confirmPassword: string) => void;
  logout: () => void;

  // sync preferences
  sync: boolean;
  toggleSync: () => void;

  // acount panel
  isRegisterOpen: boolean;
  isLoginOpen: boolean;
  isAccountOpen: boolean;
  setIsRegisterOpen: (isOpen: boolean) => void;
  setIsLoginOpen: (isOpen: boolean) => void;
  setIsAccountOpen: (isOpen: boolean) => void;
  closeAll: () => void;

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
        isAccountOpen: false,

        setIsRegisterOpen: (isOpen) => {
          if (isOpen) get().closeAll();
          set({ isRegisterOpen: isOpen });
        },
        setIsLoginOpen: (isOpen) => {
          if (isOpen) get().closeAll();
          set({ isLoginOpen: isOpen });
        },
        setIsAccountOpen: (isOpen) => {
          if (isOpen) get().closeAll();
          set({ isAccountOpen: isOpen });
        },
        closeAll: () =>
          set({
            // make sure only one panel is open
            isRegisterOpen: false,
            isLoginOpen: false,
            isAccountOpen: false,
          }),

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
        updateAccount: async (user) => {
          set({ status: "loading" });
          try {
            const updatedUser = await userServices.put<user>(
              "/update",
              user,
              get().user?.token
            );
            set({
              user: updatedUser,
              status: "success",
              message: "Vos informations ont bien été mises à jour",
            });
          } catch (err) {
            set({
              status: "error",
              message: userServices.parseError(err),
            });
          }
        },
        deleteAccount: async (confirmPassword) => {
          set({ status: "loading" });
          try {
            await userServices.delete(
              "/delete",
              { confirmPassword },
              get().user?.token
            );
            set({
              user: null,
              status: "success",
              message: "Votre compte a bien été supprimé",
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
